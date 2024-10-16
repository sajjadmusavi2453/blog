import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { unlinkSync } from 'fs';
import { plainToClass, plainToInstance } from 'class-transformer';
import { CategoryDto } from './dtos/category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}
  async findAll() {
    return await this.categoryRepository.find();
  }
  async findById(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['posts'],
    });
    if (!category) {
      throw new BadRequestException(`invalid category id`);
    }
    return category;
  }

  async findByTitle(title: string): Promise<Category> {
    return await this.categoryRepository.findOne({ where: { title } });
  }

  async create(
    createCategoryDto: CreateCategoryDto,
    path: string,
  ): Promise<Category> {
    const { title } = createCategoryDto;
    const isExists = await this.findByTitle(title);
    if (isExists) {
      unlinkSync(path);
      throw new ConflictException('category is exists');
    }
    const category = this.categoryRepository.create({ title, imagePath: path });
    return await this.categoryRepository.save(category);
  }
  async update(
    createCategoryDto: CreateCategoryDto,
    imagePath: string,
    id: string,
  ): Promise<CategoryDto> {
    const isExists = await this.findById(id);
    if (!isExists) {
      unlinkSync(imagePath);
      throw new NotFoundException('invalid category id !!!');
    }

    unlinkSync(isExists.imagePath);
    isExists.imagePath = imagePath;
    isExists.title = createCategoryDto.title;
    const updatedCategory = await this.categoryRepository.save(isExists);
    console.log(updatedCategory, 'ksakas');

    const responsePost = plainToInstance(CategoryDto, updatedCategory, {
      excludeExtraneousValues:true
    });
    console.log(responsePost, 'pppp');
    return responsePost;
  }
}
