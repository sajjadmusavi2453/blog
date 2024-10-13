import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { SignInDto } from './dtos/signin.dto';
import { Logger } from '@nestjs/common';
@Controller('auth')
export class AuthController {
  private logger = new Logger('auth controller',{timestamp:true});
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    this.logger.log(`user ${createUserDto.username} trying to signup`);
    return this.authService.signUp(createUserDto);
  }

  @Post('/signin')
  async signIn(@Body() signInDto: SignInDto) {
    this.logger.log(`user ${signInDto.username} trying to login`);
    return this.authService.signIn(signInDto);
  }
}
