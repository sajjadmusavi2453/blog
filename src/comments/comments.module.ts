import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment as SingleComment } from './entities/comment.entity';
import { PostsModule } from 'src/posts/posts.module';
@Module({
  imports: [PostsModule, TypeOrmModule.forFeature([SingleComment])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
