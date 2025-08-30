import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { User, IUser } from '../models/User';
import { config } from '../config';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.cookies[config.cookieName];
    if (!token) {
      res.status(401).json({ 
        status: 'error',
        message: 'Please log in to continue',
        code: 'AUTH_REQUIRED'
      });
      return;
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(401).json({ 
        status: 'error',
        message: 'User account not found',
        code: 'USER_NOT_FOUND'
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    
    if (error instanceof Error && error.message === 'Invalid token') {
      res.status(401).json({ 
        status: 'error',
        message: 'Session expired, please log in again',
        code: 'INVALID_TOKEN'
      });
    } else {
      res.status(401).json({ 
        status: 'error',
        message: 'Authentication failed',
        code: 'AUTH_FAILED'
      });
    }
  }
}

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ 
      status: 'error',
      message: 'Admin access required',
      code: 'ADMIN_REQUIRED'
    });
    return;
  }
  next();
}