import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users/user.entity';

@Table({
  tableName: 'followers',
  createdAt: false,
  updatedAt: false,
  deletedAt: false,
})
export class Follower extends Model<Follower> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    field: 'user_id',
  })
  userId: string;

  @PrimaryKey
  @Column({ field: 'follows_id' })
  followId: string;

  @BelongsTo(() => User)
  user: User;
}
