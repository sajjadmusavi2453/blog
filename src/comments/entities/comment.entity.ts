import { Rate } from 'src/enums/reate';
import { Post as SinglePost } from 'src/posts/entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  text: string;
  @Column({ enum: Rate, default: Rate.NORMAL })
  rate: Rate;

  @ManyToOne((type) => User, (user) => user.comments)
  writer: User;

  @ManyToOne((type) => SinglePost, (post) => post.comments)
  post: SinglePost;
}
