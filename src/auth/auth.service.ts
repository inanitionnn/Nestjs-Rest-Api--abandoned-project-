import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserDto } from 'src/users/dto/user.dto';
import { TokensService } from './tokens/tokens.service';
import * as dotenv from 'dotenv';
import * as uuid from 'uuid';
import { MailService } from './mail/mail.service';

dotenv.config();
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private tokensService: TokensService,
    private mailService: MailService,
  ) {}

  async activate(activationLink, res) {
    const user = await this.userService.activate(activationLink);
    const tokens = await this.tokensService.generateTokens(user);
    res.cookie('auth-cookie', tokens.refreshToken, {
      httpOnly: true,
      path: '/auth',
      // domain: process.env.API_URL,
      // secure: true,
      samesite: true,
    });
    return res.json({ accessTolen: tokens.accessToken });
  }

  async register(user: CreateUserDto, image?: any) {
    const newUser = await this.userService.createUser(user, image);
    const activationLink = uuid.v4();
    const userWithLink = await this.userService.saveLink(
      newUser.id,
      activationLink,
    );
    // await this.mailService.sendMaile(
    //   newUser.email,
    //   `${process.env.API_URL}/auth/activate/${activationLink}`,
    // );
    return userWithLink;
  }

  public async validateUserCredentials(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email);

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return null;
    }

    const currentUser = new UserDto(user);
    return currentUser;
  }

  async login(req, res) {
    const tokens = await this.tokensService.generateTokens(req.user);
    res.cookie('auth-cookie', tokens.refreshToken, {
      httpOnly: true,
      path: '/auth',
      // domain: process.env.API_URL,
      // secure: true,
      samesite: true,
    });

    return res.json({ accessTolen: tokens.accessToken });
  }

  async refresh(req, res) {
    const tokens = await this.tokensService.updateTokens(req.user);
    res.clearCookie('auth-cookie');
    res.cookie('auth-cookie', tokens.refreshToken, {
      httpOnly: true,
      path: '/auth',
      // domain: process.env.API_URL,
      // secure: true,
      samesite: true,
    });
    return res.json({ accessTolen: tokens.accessToken });
  }

  async logout(req, res) {
    const data = req?.cookies['auth-cookie'];
    await this.tokensService.deleteRefreshToken(data.refreshToken);
    res.clearCookie('auth-cookie');
  }
}
