import express from 'express';
import { requireAuth } from '../middleware/auth';
import { SecretService } from '../services/secretService';

const router = express.Router();

// Register as secret friend participant
router.post('/register', requireAuth, async (req, res) => {
  try {
    const user = await SecretService.registerParticipant(req.user._id);
    res.json({
      user: {
        id: user._id,
        fullName: user.fullName,
        participating: user.participating,
      },
    });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

// Get assigned friend
router.get('/me', requireAuth, async (req, res) => {
  try {
    const friend = await SecretService.getAssignedFriend(req.user._id);
    if (!friend) {
      res.json({ friend: null });
      return;
    }
    res.json({
      friend: {
        fullName: friend.fullName,
      },
    });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
});

export default router;
