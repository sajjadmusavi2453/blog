import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { PostsService } from 'src/posts/posts.service';
import { plainToInstance } from 'class-transformer';
import { CommentDto } from './dtos/comment.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    private postsService: PostsService,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    userId: string,
  ): Promise<Comment> {
    const { postId, text } = createCommentDto;
    const post = await this.postsService.findById(postId);
    if (!post) {
      throw new BadRequestException('invalid post id !!!');
    }
    const comment = this.commentRepository.create({
      text,
      writer: { id: userId },
      post,
    });
    return await this.commentRepository.save(comment);
  }
  async findAll(id: string) {
    // : Promise<Comment[]>
    const post = await this.postsService.findById(id);
    if (!post) {
      throw new BadRequestException('invalid post id !!!');
    }
    const comments = await this.commentRepository.find({
      where: { post },
      relations: ['writer'],
    });
    const responseData = plainToInstance(CommentDto, comments, {
      strategy: 'exposeAll',
    });
    return responseData;
  }
  async update(
    updateCommentDto: UpdateCommentDto,
    id: string,
    userId: string,
  ): Promise<Comment> {
    const comment = await this.findById(id);
    comment.text = updateCommentDto.text;
    console.log(comment);

    if (comment.writer.id && comment.writer.id !== userId) {
      throw new ForbiddenException('an error acoure');
    }
    return await this.commentRepository.save(comment);
  }
  async findById(id: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['writer'],
      select: { writer: { id: true, name: true } },
    });
    if (!comment) {
      throw new NotFoundException('invalid comment id !!!');
    }
    // return plainToInstance(CommentDto, comment, { strategy: 'exposeAll' });
    return comment;
  }
  async delete(commentId :string ,userId : string) : Promise<Comment>{
    const comment = await this.findById(commentId);
    if(!comment){
      throw new NotFoundException('invalid comment id !!!')
    }
    if(comment.writer.id !== userId){
      throw new ForbiddenException()
    }
    return await this.commentRepository.remove(comment)
  }
}
