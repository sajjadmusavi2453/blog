import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { Request } from '../interfaces/request.interface';
import { Comment as SingleComment } from './entities/comment.entity';
import { CommentDto } from './dtos/comment.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtGuard)
  async createComment(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Request,
  ): Promise<SingleComment> {
    return this.commentsService.create(createCommentDto, req.user.id);
  }

  @Get('/:id')
  async getPostComments(@Param('id') postId: string): Promise<CommentDto[]> {
    return this.commentsService.findAll(postId);
  }
  @Patch('/:id')
  @UseGuards(JwtGuard)
  async updateComment(
    @Body() updateCommentDto: UpdateCommentDto,
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<SingleComment> {
    return this.commentsService.update(updateCommentDto, id, req.user.id);
  }

  @Delete('/:id')
  @UseGuards(JwtGuard)
  async deleteComment(@Param('id') id: string , @Req() req : Request) : Promise<SingleComment> {
    return this.commentsService.delete(id, req.user.id)
  }
}
