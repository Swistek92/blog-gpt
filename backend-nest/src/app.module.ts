import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import dbConfig from './config/db.config';
import dbConfigProduction from './config/db.config.production';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './Auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { PostsModule } from './posts/posts.module';
import { BullModule } from '@nestjs/bull';
import { TranslationQueueModule } from './translation-queue/translation-queue.module';
import { TRANSLATION_QUEUE } from '@/const';
import { OpenaiModule } from './openai/openai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [dbConfig, dbConfigProduction],
    }),
    TypeOrmModule.forRootAsync({
      useFactory:
        process.env.NODE_ENV === 'production' ? dbConfigProduction : dbConfig,
    }),
    
// BullModule.forRoot({
//   redis: {
//     host: process.env.REDIS_HOST,
//     port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
//     password: process.env.REDIS_PASSWORD,
//     tls: {}, 
//   },
// }),

BullModule.registerQueue({
  name: TRANSLATION_QUEUE,
}),  

BullModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    redis: {
      host: configService.get('REDIS_HOST'),
      port: configService.get('REDIS_PORT'),
      password: configService.get('REDIS_PASSWORD'),
      tls:{}

    },
  }),
  inject: [ConfigService],
}),

  UserModule,
AuthModule,
UploadModule,
PostsModule,
TranslationQueueModule,
OpenaiModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
