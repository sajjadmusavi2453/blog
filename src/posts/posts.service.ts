import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dtos/create-post.dto';
import { CategoriesService } from 'src/categories/categories.service';
import { unlinkSync } from 'fs';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    private categoriesService: CategoriesService,
  ) {}

  async create(createPostDto: CreatePostDto, imagePath: string): Promise<Post> {
    const { title, desc, primaryDesc, categoryId } = createPostDto;
    const category = await this.categoriesService.findById(categoryId);
    if (!category) {
      unlinkSync(imagePath);
      throw new NotFoundException('invalid category id !!!');
    }
    const post = this.postRepository.create({
      title,
      primaryDesc,
      desc,
      category,
      imagePath,
    });
    return await this.postRepository.save(post);
  }
  async findById(id: string): Promise<Post> {
    return await this.postRepository.findOne({ where: { id } });
  }
}
