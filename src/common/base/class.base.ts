import { ApiProperty } from '@nestjs/swagger';

export class RelationTypeBase {
  @ApiProperty({
    description: 'Id',
    name: 'id',
    required: true,
    default: 1,
  })
  id!: number;
}
