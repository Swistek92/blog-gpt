import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../Auth/guards/jwt-auth/jwt-auth.guard';

@Module({
  controllers: [UploadController],
  providers: [UploadService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard , //@UseGuards(JwtAuthGuard) applied on all API endppints
    },
  ]
})
export class UploadModule {}
