import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'tset',
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findById(payload.id);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return { name: user.name, role: user.role, id: user.id };
  }
}
