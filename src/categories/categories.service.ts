import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { diskStorage } from 'multer';
import { unlinkSync } from 'fs';

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
    return await this.categoryRepository.findOne({ where: { id } });
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
      unlinkSync(path)
      throw new ConflictException('category is exists');
    }
    const category = this.categoryRepository.create({ title, imagePath: path });
    return await this.categoryRepository.save(category);
  }
  async update(
    createCategoryDto: CreateCategoryDto,
    imagePath: string,
    id: string,
  ) {
    const isExists = await this.findById(id);
    if (!isExists) {
      unlinkSync(imagePath);
      throw new NotFoundException('invalid category id !!!');
    }
    
    unlinkSync(isExists.imagePath);
    isExists.imagePath = imagePath;
    isExists.title = createCategoryDto.title;
    return await this.categoryRepository.save(isExists);
  }
}
