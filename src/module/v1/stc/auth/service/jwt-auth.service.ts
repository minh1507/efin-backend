import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/module/share/logger/logger.service';
import {
  AuthLoginJWT,
  AuthRegisterJWT,
  AuthResponseLoginJWT,
} from '../dto/jwt-auth.dto';
import { UserRepository } from '../../category/user/user.repository';
import { BadRequestException } from '../../../../../common/exeption/bad-request.exeption';
import { MessageEnum } from '../../../../../common/enum/message.enum';
import * as bcrypt from 'bcrypt';
import { User } from '../../category/user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '../../../../share/config/config.service';
import { CachingService } from '../../../../share/cache/cache.service';
import { RefreshToken } from '../../refresh-token/refresh-token.entity';
import { RefreshTokenRepository } from '../../refresh-token/refresh-token.repository';

@Injectable()
export class JwtAuthService {
  constructor(
    private readonly logger: LoggerService,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private configService: ConfigService,
    private cachingService: CachingService,
  ) {}

  public login = async (param: AuthLoginJWT): Promise<AuthResponseLoginJWT> => {
    this.logger.trace(`[SERVICE] Start login`);

    const user = await this.validateAuthLogin(param);

    const { accessToken, refreshToken } = await this.generateToken(user);

    return new AuthResponseLoginJWT(accessToken, refreshToken);
  };

  private generateToken = async (user: User) => {
    this.logger.trace(`[SERVICE] Start generate token`);

    const accessToken = await this.generateAccessToken(user);

    const refreshToken = await this.generateRefreshToken(user);

    return { accessToken, refreshToken };
  };

  private async generateAccessToken(user: User) {
    this.logger.trace(`[SERVICE] Start generate access token`);

    const expiredAccessToken = (await this.configService.getConfig())[
      'TOKEN.ACCESS.KEY.EXPIRED'
    ];

    const keyAccess = 'ACCESS_' + user.username;

    const accessToken = this.jwtService.sign(
      {
        key: keyAccess,
        expired: expiredAccessToken,
        createdAt: Date.now(),
        lang: user.lang
      },
      {
        expiresIn: expiredAccessToken,
      },
    );

    await this.cachingService.setCache(
      keyAccess,
      JSON.stringify({
        role: {
          name: user.role.name,
        },
        key: uuidv4(),
      }),
      Number(expiredAccessToken) * 1000,
    );

    this.logger.trace(`[SERVICE] Generate access token successfully`);

    return accessToken;
  }

  private async generateRefreshToken(user: User) {
    this.logger.trace(`[SERVICE] Start generate refresh token`);

    const expiredRefreshToken = (await this.configService.getConfig())[
      'TOKEN.REFRESH.KEY.EXPIRED'
    ];

    if(!user.refreshToken){
      this.logger.trace(`[SERVICE] Gen new refresh token`);

      const hash = await bcrypt.hash(expiredRefreshToken + '_' + uuidv4(), 10);

      const now = new Date();
      const dayInFuture = new Date();
      dayInFuture.setDate(now.getDate() + 30)

      const refreshToken = {
        key: hash,
        validFrom: now,
        validTo: dayInFuture.toISOString(),
        user: user
      }

      await this.refreshTokenRepository.save(refreshToken)

      return hash;
    }

    if(new Date(user.refreshToken.validFrom) > new Date() || new Date(user.refreshToken.validTo) < new Date()){ 
      this.logger.trace(`[SERVICE] Token is expired`);

      const refreshToken = user.refreshToken;

      const hash = await bcrypt.hash(expiredRefreshToken + '_' + uuidv4(), 10);

      const now = new Date();
      const dayInFuture = new Date();
      dayInFuture.setDate(now.getDate() + 30)
      
      refreshToken.key = hash;
      refreshToken.validFrom = now;
      refreshToken.validTo = dayInFuture;

      await this.refreshTokenRepository.save(refreshToken)

      return hash;
    }

    this.logger.trace(`[SERVICE] Generate refresh token successfully`);

    return user.refreshToken.key;
  }

  private validateAuthLogin = async (param: AuthLoginJWT): Promise<User> => {
    const user = await this.userRepository.findByUsername(param.username);

    if (!user) {
      throw new BadRequestException(
        MessageEnum.NOT_EXIST_USERNAME,
        this.logger,
      );
    }

    this.logger.trace(`[SERVICE] Found user with username = ${param.username}`);

    const isMatch = await bcrypt.compare(param.password, user.secret.password);

    if (!isMatch) {
      throw new BadRequestException(
        MessageEnum.NOT_EXIST_PASSWORD,
        this.logger,
      );
    }

    this.logger.trace(
      `[SERVICE] Matching password with username = ${param.username}`,
    );

    return user;
  };

  public register = async (param: AuthRegisterJWT): Promise<void> => {
    this.logger.trace(`[SERVICE] Start register`);

    const user = await this.userRepository.findByUsername(param.username);

    if (user)
      throw new BadRequestException(MessageEnum.USERNAME_EXISTED, this.logger);


  };
}
