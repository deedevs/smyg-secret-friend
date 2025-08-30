import express from 'express';
import { body } from 'express-validator';
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
router.get('/me', requireAuth, async (req, res) => {
  try {
    const items = await WishlistService.getWishlist(req.user._id);
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
router.put('/me', requireAuth, validateWishlistItems, async (req, res) => {
  try {
    const { items } = req.body;
    console.log('Updating wishlist with items:', items); // Debug log
    const wishlist = await WishlistService.updateWishlist(req.user._id, items);
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
router.get('/friend', requireAuth, async (req, res) => {
  try {
    const items = await WishlistService.getAssignedFriendWishlist(req.user._id);
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