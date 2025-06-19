// src/posts/posts.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostDE, PostEN, PostFR, PostIT, PostPL, PostZH } from '../entities'
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Lang, AvailableLanguage, TRANSLATION_QUEUE, TRANSLATION_PROCESS_NAME } from '@/const';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEN) private postENRepo: Repository<PostEN>,
    @InjectRepository(PostPL) private postPLRepo: Repository<PostPL>,
    @InjectRepository(PostDE) private postDERepo: Repository<PostDE>,
    @InjectRepository(PostFR) private postFRRepo: Repository<PostFR>,
    @InjectRepository(PostIT) private postITRepo: Repository<PostIT>,
    @InjectRepository(PostZH) private postZHRepo: Repository<PostZH>,
    @InjectQueue(TRANSLATION_QUEUE) private translationQueue: Queue
  ) {}


   async getPosts(lang: AvailableLanguage, skip = 0, limit = 10): Promise<any[]> {
    const repo = this.getRepoByLang(lang);
    return repo.find({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }
  

  async createPost(dto: CreatePostDto, authorId: number): Promise<PostEN> {
    const post = this.postENRepo.create({ ...dto, author_id: authorId });
    const saved = await this.postENRepo.save(post);
    console.log(`Post created with ID: ${saved.id}`);
    await this.queueTranslations(saved.id);
    return saved;
  }
   
  async getPost(id: string, lang: AvailableLanguage = Lang.EN): Promise<any> {
    const repo = this.getRepoByLang(lang);
    const post = await repo.findOne({ where: { id } });
    if (!post) throw new NotFoundException(`Post not found in ${lang}`);
    return post;
  }

  async updatePost(id: string, dto: UpdatePostDto, lang: AvailableLanguage): Promise<any> {
    const repo = this.getRepoByLang(lang);
    await repo.update(id, dto);
    return repo.findOne({ where: { id } });
  }

  async publishPost(id: string): Promise<PostEN> {
    await this.postENRepo.update(id, { published: true });
    const post = await this.postENRepo.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Post not found`);
    }
    return post;
  }

  async queueTranslations(postId: string): Promise<void> {
    try {
      console.log('➡️ Queueing job:', postId);

      const aa = await this.translationQueue.add(TRANSLATION_PROCESS_NAME, { postId },{timeout:5000});
      console.log('✅ Job queued');
    } catch (error) {
      console.error(`Failed to queue translation for post ID: ${postId}`, error);
    }
  }

  private getRepoByLang(lang: AvailableLanguage): Repository<any> {
    switch (lang) {
      case Lang.EN: return this.postENRepo;
      case Lang.PL: return this.postPLRepo;
      case Lang.DE: return this.postDERepo;
      case Lang.FR: return this.postFRRepo;
      case Lang.IT: return this.postITRepo;
      case Lang.ZH: return this.postZHRepo;
      default:
        throw new Error(`Unsupported language: ${lang}`);
    }
  }
}
