import { Inject, Injectable } from '@nestjs/common';
import { Follower } from './follower.entity';
import { FollowerDto } from './dto/follower.dto';
import { AddFollowerDto } from './dto/add-follower.dto';

@Injectable()
export class FollowersService {
  constructor(
    @Inject('FollowersRepository')
    private readonly followerRepository: typeof Follower,
  ) {}
  public async addFollower(dto: AddFollowerDto) {
    const follower = new Follower();
    follower.userId = dto.userId;
    follower.followId = dto.followId;
    await follower.save();
    return follower;
  }

  public async getFollows(id) {
    const followers = await this.followerRepository.findAll({
      where: { userId: id },
    });
    return followers;
  }

  public async getFollowers(id) {
    const followers = await this.followerRepository.findAll({
      where: { followId: id },
    });
    return followers;
  }
}
