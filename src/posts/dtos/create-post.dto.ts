import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MinLength(5)
  @MaxLength(55)
  title: string;

  @IsString()
  @MinLength(10)
  @MaxLength(10000)
  desc: string;

  @IsString()
  @MinLength(5)
  @MaxLength(200)
  primaryDesc: string;

  @IsString()
  categoryId: string;
}
