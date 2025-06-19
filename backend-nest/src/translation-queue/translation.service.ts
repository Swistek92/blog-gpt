import { Injectable, NotFoundException } from '@nestjs/common';
import { PostDE, PostEN, PostFR, PostIT, PostPL, PostZH } from '../entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OpenaiService } from '../openai/openai.service';
import { Lang } from '@/const';
@Injectable()
export class TranslationService {
  constructor(
    private readonly openaiService: OpenaiService,

    @InjectRepository(PostEN) private postENRepo: Repository<PostEN>,
    @InjectRepository(PostPL) private postPLRepo: Repository<PostPL>,
    @InjectRepository(PostDE) private postDERepo: Repository<PostDE>,
    @InjectRepository(PostFR) private postFRRepo: Repository<PostFR>,
    @InjectRepository(PostIT) private postITRepo: Repository<PostIT>,
    @InjectRepository(PostZH) private postZHRepo: Repository<PostZH>,
  ) {}

  async translatePost(postId: string): Promise<void> {
    const post = await this.postENRepo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException(`Post with ID ${postId} not found`);

    const targets = [
      { lang: Lang.PL, repo: this.postPLRepo },
      { lang: Lang.DE, repo: this.postDERepo },
      { lang: Lang.FR, repo: this.postFRRepo },
      { lang: Lang.IT, repo: this.postITRepo },
      { lang: Lang.ZH, repo: this.postZHRepo },
    ];

    for (const target of targets) {
      console.log(`🔁 Translating post ${postId} to ${target.lang.toUpperCase()}`);

      const translatedTitle = await this.openaiService.translateText(post.title, target.lang);
      const translatedContent = await this.openaiService.translateText(post.content, target.lang);

      const newPost = target.repo.create({
        id: post.id,
        slug: post.slug,
        previewImageUrl: post.previewImageUrl,
        author_id: post.author_id,
        published: post.published,
        title: translatedTitle,
        content: translatedContent,
      });

      await target.repo.save(newPost);
    }

    console.log(`✅ Translations complete for post ${postId}`);
  }
}
