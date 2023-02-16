import { ApiProperty } from '@nestjs/swagger';
import { Follower } from '../follower.entity';

export class FollowerDto {
  @ApiProperty()
  readonly userId: string;

  @ApiProperty()
  readonly followId: string;

  constructor(follower: Follower) {
    this.userId = follower.userId;
    this.followId = follower.followId;
  }
}
