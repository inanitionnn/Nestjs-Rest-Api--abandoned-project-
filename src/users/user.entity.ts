import {
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  HasMany,
  IsEmail,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';
import { RefreshToken } from 'src/auth/tokens/refreshToken.entity';
import { Follower } from 'src/followers/follower.entity';

@Table({
  tableName: 'user',
  updatedAt: false,
  deletedAt: false,
})
export class User extends Model<User> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({ type: DataType.STRING(25), allowNull: false })
  name: string;

  @Unique
  @IsEmail
  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING(72), allowNull: false })
  password: string;

  @Column({ type: DataType.STRING })
  image: string;

  @Column({
    field: 'role',
    type: DataType.ENUM('a', 'u', 'm'),
    defaultValue: 'u',
  })
  role: string;

  @Column({ field: 'activated', type: DataType.BOOLEAN, defaultValue: false })
  isActivated: boolean;

  @Column({ field: 'activation_link', type: DataType.UUID })
  activationLink: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  // @UpdatedAt
  // @Column({ field: 'updated_at' })
  // updatedAt: Date;

  @HasMany(() => Follower)
  follows: Follower[];

  @HasMany(() => RefreshToken)
  refreshTokens: RefreshToken[];
}
