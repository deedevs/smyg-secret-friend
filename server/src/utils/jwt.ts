import jwt from 'jsonwebtoken';
import { config } from '../config';
import { IUser } from '../models/User';

interface JwtPayload {
  userId: string;
  role: string;
}

export function generateToken(user: IUser): string {
  const payload: JwtPayload = {
    userId: user._id.toString(),
    role: user.role,
  };

  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: '1d',
  });
}

export function verifyToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, config.jwtSecret) as JwtPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}