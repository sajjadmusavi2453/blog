import { Exclude, Type } from 'class-transformer';
import { Role } from 'src/enums/role';
import { Post } from 'src/posts/entities/post.entity';

export class UserDto {
  @Exclude()
  username: string;
  @Exclude()
  password: string;
  @Exclude()
  role: Role;
}
export class CommentDto {
  text: string;
  @Type(() => UserDto)
  writer: UserDto;
  
}
