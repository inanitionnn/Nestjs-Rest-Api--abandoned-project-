import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as dotenv from 'dotenv';
import { AuthService } from '../auth.service';
import { TokensService } from '../tokens/tokens.service';
dotenv.config();

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh',
) {
  constructor(private tokensService: TokensService) {
    super({
      ignoreExpiration: true,
      passReqToCallback: true,
      secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(req: Request, payload: any) {
    if (!payload) {
      throw new BadRequestException('invalid jwt token');
    }
    const data = req?.cookies['auth-cookie'];
    if (!data) {
      throw new BadRequestException('invalid refresh token');
    }
    const user = await this.tokensService.validRefreshToken(data);
    if (user == null) {
      throw new BadRequestException('token expired');
    }
    return user;
  }
}
