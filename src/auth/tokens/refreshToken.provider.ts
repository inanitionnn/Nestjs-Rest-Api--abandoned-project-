import { RefreshToken } from './refreshToken.entity';

export const refreshTokenProviders = [
  { provide: 'RefreshTokensRepository', useValue: RefreshToken },
];
