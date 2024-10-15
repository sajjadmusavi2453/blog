import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/enums/role';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { Response } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { unlinkSync } from 'fs';
@Controller('categories')
export class CategoriesController {
  private logger = new Logger('CategoriesController');

  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Roles(Role.USER)
  @UseGuards(RoleGuard)
  @UseGuards(JwtGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const fileType = file.originalname.split('.')[1];
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const filename = uniqueSuffix + '-s.' + fileType;
          cb(null, filename);
        },
      }),
    }),
  )
  async createCategory(
    @UploadedFile()
    file: Express.Multer.File,
    // @Body() createCategoryDto: CreateCategoryDto,
    @Body() body: any,
  ) {
    const dto = plainToClass(CreateCategoryDto, body);
    const errors = await validate(dto);

    this.logger.log(`create a category with ${JSON.stringify(dto)}`);
    if (errors.length > 0) {
      unlinkSync(file.path);
      throw new BadRequestException('Invalid request data');
    }
    if (!file) {
      throw new BadRequestException('file is required');
    }

    return this.categoriesService.create(dto, file.path);
  }
  @Get('/images/:imageName')
  serveImage(@Param('imageName') imageName: string, @Res() res: Response) {
    const imagePath = join(__dirname, '..', '..', 'uploads', imageName);
    this.logger.log(`served image : ${imagePath}`);
    return res.sendFile(imagePath);
  }
  @Get()
  findAll() {
    this.logger.log('fetch all categories');
    return this.categoriesService.findAll();
  }
  @Get('/:id')
  findById(@Param('id') id: string) {
    this.logger.log(`fetch category with id :${id}`);
    return this.categoriesService.findById(id);
  }

  @Patch('/:id')
  @Roles(Role.USER)
  @UseGuards(RoleGuard)
  @UseGuards(JwtGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const fileType = file.originalname.split('.')[1];
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const filename = uniqueSuffix + '-s.' + fileType;
          cb(null, filename);
        },
      }),
    }),
  )
  async updateCategory(
    @Body() body: any,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const dto = plainToClass(CreateCategoryDto, body);
    this.logger.log(
      `update category with id : ${id} and dto : ${JSON.stringify(dto)}`,
    );
    if(!file){
      throw new BadRequestException('file is required');

    }
    const error = await validate(dto);
    if (error.length > 0) {
      unlinkSync(file.path);
      throw new BadRequestException('Invalid request data');
    }

    return this.categoriesService.update(dto, file.path, id);
  }
}
