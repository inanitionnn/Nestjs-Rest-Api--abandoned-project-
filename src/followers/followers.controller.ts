import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FollowersService } from './followers.service';
import { AddFollowerDto } from './dto/add-follower.dto';

@Controller('follows')
export class FollowersController {
  constructor(private followerService: FollowersService) {}

  @Post()
  addFollow(@Body() dto: AddFollowerDto) {
    return this.followerService.addFollower(dto);
  }

  @Get(':id')
  getFollows(@Param('id') id: string) {
    return this.followerService.getFollows(id);
  }

  @Get('/followers/:id')
  getFollowers(@Param('id') id: string) {
    return this.followerService.getFollowers(id);
  }
}
