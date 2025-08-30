"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const auth_1 = require("../middleware/auth");
const wishlistService_1 = require("../services/wishlistService");
const router = express_1.default.Router();
// Validation middleware
const validateWishlistItems = [
    (0, express_validator_1.body)('items').isArray().withMessage('Items must be an array'),
    (0, express_validator_1.body)('items.*.title').trim().notEmpty().withMessage('Item title is required'),
    (0, express_validator_1.body)('items.*.description').optional().trim(),
    (0, express_validator_1.body)('items.*.link').optional().trim().isURL().withMessage('Link must be a valid URL'),
];
// Get my wishlist
router.get('/me', auth_1.requireAuth, async (req, res) => {
    try {
        const items = await wishlistService_1.WishlistService.getWishlist(req.user._id.toString());
        res.json({
            status: 'success',
            data: { items }
        });
    }
    catch (error) {
        console.error('Get wishlist error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});
// Update my wishlist
router.put('/me', auth_1.requireAuth, validateWishlistItems, async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                message: errors.array()[0].msg,
                code: 'VALIDATION_ERROR'
            });
        }
        const { items } = req.body;
        console.log('Updating wishlist with items:', items); // Debug log
        const wishlist = await wishlistService_1.WishlistService.updateWishlist(req.user._id.toString(), items);
        res.json({
            status: 'success',
            data: { items: wishlist.items }
        });
    }
    catch (error) {
        console.error('Update wishlist error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});
// Get assigned friend's wishlist
router.get('/friend', auth_1.requireAuth, async (req, res) => {
    try {
        const items = await wishlistService_1.WishlistService.getAssignedFriendWishlist(req.user._id.toString());
        res.json({
            status: 'success',
            data: { items }
        });
    }
    catch (error) {
        console.error('Get friend wishlist error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});
exports.default = router;
