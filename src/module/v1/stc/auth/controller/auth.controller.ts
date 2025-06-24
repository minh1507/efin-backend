import { Body, Controller, Post, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LoggerService } from 'src/module/share/logger/logger.service';
import SysHelper from 'src/util/sys.util';
import { 
  LoginDto, 
  RegisterDto, 
  RefreshTokenDto, 
  ClientAuthDto 
} from '../dto/auth.dto';
import { AuthService } from '../service/auth.service';
import { Public } from '../../../decorator/guard.decorator';
import { SimpleJwtGuard } from '../../../guard/simple-jwt.guard';

@Controller(SysHelper.getPath(__dirname, 'auth'))
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private readonly logger: LoggerService,
    private readonly authService: AuthService,
  ) {}

  @Post('/login')
  @Public()
  @ApiOperation({ summary: 'User login with client credentials' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Login successful' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
  public async login(@Body() param: LoginDto) {
    this.logger.trace(
      `Start login with client: ${param.clientId}, username: ${param.username}`,
      'CONTROLLER',
    );

    const response = await this.authService.login(param);

    return {
      message: 'Login successful',
      data: response,
    };
  }

  @Post('/register')
  @Public()
  @ApiOperation({ summary: 'Register new user for a client' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Registration successful' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Username already exists' })
  public async register(@Body() param: RegisterDto) {
    this.logger.trace(
      `Start register with client: ${param.clientId}, username: ${param.username}`,
      'CONTROLLER',
    );

    await this.authService.register(param);

    return {
      message: 'User registered successfully',
    };
  }

  @Post('/refresh-token')
  @Public()
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Token refreshed successfully' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid refresh token' })
  public async refreshToken(@Body() param: RefreshTokenDto) {
    this.logger.trace('Start refresh token', 'CONTROLLER');

    const response = await this.authService.refreshToken(param);

    return {
      message: 'Token refreshed successfully',
      data: response,
    };
  }

  @Post('/validate-client')
  @Public()
  @ApiOperation({ summary: 'Validate client credentials' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Client validated successfully' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid client credentials' })
  public async validateClient(@Body() param: ClientAuthDto) {
    this.logger.trace(`Start validate client: ${param.clientId}`, 'CONTROLLER');

    const client = await this.authService.validateClientAuth(param);

    return {
      message: 'Client validated successfully',
      data: {
        id: client.id,
        name: client.name,
        authorizationType: client.authorizationType,
        supportedAuthTypes: client.supportedAuthTypes,
      },
    };
  }

  @Post('/logout')
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Logout successful' })
  @ApiBearerAuth()
  @UseGuards(SimpleJwtGuard)
  public async logout(@Request() req: any) {
    this.logger.trace('Start logout', 'CONTROLLER');
    
    const user = req.user;
    await this.authService.logout(user.userId, user.clientId);

    return {
      message: 'Logout successful',
    };
  }
}
