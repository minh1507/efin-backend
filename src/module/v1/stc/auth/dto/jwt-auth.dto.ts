import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { MessageEnum } from '../../../../../common/enum/message.enum';

export class AuthLoginJWT {
  @ApiProperty({
    description: 'Username',
    example: 'duongdoican@gmail.com',
    maxLength: 25,
  })
  @IsNotEmpty({ message: MessageEnum.REQUIRED_USERNAME })
  username: string;

  @ApiProperty({
    description: 'Password',
    example: 'Minlvip123!',
  })
  @IsNotEmpty({ message: MessageEnum.REQUIRED_PASSWORD })
  password: string;
}

export class AuthResponseLoginJWT {
  accessToken: string;
  refreshToken: string;

  constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}

export class AuthRegisterJWT {
  @ApiProperty({
    description: 'Username',
    example: 'duongdoican@gmail.com',
    maxLength: 25,
  })
  @IsNotEmpty({ message: MessageEnum.REQUIRED_USERNAME })
  username: string;
}
