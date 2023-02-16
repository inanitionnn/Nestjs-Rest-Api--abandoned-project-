import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { FilesModule } from './files/files.module';
import { FollowersModule } from './followers/followers.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    UsersModule,
    FilesModule,
    FollowersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
