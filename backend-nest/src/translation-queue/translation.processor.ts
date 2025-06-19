import { OnQueueActive, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { TranslationService } from './translation.service';
import { TRANSLATION_PROCESS_NAME, TRANSLATION_QUEUE } from '@/const';

@Processor(TRANSLATION_QUEUE)
export class TranslationProcessor {
  constructor(private readonly translationService: TranslationService) {}



  @Process(TRANSLATION_PROCESS_NAME)
  async handleTranslation(job: Job<{ postId: string }>) {
    const { postId } = job.data;
    await this.translationService.translatePost(postId);
  }
}
