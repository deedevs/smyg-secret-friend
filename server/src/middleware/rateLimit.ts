import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100;

export function rateLimit(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const ip = req.ip;
  const now = Date.now();

  if (!store[ip]) {
    store[ip] = {
      count: 1,
      resetTime: now + WINDOW_MS,
    };
    next();
    return;
  }

  if (now > store[ip].resetTime) {
    store[ip] = {
      count: 1,
      resetTime: now + WINDOW_MS,
    };
    next();
    return;
  }

  if (store[ip].count >= MAX_REQUESTS) {
    res.status(429).json({
      message: 'Too many requests, please try again later',
    });
    return;
  }

  store[ip].count++;
  next();
}
