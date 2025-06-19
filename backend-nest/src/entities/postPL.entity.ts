import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'posts_pl' })
export class PostPL {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  postId: string; // referencja logiczna do PostEN.id

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string; // pełny HTML z tłumaczenia

  @Column({ nullable: true })
  previewImageUrl: string;

  @Column({ unique: true })
  slug: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column()
  author_id: number;

  @Column({ default: true })
  published: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
