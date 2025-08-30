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
  const ip = req.ip || 'unknown';

  if (!store[ip]) {
    store[ip] = {
      count: 1,
      resetTime: Date.now() + WINDOW_MS,
    };
    next();
    return;
  }

  const now = Date.now();
  const clientStore = store[ip];

  if (now > clientStore.resetTime) {
    store[ip] = {
      count: 1,
      resetTime: now + WINDOW_MS,
    };
    next();
    return;
  }

  if (clientStore.count >= MAX_REQUESTS) {
    res.status(429).json({
      status: 'error',
      message: 'Too many requests, please try again later',
      code: 'RATE_LIMIT_EXCEEDED'
    });
    return;
  }

  clientStore.count++;
  next();
}