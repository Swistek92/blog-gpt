import { Module } from '@nestjs/common';
import { PostEN } from '../entities/postEN.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from '../Auth/guards/jwt-auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { PostDE, PostFR, PostIT, PostPL, PostZH } from '../entities';
import { BullModule } from '@nestjs/bull';
import { TRANSLATION_QUEUE } from '@/const';

@Module({
imports: [
    BullModule.registerQueue({
      name: TRANSLATION_QUEUE,
    }),
    TypeOrmModule.forFeature([PostEN, PostPL, PostDE, PostFR, PostIT, PostZH]),
  ],    controllers: [PostsController],
    providers: [PostsService,  {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, //@UseGuards(JwtAuthGuard) applied on all API endppints
    },],
})
export class PostsModule {}
