import { IsOptional, IsString } from 'class-validator';

export class PostQueryDto {
  @IsOptional()
  @IsString()
  search: string;
}
