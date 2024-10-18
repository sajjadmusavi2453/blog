import { Exclude } from 'class-transformer';
import { Category } from 'src/categories/entities/category.entity';
import { Comment as SingleComment } from 'src/comments/entities/comment.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  primaryDesc: string;

  @Column()
  desc: string;

  @Column()
  imagePath: string;

  @ManyToOne((type) => Category, (category) => category.posts)
  category: Category;
  @OneToMany((type) => SingleComment, (comment) => comment.post)
  comments: SingleComment[];
}
