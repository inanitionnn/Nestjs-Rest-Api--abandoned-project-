import { Controller } from '@nestjs/common';
import {
  Body,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common/decorators';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiOperation, ApiResponse } from '@nestjs/swagger/dist';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
@ApiTags('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  getAll() {
    return this.usersService.getAllUsers();
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() userDto: UpdateUserDto,
    @Param('id') id,
    @UploadedFile() image,
  ) {
    return this.usersService.update(id, userDto, image);
  }

  @Post(':id')
  @ApiOperation({ summary: 'Delete user' })
  @UseInterceptors(FileInterceptor('image'))
  delete(@Param('id') id) {
    return this.usersService.delete(id);
  }
}
