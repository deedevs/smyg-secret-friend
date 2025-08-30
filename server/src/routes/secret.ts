import express, { Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';
import { SecretService } from '../services/secretService';
import { IUser } from '../models/User';

// Extend Express Request to include our user type
interface AuthRequest extends Request {
  user: IUser;
}

const router = express.Router();

// Register as secret friend participant
router.post('/register', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await SecretService.registerParticipant(req.user._id.toString());
    res.json({
      status: 'success',
      user: {
        id: user._id,
        fullName: user.fullName,
        participating: user.participating,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      status: 'error',
      message: error.message,
      code: error.message.includes('already participating') ? 'ALREADY_PARTICIPATING' : 
            error.message.includes('locked') ? 'EVENT_LOCKED' : 
            'REGISTRATION_FAILED'
    });
  }
});

// Get assigned friend
router.get('/me', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const friend = await SecretService.getAssignedFriend(req.user._id.toString());
    if (!friend) {
      res.json({
        status: 'success',
        data: { friend: null }
      });
      return;
    }
    res.json({
      status: 'success',
      data: {
        friend: {
          id: friend._id,
          fullName: friend.fullName,
        }
      }
    });
  } catch (error: any) {
    res.status(404).json({
      status: 'error',
      message: error.message,
      code: 'FRIEND_NOT_FOUND'
    });
  }
});

export default router;