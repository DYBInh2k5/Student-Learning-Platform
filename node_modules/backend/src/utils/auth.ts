import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePasswords = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (userId: string, email: string, role: string): string => {
  const payload = { userId, email, role };
  const secret = (config.JWT_SECRET || 'your_jwt_secret_key') as string;
  const expiresIn = (config.JWT_EXPIRES_IN || '7d') as string;
  return jwt.sign(payload, secret, { expiresIn } as any);
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, config.JWT_SECRET);
  } catch (error) {
    return null;
  }
};
