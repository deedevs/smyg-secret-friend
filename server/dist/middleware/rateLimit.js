"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimit = rateLimit;
const store = {};
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100;
function rateLimit(req, res, next) {
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
