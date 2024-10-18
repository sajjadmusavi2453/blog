import { IsString, MaxLength, MinLength, IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MinLength(5)
  @MaxLength(10000)
  text: string;
  @IsString()
  @IsNotEmpty()
  postId: string;
}
