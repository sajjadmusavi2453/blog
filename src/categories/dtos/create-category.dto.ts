import {  MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @MinLength(3)
  @MaxLength(45)
  title: string;
}
