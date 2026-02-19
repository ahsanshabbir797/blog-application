import { ApiProperty } from '@nestjs/swagger';
import { IsJSON, IsNotEmpty } from 'class-validator';

export class CreatePostMetaOptionsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsJSON()
  metaValue: string;
}
