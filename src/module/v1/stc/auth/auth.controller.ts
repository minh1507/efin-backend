import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseClient } from 'src/common/response/success.response';
import { LoggerService } from 'src/module/share/logger/logger.service';
import { TagEnum } from 'src/common/enum/tag.enum';
import SysHelper from 'src/util/sys.util';
import { AuthLogin } from './auth.dto';
import { AuthService } from './auth.service';
import MaskingHelper from '../../../../util/masking.util';
import { Public } from '../../decorator/guard.decorator';

@Controller(SysHelper.getPath(__dirname))
@ApiTags(TagEnum.AUTH)
export class AuthController {
  constructor(
    private readonly logger: LoggerService,
    private readonly response: ResponseClient,
    private readonly authService: AuthService,
  ) {}

  @Post('/login')
  @Public()
  public async login(@Body() param: AuthLogin) {
    this.logger.trace(
      `Start login with param: ${JSON.stringify({
        ...param,
        password: MaskingHelper.password(param.password),
      })}`,
      'CONTROLLER',
    );

    const response = await this.authService.login(param);

    return this.response.base('POST', response, true);
  }
}
