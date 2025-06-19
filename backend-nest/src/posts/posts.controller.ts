// src/posts/posts.controller.ts
import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../Auth/guards/jwt-auth/jwt-auth.guard';
import { AuthJwtPayload } from '../Auth/types/auth-jwtPayload';
import { Lang, AvailableLanguage, Role } from '@/const';
import { Public } from '../Auth/decorators/public.decorator';
import { RolesGuard } from '../Auth/guards/roles/roles.guard';
import { Roles } from '../Auth/decorators/roles.decorator';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

 @Public()
  @Get()
@ApiOperation({ summary: 'Get paginated posts by language' })
@ApiQuery({ name: 'lang', required: false, enum: Lang, example: Lang.EN })
@ApiQuery({ name: 'skip', required: false, type: Number, example: 0 })
@ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
async getPosts(
  @Query('lang') lang: AvailableLanguage = Lang.EN,
  @Query('skip') skip = 0,
  @Query('limit') limit = 10,
) {
  const parsedSkip = Number(skip) || 0;
  const parsedLimit = Number(limit) || 10;
  return this.postsService.getPosts(lang, parsedSkip, parsedLimit);
}

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get post by ID and language' })
  async getPost(
    @Param('id') id: string,
    @Query('lang') lang: AvailableLanguage = Lang.EN,
  ) {
    return this.postsService.getPost(id, lang);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a post in English (automatically queues translations)' })
  async createPost(
    @Body() dto: CreatePostDto,
    @Req() req: Request & { user: AuthJwtPayload },

  ) {

    return this.postsService.createPost(dto, req.user.sub);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update a post in a given language' })
  async updatePost(
    @Param('id') id: string,
    @Query('lang') lang: AvailableLanguage = Lang.EN,
    @Body() dto: UpdatePostDto,
  ) {
    return this.postsService.updatePost(id, dto, lang);
  }

  @Patch(':id/publish')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Mark a post as published (EN only)' })
  async publish(@Param('id') id: string) {
    return this.postsService.publishPost(id);
  }
}
