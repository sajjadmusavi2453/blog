import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { diskStorage } from 'multer';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findByTitle(title: string): Promise<Category> {
    return await this.categoryRepository.findOne({ where: { title } });
  }

  async create(
    createCategoryDto: CreateCategoryDto,
    path: string,
  ): Promise<Category> {
    const { title } = createCategoryDto;
    console.log('here', title);

    const isExists = await this.findByTitle(title);
    console.log('here', isExists);

    if (isExists) {
      throw new ConflictException('category is exists');
    }
    const category = this.categoryRepository.create({ title, imagePath: path });
    return await this.categoryRepository.save(category);
  }
}
