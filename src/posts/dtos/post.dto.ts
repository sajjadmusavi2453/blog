import { Exclude, Expose } from 'class-transformer';
import { Post } from '../entities/post.entity';

export class CategoryDto {
  id: string;
  title: string;
  imagePath: string;
  posts: Post[];
}
export class PostDto {
  id: string;
  title: string;
  desc: string;
  primaryDesc: string;
  imagePath: string;
  category: CategoryDto;
}
