"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const assignmentService_1 = require("../services/assignmentService");
const User_1 = require("../models/User");
const System_1 = require("../models/System");
const router = express_1.default.Router();
// Get system status and participants with assignments
router.get('/status', auth_1.requireAuth, auth_1.requireAdmin, async (req, res) => {
    try {
        const [status, participants] = await Promise.all([
            assignmentService_1.AssignmentService.getSystemStatus(),
            User_1.User.find({ participating: true })
                .select('fullName participating')
                .populate('assignedFriendId', 'fullName')
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
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});
// Delete a participant
router.delete('/participants/:userId', auth_1.requireAuth, auth_1.requireAdmin, async (req, res) => {
    try {
        const system = await System_1.System.findOne();
        if (!system) {
            throw new Error('System not initialized');
        }
        if (system.assignmentsDone) {
            throw new Error('Cannot delete participants after assignments are done');
        }
        const userToDelete = await User_1.User.findById(req.params.userId);
        if (!userToDelete) {
            throw new Error('Participant not found');
        }
        if (userToDelete.role === 'admin') {
            throw new Error('Cannot delete an admin user');
        }
        await User_1.User.findByIdAndDelete(req.params.userId);
        res.json({
            status: 'success',
            message: 'Participant deleted successfully'
        });
    }
    catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});
// Start secret friend assignment
router.post('/start', auth_1.requireAuth, auth_1.requireAdmin, async (req, res) => {
    try {
        const assignments = await assignmentService_1.AssignmentService.performAssignment();
        res.json({
            status: 'success',
            data: { assignments }
        });
    }
    catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});
// Reset the system
router.post('/reset', auth_1.requireAuth, auth_1.requireAdmin, async (req, res) => {
    try {
        await assignmentService_1.AssignmentService.resetAssignments();
        res.json({
            status: 'success',
            message: 'System has been reset successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});
exports.default = router;
