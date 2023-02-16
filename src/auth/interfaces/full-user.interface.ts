import { IUser } from 'src/users/interfaces/user.interface';

export interface IFullUser extends IUser {
  password: string;
  role: string;
  isActivated: boolean;
  activationLink: string;
  createdAt: Date;
}
