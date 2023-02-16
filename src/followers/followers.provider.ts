import { Follower } from './follower.entity';

export const followersProviders = [
  { provide: 'FollowersRepository', useValue: Follower },
];
