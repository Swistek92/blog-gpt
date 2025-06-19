import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TranslationProcessor } from './translation.processor';
import { TranslationService } from './translation.service';
import { TRANSLATION_QUEUE } from '@/const';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostDE, PostEN, PostFR, PostIT, PostPL, PostZH } from '../entities';
import { OpenaiModule } from '../openai/openai.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: TRANSLATION_QUEUE,
    }),
        TypeOrmModule.forFeature([PostEN, PostPL, PostDE, PostFR, PostIT, PostZH]),
    OpenaiModule
  ],
  providers: [TranslationProcessor, TranslationService],
})
export class TranslationQueueModule {}
