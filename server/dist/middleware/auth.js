"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireAdmin = requireAdmin;
const jwt_1 = require("../utils/jwt");
const User_1 = require("../models/User");
const config_1 = require("../config");
async function requireAuth(req, res, next) {
    try {
        const token = req.cookies[config_1.config.cookieName];
        if (!token) {
            res.status(401).json({
                status: 'error',
                message: 'Please log in to continue',
                code: 'AUTH_REQUIRED'
            });
            return;
        }
        const decoded = (0, jwt_1.verifyToken)(token);
        const user = await User_1.User.findById(decoded.userId);
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
    }
    catch (error) {
        console.error('Auth error:', error);
        if (error instanceof Error && error.message === 'Invalid token') {
            res.status(401).json({
                status: 'error',
                message: 'Session expired, please log in again',
                code: 'INVALID_TOKEN'
            });
        }
        else {
            res.status(401).json({
                status: 'error',
                message: 'Authentication failed',
                code: 'AUTH_FAILED'
            });
        }
    }
}
function requireAdmin(req, res, next) {
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
