import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from 'src/db/database.module';
import { usersProviders } from './users.providers';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [DatabaseModule, FilesModule],
  controllers: [UsersController],
  providers: [UsersService, ...usersProviders],
  exports: [UsersService],
})
export class UsersModule {}
