import { Sequelize } from 'sequelize-typescript';
import { RefreshToken } from 'src/auth/tokens/refreshToken.entity';
import { Follower } from 'src/followers/follower.entity';
import { User } from 'src/users/user.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: process.env.DATABASE_HOST,
        port: +process.env.DATABASE_PORT,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_DATABASE,
        logging: false,
      });
      sequelize.addModels([User, Follower, RefreshToken]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
