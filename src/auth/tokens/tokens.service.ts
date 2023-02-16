import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { RefreshToken } from './refreshToken.entity';
import { UserDto } from 'src/users/dto/user.dto';
import { IUser } from 'src/users/interfaces/user.interface';
import * as uuid from 'uuid';
import { ITokens } from '../interfaces/tokens.interface';
import { IPayload } from '../interfaces/payload.interface';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { IFullUser } from '../interfaces/full-user.interface';

@Injectable()
export class TokensService {
  constructor(
    @Inject('RefreshTokensRepository')
    private refreshTokenRepository: typeof RefreshToken,
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  public async generateTokens(user: IFullUser): Promise<ITokens> {
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user.id);

    return { accessToken: accessToken, refreshToken: refreshToken };
  }

  public async updateTokens(user: IFullUser): Promise<ITokens> {
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.updateRefreshToken(user.id);

    return { accessToken: accessToken, refreshToken: refreshToken };
  }

  public async deleteRefreshToken(refreshToken: string) {
    const refreshTokenUser = await this.refreshTokenRepository.findOne({
      where: { refreshToken: refreshToken },
    });
    await refreshTokenUser.destroy();
    return refreshTokenUser;
  }

  public async validRefreshToken(refreshToken: string) {
    const refreshTokenUser = await this.refreshTokenRepository.findOne({
      where: { refreshToken: refreshToken },
    });
    if (!refreshTokenUser) {
      throw new HttpException('No refresh token', HttpStatus.BAD_REQUEST);
    }
    const expiresIn = +process.env.JWT_REFRESH_TOKEN_EXPIRATION * 1000;
    const now = Date.now();
    const createdAt = refreshTokenUser.createdAt.getTime();

    if (now - createdAt > expiresIn) {
      throw new HttpException(
        'Refresh token expires in',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userService.getUserById(refreshTokenUser.userId);

    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }
    const currentUser = new UserDto(user);
    return currentUser;
  }

  private async generateAccessToken(user: IFullUser): Promise<string> {
    const payload = {
      id: user.id,
      role: user.role,
    };
    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
    });
  }

  private async generateRefreshToken(userId: string): Promise<string> {
    // TODO: add user agent and count of refresh tokens check
    const refreshToken = uuid.v4();
    await this.refreshTokenRepository.create({
      userId: userId,
      refreshToken: refreshToken,
    });
    return refreshToken;
  }

  private async updateRefreshToken(userId: string): Promise<string> {
    const countRefreshTokens = await this.refreshTokenRepository.count({
      where: { userId: userId },
    });
    // TODO: add user agent and count of refresh tokens check
    // const info = await FingerprintJS.load();
    const refreshToken = uuid.v4();
    await this.refreshTokenRepository.create({
      userId: userId,
      refreshToken: refreshToken,
    });
    return refreshToken;
  }
}
