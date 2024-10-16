import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(55)
  title: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(10000)
  desc: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  primaryDesc: string;

  @IsOptional()
  @IsString()
  categoryId: string;
}
