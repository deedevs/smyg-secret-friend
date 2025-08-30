"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const secretService_1 = require("../services/secretService");
const router = express_1.default.Router();
// Register as secret friend participant
router.post('/register', auth_1.requireAuth, async (req, res) => {
    try {
        const user = await secretService_1.SecretService.registerParticipant(req.user._id.toString());
        res.json({
            status: 'success',
            user: {
                id: user._id,
                fullName: user.fullName,
                participating: user.participating,
            },
        });
    }
    catch (error) {
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
router.get('/me', auth_1.requireAuth, async (req, res) => {
    try {
        const friend = await secretService_1.SecretService.getAssignedFriend(req.user._id.toString());
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
    }
    catch (error) {
        res.status(404).json({
            status: 'error',
            message: error.message,
            code: 'FRIEND_NOT_FOUND'
        });
    }
});
exports.default = router;
