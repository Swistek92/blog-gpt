import { Controller, Post, UploadedFile, UseInterceptors, Query } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { UploadService } from './upload.service'

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Query('type') type: 'posts' | 'avatars' = 'posts',
  ) {
    const url = await this.uploadService.uploadImage(file, type)
    return { url }
  }
}
