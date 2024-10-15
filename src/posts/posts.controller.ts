import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  Param,
  Logger,
  Res,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { unlinkSync } from 'fs';
import { Post as SinglePost } from './entities/post.entity';
import { join } from 'path';
import { Response } from 'express';

@Controller('posts')
export class PostsController {
  private logger = new Logger('PostsController');
  constructor(private readonly postsService: PostsService) {}

  @Post()
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
  async create(@Body() dto: any, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('file is required');
    }
    const createPostDto = plainToClass(CreatePostDto, dto);
    const error = await validate(createPostDto);
    if (error.length > 0) {
      unlinkSync(file.path);
      console.log(error);

      throw new BadRequestException({
        statusCode: 400,
        message: 'Bad Request',
        error: { field: error[0].property, error: error[0].constraints },
      });
    }
    return this.postsService.create(createPostDto, file.path);
  }

  @Get('/:id')
  async getPosts(@Param('id') id: string): Promise<SinglePost> {
    return this.postsService.findById(id);
  }
  @Get('images/:imagePath')
  async serveImage(
    @Param('imagePath') imageName: string,
    @Res() res: Response,
  ) {
    const imagePath = join(__dirname, '..', '..', 'uploads', imageName);
    this.logger.log(`served image : ${imagePath}`);
    return res.sendFile(imagePath);
  }
}
