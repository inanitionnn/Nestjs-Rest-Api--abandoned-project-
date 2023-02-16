import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from 'src/users/user.entity';

@Table({
  tableName: 'refresh-tokens',
  updatedAt: false,
  deletedAt: false,
})
export class RefreshToken extends Model<RefreshToken> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    field: 'user_id',
  })
  userId: string;

  @PrimaryKey
  @Column({ field: 'refresh_token', type: DataType.UUID })
  refreshToken: string;

  // @Column({ field: 'expiresIn', type: DataType.BIGINT })
  // expiresIn: number;
  @UpdatedAt
  @Column({ field: 'create_at' })
  createdAt: Date;

  @BelongsTo(() => User)
  user: User;
}
