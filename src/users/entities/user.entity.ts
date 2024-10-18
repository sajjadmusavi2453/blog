import { Exclude } from 'class-transformer';
import { Role } from 'src/enums/role';
import { Comment as UserComment } from 'src/comments/entities/comment.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column({ enum: Role })
  role: Role;

  @Exclude()
  @Column()
  password: string;

  @OneToMany((type) => UserComment, (comment) => comment.writer)
  comments: UserComment[];
}
