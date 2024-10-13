import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    console.log("jwt strategy constructor");
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: 'tsetopop',
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
