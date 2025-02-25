import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/module/share/logger/logger.service';
import { AuthLogin, AuthResponseLogin } from './auth.dto';
import { UserRepository } from '../category/user/user.repository';
import { BadRequestException } from '../../../../common/exeption/bad-request.exeption';
import { MessageEnum } from '../../../../common/enum/message.enum';
import * as bcrypt from 'bcrypt';
import { User } from '../category/user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '../../../share/config/config.service';
import { CachingService } from '../../../share/cache/cache.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly logger: LoggerService,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    private cachingService: CachingService,
  ) {}

  public login = async (param: AuthLogin): Promise<AuthResponseLogin> => {
    this.logger.trace(`[SERVICE] Start login`);

    const user = await this.validateAuthLogin(param);

    const { accessToken, refreshToken } = await this.generateToken(user);

    return new AuthResponseLogin(accessToken, refreshToken);
  };

  private generateToken = async (user: User) => {
    const expiredAccessToken = (await this.configService.getConfig())[
      'TOKEN.ACCESS.KEY.EXPIRED'
    ];

    const expiredRefreshToken = (await this.configService.getConfig())[
      'TOKEN.REFRESH.KEY.EXPIRED'
    ];

    const keyAccess = uuidv4() + user.username;

    const accessToken = this.jwtService.sign(
      {
        key: keyAccess,
        expired: expiredAccessToken,
        createdAt: Date.now(),
      },
      {
        expiresIn: expiredAccessToken,
      },
    );

    await this.cachingService.setCache(keyAccess, JSON.stringify({
      role: user.role,
    }));

    console.log(await this.cachingService.getCache(keyAccess));

    const keyRefresh = uuidv4() + user.username;

    const refreshToken = this.jwtService.sign(
      {
        key: keyRefresh,
        expired: expiredRefreshToken,
        createdAt: Date.now(),
      },
      {
        expiresIn: expiredRefreshToken,
      },
    );

    await this.cachingService.setCache(keyRefresh, 'refresh');
    return { accessToken, refreshToken };
  };

  private validateAuthLogin = async (param: AuthLogin): Promise<User> => {
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
}
