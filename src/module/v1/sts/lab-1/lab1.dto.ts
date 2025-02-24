import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class Led {
  @ApiProperty({
    type: String,
  })
  @IsOptional()
  name: string;

  @ApiProperty({
    type: String,
  })
  @IsOptional()
  status: string;
}

export class SetLeds {
  @ApiProperty({
    type: [Led], // Array of Led objects
  })
  @IsOptional()
  leds: Led[];
}

export class SetWifi {
  @ApiProperty({
    type: String,
  })
  @IsOptional()
  ssid: string;

  @ApiProperty({
    type: String,
  })
  @IsOptional()
  password: string;

  @ApiProperty({
    type: Boolean,
  })
  @IsOptional()
  connect: boolean;
}
