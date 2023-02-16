import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passports/local.strategy';
import { RefreshTokenStrategy } from './passports/refresh-token.strategy';
import * as dotenv from 'dotenv';
import { DatabaseModule } from 'src/db/database.module';
import { refreshTokenProviders } from './tokens/refreshToken.provider';
import { AccessTokenStrategy } from './passports/access-token.strategy';
import { GoogleStrategy } from './passports/google.strategy';
import { TokensService } from './tokens/tokens.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail/mail.service';
import { RolesGuard } from 'src/roles/roles.guard';
dotenv.config();

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        tls: {
          ciphers: 'SSLv3',
        },
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER, // generated ethereal user
          pass: process.env.SMTP_PASSWORD, // generated ethereal password
        },
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokensService,
    MailService,
    LocalStrategy,
    RolesGuard,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    GoogleStrategy,
    ...refreshTokenProviders,
  ],
})
export class AuthModule {}
