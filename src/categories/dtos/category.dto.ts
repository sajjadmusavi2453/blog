import { Expose } from 'class-transformer';

export class CategoryDto {
  @Expose()
  id: string;
  @Expose()
  title: string;
  @Expose()
  imagePath: string;
}
