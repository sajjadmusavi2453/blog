import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(25)
  name: string;

  @IsString()
  @MinLength(2)
  @MaxLength(25)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;
}
