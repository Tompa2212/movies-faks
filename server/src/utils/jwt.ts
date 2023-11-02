import jwt from 'jsonwebtoken';
import { SessionUser } from '../types/User';
import path from 'node:path';
import { readFileSync } from 'node:fs';

const basePath = path.resolve('');

const PRIVATE_ACCESS_TOKEN_PATH = basePath + '/keys/access-private-key.pem';
const PUBLIC_ACCESS_TOKEN_PATH = basePath + '/keys/access-public-key.pem';

const PRIVATE_REFRESH_TOKEN_PATH = basePath + '/keys/refresh-private-key.pem';
const PUBLIC_REFRESH_TOKEN_PATH = basePath + '/keys/refresh-public-key.pem';

export const createAccessToken = (payload: SessionUser) => {
  const key = readFileSync(PRIVATE_ACCESS_TOKEN_PATH, 'utf-8');

  return jwt.sign(payload, key, {
    expiresIn: 15 * 60,
    algorithm: 'RS256'
  });
};

export const verifyAccessToken = (token: string) => {
  const key = readFileSync(PUBLIC_ACCESS_TOKEN_PATH, 'utf-8');

  const verified = jwt.verify(token, key, {
    algorithms: ['RS256']
  }) as jwt.JwtPayload;

  const { exp, iat, ...user } = verified;

  return user as SessionUser;
};

export const createRefreshToken = (payload: SessionUser) => {
  const key = readFileSync(PRIVATE_REFRESH_TOKEN_PATH, 'utf-8');

  return jwt.sign(payload, key, {
    expiresIn: 30 * 24 * 60 * 60,
    algorithm: 'RS256'
  });
};

export const verifyRefreshToken = (token: string) => {
  const key = readFileSync(PUBLIC_REFRESH_TOKEN_PATH, 'utf-8');

  const verified = jwt.verify(token, key, {
    algorithms: ['RS256']
  }) as jwt.JwtPayload;

  const { exp, iat, ...user } = verified;

  return user as SessionUser;
};
