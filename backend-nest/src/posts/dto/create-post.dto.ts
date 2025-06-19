import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: '10 sposobów na szybszy rozwój w IT' })
  @IsString()
  title: string;

  @ApiProperty({ example: '<p>HTML z edytora</p>' })
  @IsString()
  content: string;

  @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
  @IsOptional()
  @IsString()
  previewImageUrl?: string;

  @ApiProperty({ example: '10-sposobow-na-rozwoj' })
  @IsString()
  slug: string;
}
