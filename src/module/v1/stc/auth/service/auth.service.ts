import { Injectable, UnauthorizedException, NotFoundException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

import { LoggerService } from '@/module/share/logger/logger.service';
import { ConfigService } from '@/module/share/config/config.service';
import { CachingService } from '@/module/share/cache/cache.service';
import { UserRepository } from '../../category/user/user.repository';
import { RefreshTokenRepository } from '../../refresh-token/refresh-token.repository';
import { User } from '../../category/user/user.entity';
import { Client } from '../../client/client.entity';
import { Secret } from '../../category/secret/secret.entity';
import { RolePermission } from '../../role-permission/role-permission.entity';
import {
  LoginDto,
  RegisterDto,
  LoginResponseDto,
  RefreshTokenDto,
  ClientAuthDto,
  AuthType,
} from '../dto/auth.dto';

interface AccessTokenPayload {
  sub: string; // user ID
  username: string;
  clientId: string;
  role: {
    id: string;
    name: string;
    code: string;
  };
  permissions: string[];
  iat: number;
  exp: number;
}

interface CacheUserData {
  userId: string;
  username: string;
  clientId: string;
  role: {
    id: string;
    name: string;
    code: string;
  };
  permissions: string[];
  sessionKey: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly logger: LoggerService,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly configService: ConfigService,
    private readonly cachingService: CachingService,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Secret)
    private readonly secretRepository: Repository<Secret>,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
  ) {}

  public async login(param: LoginDto): Promise<LoginResponseDto> {
    this.logger.trace('[SERVICE] Start login');

    // Validate client credentials first
    await this.validateClientCredentials(param.clientId, param.authType);
    
    // Validate user credentials
    const user = await this.validateAuthLogin(param);
    
    // Generate tokens
    const { accessToken, refreshToken, expiresIn } = await this.generateToken(user);

    // Prepare user response data
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: {
        id: user.role.id,
        name: user.role.name,
        code: user.role.code,
      },
      client: {
        id: user.client.id,
        name: user.client.name,
        authorizationType: user.client.authorizationType,
      },
    };

    return new LoginResponseDto(
      accessToken, 
      refreshToken,
      userResponse,
      'Bearer',
      expiresIn
    );
  }

  public async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<LoginResponseDto> {
    this.logger.trace('[SERVICE] Start refresh token');

    const user = await this.userRepository.findByRefreshToken(refreshTokenDto.refreshToken);
    
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (!user.refreshToken || this.isRefreshTokenExpired(user.refreshToken)) {
      throw new UnauthorizedException('Refresh token expired');
    }

    // Generate new tokens
    const { accessToken, refreshToken, expiresIn } = await this.generateToken(user);

    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: {
        id: user.role.id,
        name: user.role.name,
        code: user.role.code,
      },
      client: {
        id: user.client.id,
        name: user.client.name,
        authorizationType: user.client.authorizationType,
      },
    };

    return new LoginResponseDto(
      accessToken, 
      refreshToken,
      userResponse,
      'Bearer',
      expiresIn
    );
  }

  public async register(param: RegisterDto): Promise<void> {
    this.logger.trace('[SERVICE] Start register');

    // Validate client exists
    const client = await this.clientRepository.findOne({
      where: { id: param.clientId },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    // Check if username already exists for this client
    const existingUser = await this.userRepository.exist(param.username, param.clientId);

    if (existingUser) {
      throw new ConflictException('Username already exists for this client');
    }

    // Create secret (password)
    const hashedPassword = await bcrypt.hash(param.password, 12);
    const secret = this.secretRepository.create({
      password: hashedPassword,
    });
    const savedSecret = await this.secretRepository.save(secret);

    // Create user
    const user = new User();
    user.clientId = param.clientId;
    user.roleId = param.roleId;
    user.username = param.username;
    user.email = param.email;
    user.fullName = param.fullName;
    user.isActive = true;
    user.secretId = savedSecret.id;

    await this.userRepository.save(user);
    this.logger.trace('[SERVICE] User registered successfully');
  }

  public async validateClientAuth(clientAuthDto: ClientAuthDto): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { id: clientAuthDto.clientId },
    });

    if (!client) {
      throw new UnauthorizedException('Invalid client credentials');
    }

    // Ensure client secret is not null
    if (!client.clientSecret) {
      throw new UnauthorizedException('Client secret not configured');
    }

    const isValidSecret = await bcrypt.compare(clientAuthDto.clientSecret, client.clientSecret);
    
    if (!isValidSecret) {
      throw new UnauthorizedException('Invalid client credentials');
    }

    return client;
  }

  private async validateClientCredentials(clientId: string, authType: AuthType = AuthType.JWT): Promise<void> {
    const client = await this.clientRepository.findOne({
      where: { id: clientId },
    });

    if (!client) {
      throw new UnauthorizedException('Client not found');
    }

    if (!client.isActive) {
      throw new UnauthorizedException('Client is inactive');
    }

    // Check if client supports this auth type
    const supportedTypes = client.supportedAuthTypes || [];
    if (!supportedTypes.includes(authType.toString())) {
      throw new UnauthorizedException(`Client does not support ${authType} authentication`);
    }
  }

  private async validateAuthLogin(param: LoginDto): Promise<User> {
    const user = await this.userRepository.findByUsernameAndClient(param.username, param.clientId);

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    this.logger.trace(`[SERVICE] Found user with username = ${param.username}`);

    const isMatch = await bcrypt.compare(param.password, user.secret.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid username or password');
    }

    this.logger.trace(`[SERVICE] Password validated for username = ${param.username}`);
    return user;
  }

  private async generateToken(user: User) {
    this.logger.trace('[SERVICE] Start generate token');

    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(user),
      this.generateRefreshToken(user),
    ]);

    const config = await this.configService.getConfig();
    const expiresIn = parseInt(config['TOKEN.ACCESS.KEY.EXPIRED']) || 3600;

    return { accessToken, refreshToken, expiresIn };
  }

  private async generateAccessToken(user: User): Promise<string> {
    this.logger.trace('[SERVICE] Start generate access token');

    const config = await this.configService.getConfig();
    const expiredAccessToken = config['TOKEN.ACCESS.KEY.EXPIRED'] || '3600';
    const keyAccess = `ACCESS_${user.id}_${user.clientId}`;

    // Get user permissions
    const permissions = await this.getUserPermissions(user.roleId);

    const payload: AccessTokenPayload = {
      sub: user.id,
      username: user.username,
      clientId: user.clientId,
      role: {
        id: user.role.id,
        name: user.role.name,
        code: user.role.code,
      },
      permissions,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + parseInt(expiredAccessToken),
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: expiredAccessToken + 's',
    });

    const cacheData: CacheUserData = {
      userId: user.id,
      username: user.username,
      clientId: user.clientId,
      role: {
        id: user.role.id,
        name: user.role.name,
        code: user.role.code,
      },
      permissions,
      sessionKey: uuidv4(),
    };

    await this.cachingService.setCache(
      keyAccess,
      JSON.stringify(cacheData),
      parseInt(expiredAccessToken) * 1000,
    );

    this.logger.trace('[SERVICE] Generate access token successfully');
    return accessToken;
  }

  private async generateRefreshToken(user: User): Promise<string> {
    this.logger.trace('[SERVICE] Start generate refresh token');

    const config = await this.configService.getConfig();
    const expiredRefreshToken = config['TOKEN.REFRESH.KEY.EXPIRED'] || '2592000'; // 30 days

    if (!user.refreshToken) {
      return this.createNewRefreshToken(user, expiredRefreshToken);
    }

    if (this.isRefreshTokenExpired(user.refreshToken)) {
      return this.updateRefreshToken(user, expiredRefreshToken);
    }

    this.logger.trace('[SERVICE] Using existing refresh token');
    return user.refreshToken.key;
  }

  private async createNewRefreshToken(user: User, expiredRefreshToken: string): Promise<string> {
    this.logger.trace('[SERVICE] Generate new refresh token');

    const hash = await bcrypt.hash(`${expiredRefreshToken}_${uuidv4()}`, 10);
    const now = new Date();
    const validTo = new Date();
    validTo.setSeconds(now.getSeconds() + parseInt(expiredRefreshToken));

    const refreshToken = {
      key: hash,
      validFrom: now,
      validTo: validTo,
      user: user,
    };

    await this.refreshTokenRepository.save(refreshToken);
    return hash;
  }

  private async updateRefreshToken(user: User, expiredRefreshToken: string): Promise<string> {
    this.logger.trace('[SERVICE] Update expired refresh token');

    const refreshToken = user.refreshToken;
    if (!refreshToken) {
      throw new Error('RefreshToken not found for user');
    }
    
    const hash = await bcrypt.hash(`${expiredRefreshToken}_${uuidv4()}`, 10);
    const now = new Date();
    const validTo = new Date();
    validTo.setSeconds(now.getSeconds() + parseInt(expiredRefreshToken));
    
    refreshToken.key = hash;
    refreshToken.validFrom = now;
    refreshToken.validTo = validTo;

    await this.refreshTokenRepository.save(refreshToken);
    return hash;
  }

  private isRefreshTokenExpired(refreshToken: { validFrom: Date | string; validTo: Date | string }): boolean {
    const now = new Date();
    const validFrom = new Date(refreshToken.validFrom);
    const validTo = new Date(refreshToken.validTo);
    
    return validFrom > now || validTo < now;
  }

  private async getUserPermissions(roleId: string): Promise<string[]> {
    const rolePermissions = await this.rolePermissionRepository.find({
      where: { roleId },
      relations: ['permission'],
    });

    return rolePermissions.map(rp => `${rp.permission?.resource || ''}:${rp.permission?.action || ''}`);
  }

  public async logout(userId: string, clientId: string): Promise<void> {
    this.logger.trace('[SERVICE] Start logout');

    // Invalidate cache
    const keyAccess = `ACCESS_${userId}_${clientId}`;
    await this.cachingService.deleteCache(keyAccess);

    this.logger.trace('[SERVICE] User logged out successfully');
  }

  public async validateTokenPayload(payload: any): Promise<CacheUserData | null> {
    const keyAccess = `ACCESS_${payload.sub}_${payload.clientId}`;
    const cachedData = await this.cachingService.getCache(keyAccess);
    
    if (!cachedData) {
      return null;
    }

    try {
      return JSON.parse(cachedData as string);
    } catch (error) {
      this.logger.error('Failed to parse cached user data', error);
      return null;
    }
  }
} 