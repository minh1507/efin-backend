import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseClient } from 'src/common/response/success.response';
import { LoggerService } from 'src/module/share/logger/logger.service';
import { TagEnum } from 'src/common/enum/tag.enum';
import SysHelper from 'src/util/sys.util';
import { AuthLoginJWT, AuthRegisterJWT } from '../dto/jwt-auth.dto';
import { JwtAuthService } from '../service/jwt-auth.service';
import { Public } from '../../../decorator/guard.decorator';
import { MessageEnum } from 'src/common/enum/message.enum';

@Controller(SysHelper.getPath(__dirname, 'jwt'))
@ApiTags(TagEnum.AUTH_JWT)
export class JwtAuthController {
  constructor(
    private readonly logger: LoggerService,
    private readonly response: ResponseClient,
    private readonly authService: JwtAuthService,
  ) {}

  @Post('/login')
  @Public()
  public async login(@Body() param: AuthLoginJWT) {
    this.logger.trace(
      `Start login with username: ${JSON.stringify({
        username: param.username,
      })}`,
      'CONTROLLER',
    );

    const response = await this.authService.login(param);

    return this.response.base('POST', response, true, MessageEnum.LOGIN_SUCCESS);
  }

  @Post('/register')
  @Public()
  public async register(@Body() param: AuthRegisterJWT) {
    this.logger.trace(
      `Start register with param: ${JSON.stringify({
        username: param.username,
      })}`,
      'CONTROLLER',
    );

    await this.authService.register(param);

    return this.response.base('POST');
  }
}
