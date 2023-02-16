import { Module } from '@nestjs/common';
import { FollowersController } from './followers.controller';
import { FollowersService } from './followers.service';
import { DatabaseModule } from 'src/db/database.module';
import { followersProviders } from './followers.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [FollowersController],
  providers: [FollowersService, ...followersProviders],
  exports: [FollowersService],
})
export class FollowersModule {}
