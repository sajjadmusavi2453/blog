import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Patch,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Request } from './request.interface';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/profile')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtGuard)
  async getProfile(@Req() req: Request) {
    return this.usersService.findById(req.user.id);
  }
}
