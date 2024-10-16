import {
  ClassSerializerInterceptor,
  Injectable,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import { createQueryBuilder, Like, Or, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dtos/create-post.dto';
import { CategoriesService } from 'src/categories/categories.service';
import { unlinkSync } from 'fs';
import { plainToClass, plainToInstance } from 'class-transformer';
import { PostDto } from './dtos/post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { PostQueryDto } from './dtos/post-query.dto';

@Injectable()
// @UseInterceptors(ClassSerializerInterceptor)
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    private categoriesService: CategoriesService,
  ) {}

  async create(
    createPostDto: CreatePostDto,
    imagePath: string,
  ): Promise<PostDto> {
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
    const savedPost = await this.postRepository.save(post);
    // Map the response post to the PostDTO
    const responsePost = plainToInstance(PostDto, savedPost);

    return responsePost;
  }
  async findById(id: string): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!post) {
      throw new NotFoundException('invalid post id');
    }
    return post;
  }
  async findAll(query: PostQueryDto) {
    // {
    //   title: Like(`%${query.title}%`),
    //   desc: Like(`%${query.desc}`),
    //   primaryDesc: Like(`%${query.primaryDesc}`),
    // }
    // return await this.postRepository.find({
    //   relations: ['category'],
    // });
    const queryBuilder = this.postRepository.createQueryBuilder('post');
    if (query.search)
      queryBuilder.where(
        `post.title LIKE :search OR post.desc LIKE :search OR post.primaryDesc LIKE :search`,
        {
          search: `%${query.search}%`,
        },
      );
    return await queryBuilder.getMany();
  }

  async findByCategory(id: string) {
    return await this.postRepository.find({ where: { category: { id } } });
  }

  async update(
    postId: string,
    updatePostDto: UpdatePostDto,
    file: Express.Multer.File,
  ) {
    const { categoryId, title, desc, primaryDesc } = updatePostDto;
    console.log(updatePostDto);

    const post = await this.findById(postId);
    if (!post) {
      throw new NotFoundException('invalid post id !!!');
    }
    const category = await this.categoriesService.findById(categoryId);
    if (!category) {
      throw new NotFoundException('invalid category id !!!');
    }
    if (file) {
      unlinkSync(post.imagePath);
      post.imagePath = file.path;
    }
    // post.category = category ?? post.category;
    const savedPost = await this.postRepository.save({
      ...post,
      ...updatePostDto,
    });
    // Map the response post to the PostDTO
    const responsePost = plainToInstance(PostDto, savedPost);

    return responsePost;
  }

  async deleteById(id: string): Promise<Post> {
    const post = await this.findById(id);
    if (!post) {
      throw new NotFoundException('invalid post id');
    }
    return this.postRepository.remove(post);
  }
}
