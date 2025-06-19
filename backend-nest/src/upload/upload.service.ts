import { Injectable } from '@nestjs/common'
import { v2 as cloudinary } from 'cloudinary'
import { ConfigService } from '@nestjs/config'
import { Express } from 'express'
import { Multer } from 'multer'

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: configService.get('CLOUDINARY_NAME'),
      api_key: configService.get('CLOUDINARY_KEY'),
      api_secret: configService.get('CLOUDINARY_SECRET'),
    })
  }
  async uploadImage(file: Express.Multer.File, folder: 'posts' | 'avatars'): Promise<string> {
    const b64 = Buffer.from(file.buffer).toString('base64')
    const dataUri = 'data:' + file.mimetype + ';base64,' + b64

    const upload = await cloudinary.uploader.upload(dataUri, {
      folder,
      transformation: [
        { width: 1200, height: 1200, crop: 'limit' }, // resize if needed
        { quality: 'auto', fetch_format: 'auto' }, // optymalizacja
      ],
    })

    return upload.secure_url
  }
}
