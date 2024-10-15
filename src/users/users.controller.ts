import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Logger,
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
  private logger = new Logger('UsersController', { timestamp: true });

  constructor(private readonly usersService: UsersService) {}

  @Get('/profile')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtGuard)
  async getProfile(@Req() req: Request) {
    this.logger.log(`user with ID : ${req.user.id} get the profile`);
    return this.usersService.findById(req.user.id);
  }
}
