import { Exclude } from 'class-transformer';
import { Role } from 'src/enums/role';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
