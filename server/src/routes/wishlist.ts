import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { requireAuth } from '../middleware/auth';
import { WishlistService } from '../services/wishlistService';

const router = express.Router();

// Validation middleware
const validateWishlistItems = [
  body('items').isArray().withMessage('Items must be an array'),
  body('items.*.title').trim().notEmpty().withMessage('Item title is required'),
  body('items.*.description').optional().trim(),
  body('items.*.link').optional().trim().isURL().withMessage('Link must be a valid URL'),
];

// Get my wishlist
router.get('/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const items = await WishlistService.getWishlist(req.user!._id.toString());
    res.json({
      status: 'success',
      data: { items }
    });
  } catch (error: any) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Update my wishlist
router.put('/me', requireAuth,  async (req: Request, res: Response) => {
  try {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({
    //     status: 'error',
    //     message: errors.array()[0].msg,
    //     code: 'VALIDATION_ERROR'
    //   });
    // }

    const { items } = req.body;
    console.log('Updating wishlist with items:', items); // Debug log
    const wishlist = await WishlistService.updateWishlist(req.user!._id.toString(), items);
    res.json({
      status: 'success',
      data: { items: wishlist.items }
    });
  } catch (error: any) {
    console.error('Update wishlist error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get assigned friend's wishlist
router.get('/friend', requireAuth, async (req: Request, res: Response) => {
  try {
    const items = await WishlistService.getAssignedFriendWishlist(req.user!._id.toString());
    res.json({
      status: 'success',
      data: { items }
    });
  } catch (error: any) {
    console.error('Get friend wishlist error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;