import { Category } from 'src/categories/entities/category.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  primaryDesc: string;

  @Column()
  desc: string;

  @Column()
  imagePath: string;

  @ManyToOne((type) => Category, (category) => category.posts)
  category: Category;
}
