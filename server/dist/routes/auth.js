"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const authService_1 = require("../services/authService");
const auth_1 = require("../middleware/auth");
const config_1 = require("../config");
const router = express_1.default.Router();
// Validation middleware
const validateRegister = [
    (0, express_validator_1.body)('fullName')
        .trim()
        .notEmpty()
        .withMessage('Full name is required')
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters long'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
];
// Register
router.post('/register', validateRegister, async (req, res) => {
    try {
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                message: errors.array()[0].msg,
                code: 'VALIDATION_ERROR'
            });
        }
        const { fullName, password } = req.body;
        const { user, token } = await authService_1.AuthService.register(fullName, password);
        res.cookie(config_1.config.cookieName, token, {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            domain: config_1.config.domain,
            sameSite: 'strict'
        });
        res.json({
            status: 'success',
            user: {
                id: user._id,
                fullName: user.fullName,
                role: user.role,
                participating: user.participating,
            },
        });
    }
    catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message,
            code: error.message.includes('already registered') ? 'USER_EXISTS' : 'REGISTRATION_FAILED'
        });
    }
});
// Login
router.post('/login', async (req, res) => {
    try {
        const { fullName, password } = req.body;
        const { user, token } = await authService_1.AuthService.login(fullName, password);
        res.cookie(config_1.config.cookieName, token, {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            domain: config_1.config.domain,
            sameSite: 'strict'
        });
        res.json({
            status: 'success',
            user: {
                id: user._id,
                fullName: user.fullName,
                role: user.role,
                participating: user.participating,
            },
        });
    }
    catch (error) {
        const isUserNotFound = error.message.includes('User not found');
        const isIncorrectPassword = error.message.includes('Incorrect password');
        res.status(401).json({
            status: 'error',
            message: error.message,
            code: isUserNotFound ? 'USER_NOT_FOUND' :
                isIncorrectPassword ? 'INCORRECT_PASSWORD' :
                    'LOGIN_FAILED'
        });
    }
});
// Logout
router.post('/logout', (req, res) => {
    res.clearCookie(config_1.config.cookieName, {
        domain: config_1.config.domain,
        path: '/'
    });
    res.json({
        status: 'success',
        message: 'Logged out successfully'
    });
});
// Get current user
router.get('/me', auth_1.requireAuth, async (req, res) => {
    try {
        const user = await authService_1.AuthService.getUser(req.user._id.toString());
        res.json({
            status: 'success',
            user: {
                id: user._id,
                fullName: user.fullName,
                role: user.role,
                participating: user.participating,
            },
        });
    }
    catch (error) {
        res.status(404).json({
            status: 'error',
            message: error.message,
            code: 'USER_NOT_FOUND'
        });
    }
});
exports.default = router;
