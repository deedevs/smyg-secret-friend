import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthService } from '../services/authService';
import { requireAuth } from '../middleware/auth';
import { config } from '../config';

const router = express.Router();

// Validation middleware
const validateRegister = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

// Register
router.post('/register', validateRegister, async (req: Request, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: errors.array()[0].msg,
        code: 'VALIDATION_ERROR'
      });
    }

    const { fullName, password } = req.body;
    const { user, token } = await AuthService.register(fullName, password);

    res.cookie(config.cookieName, token, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      domain: config.domain,
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
  } catch (error: any) {
    res.status(400).json({
      status: 'error',
      message: error.message,
      code: error.message.includes('already registered') ? 'USER_EXISTS' : 'REGISTRATION_FAILED'
    });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { fullName, password } = req.body;
    const { user, token } = await AuthService.login(fullName, password);

    res.cookie(config.cookieName, token, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      domain: config.domain,
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
  } catch (error: any) {
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
router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie(config.cookieName, {
    domain: config.domain,
    path: '/'
  });
  res.json({
    status: 'success',
    message: 'Logged out successfully'
  });
});

// Get current user
router.get('/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = await AuthService.getUser(req.user!._id.toString());
    res.json({
      status: 'success',
      user: {
        id: user._id,
        fullName: user.fullName,
        role: user.role,
        participating: user.participating,
      },
    });
  } catch (error: any) {
    res.status(404).json({
      status: 'error',
      message: error.message,
      code: 'USER_NOT_FOUND'
    });
  }
});

export default router;