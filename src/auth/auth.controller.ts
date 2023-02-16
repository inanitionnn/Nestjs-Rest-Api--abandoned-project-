import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from 'src/roles/role.enum';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  Hello() {
    return 'Hello world';
  }

  @Get('activate/:link')
  send(@Res({ passthrough: true }) res: Response, @Param('link') link: string) {
    return this.authService.activate(link, res);
  }

  @Post('registration')
  @UseInterceptors(FileInterceptor('image'))
  async registration(@Body() userDto: CreateUserDto, @UploadedFile() image) {
    return this.authService.register(userDto, image);
  }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Req() req, @Res() res: Response) {
    return await this.authService.login(req, res);
  }

  @UseGuards(AuthGuard('access'))
  @UseGuards(RolesGuard)
  @Roles(Role.moder)
  @Get('user')
  userProfile(@Req() req) {
    return req.user;
  }

  @Get('refreshToken')
  @UseGuards(AuthGuard('refresh'))
  async regenerateTokens(@Req() req, @Res() res: Response) {
    return await this.authService.refresh(req, res);
  }

  @UseGuards(AuthGuard('access'))
  @Get('logout')
  async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    return await this.authService.logout(req, res);
  }

  @UseGuards(AuthGuard('google'))
  @Get('google')
  loginWithGoogle() {
    return 'Login with Google';
  }

  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  googleCallback(@Request() req) {
    return {
      message: 'User information from google',
      user: req.user,
    };
  }
}
