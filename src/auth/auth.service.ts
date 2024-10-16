import {
  BadRequestException,
  ClassSerializerInterceptor,
  ConflictException,
  Injectable,
  UseInterceptors,
} from '@nestjs/common';
import { UserWithAccessToken } from 'src/types/types';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dtos/signin.dto';
@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<UserWithAccessToken> {
    const { username, password } = createUserDto;
    const isExists = await this.usersService.findByUsername(username);
    if (isExists) {
      throw new ConflictException('user is exists !!!');
    }
    const hashedPassword = await this.hashPassword(password);
    const user = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });
    const accessToken = await this.generateAccessToken(user);
    return {
      user,
      accessToken,
    };
  }
  async signIn(signInDto: SignInDto): Promise<UserWithAccessToken> {
    const { username, password } = signInDto;
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new BadRequestException('invalid credential !!');
    }
    if (!this.comparePassword(password, user.password)) {
      throw new BadRequestException('invalid credential !!');
    }
    const accessToken = await this.generateAccessToken(user);
    return {
      user,
      accessToken,
    };
  }

  async hashPassword(password): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }
  async comparePassword(password, hashPassword): Promise<boolean> {
    return await bcrypt.compare(password, hashPassword);
  }
  async generateAccessToken(user): Promise<string> {
    return this.jwtService.sign({
      id: user.id,
      role: user.role,
    });
  }
}
