import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsArray } from 'class-validator';

export class AssignPermissionsToRoleDto {
  @ApiProperty({
    description: 'Permission IDs to assign to the role',
    example: ['uuid1', 'uuid2', 'uuid3'],
    type: [String],
  })
  @IsNotEmpty()
  @IsArray()
  @IsUUID('4', { each: true })
  permissionIds!: string[];
}

export class RemovePermissionsFromRoleDto {
  @ApiProperty({
    description: 'Permission IDs to remove from the role',
    example: ['uuid1', 'uuid2'],
    type: [String],
  })
  @IsNotEmpty()
  @IsArray()
  @IsUUID('4', { each: true })
  permissionIds!: string[];
} 