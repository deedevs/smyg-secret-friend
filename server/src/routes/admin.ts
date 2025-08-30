import express, { Request, Response } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { SecretService } from '../services/secretService';
import { AssignmentService } from '../services/assignmentService';
import { User } from '../models/User';
import { System } from '../models/System';

const router = express.Router();

// Get system status and participants with assignments
router.get('/status', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const [status, participants] = await Promise.all([
      AssignmentService.getSystemStatus(),
      User.find({ participating: true })
        .select('fullName participating')
        .populate<{ assignedFriendId: { _id: string; fullName: string } }>('assignedFriendId', 'fullName')
    ]);

    res.json({
      status: 'success',
      data: {
        ...status,
        participants: participants.map(p => ({
          id: p._id,
          fullName: p.fullName,
          assignedFriend: p.assignedFriendId ? {
            id: p.assignedFriendId._id,
            fullName: p.assignedFriendId.fullName,
          } : null,
        })),
      },
    });
  } catch (error: any) {
    res.status(500).json({ 
      status: 'error',
      message: error.message 
    });
  }
});

// Delete a participant
router.delete('/participants/:userId', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const system = await System.findOne();
    if (!system) {
      throw new Error('System not initialized');
    }

    if (system.assignmentsDone) {
      throw new Error('Cannot delete participants after assignments are done');
    }

    const userToDelete = await User.findById(req.params.userId);
    if (!userToDelete) {
      throw new Error('Participant not found');
    }

    if (userToDelete.role === 'admin') {
      throw new Error('Cannot delete an admin user');
    }

    await User.findByIdAndDelete(req.params.userId);

    res.json({
      status: 'success',
      message: 'Participant deleted successfully'
    });
  } catch (error: any) {
    res.status(400).json({ 
      status: 'error',
      message: error.message 
    });
  }
});

// Start secret friend assignment
router.post('/start', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const assignments = await AssignmentService.performAssignment();
    res.json({
      status: 'success',
      data: { assignments }
    });
  } catch (error: any) {
    res.status(400).json({ 
      status: 'error',
      message: error.message 
    });
  }
});

// Reset the system
router.post('/reset', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    await AssignmentService.resetAssignments();
    res.json({
      status: 'success',
      message: 'System has been reset successfully'
    });
  } catch (error: any) {
    res.status(500).json({ 
      status: 'error',
      message: error.message 
    });
  }
});

export default router;