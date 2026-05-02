import jwt from 'jsonwebtoken';
import { config } from '../config';

export const authMiddleware = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

export const adminMiddleware = (req: any, res: any, next: any) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};

export const instructorMiddleware = (req: any, res: any, next: any) => {
  if (req.user?.role !== 'instructor' && req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Instructor access required' });
  }
  next();
};
