"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretService = void 0;
const User_1 = require("../models/User");
const System_1 = require("../models/System");
const mongoose_1 = __importDefault(require("mongoose"));
class SecretService {
    static async registerParticipant(userId) {
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            throw new Error('Invalid user ID');
        }
        const [user, system] = await Promise.all([
            User_1.User.findById(userId),
            System_1.System.findOne(),
        ]);
        if (!user) {
            throw new Error('User not found');
        }
        if (!system) {
            throw new Error('System not initialized');
        }
        if (system.eventLocked) {
            throw new Error('Event is locked');
        }
        if (user.participating) {
            throw new Error('Already participating');
        }
        user.participating = true;
        await user.save();
        return user;
    }
    static async getAssignedFriend(userId) {
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            throw new Error('Invalid user ID');
        }
        const user = await User_1.User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        if (!user.assignedFriendId) {
            return null;
        }
        const friend = await User_1.User.findById(user.assignedFriendId).select('fullName');
        if (!friend) {
            throw new Error('Assigned friend not found');
        }
        return friend;
    }
    static async getParticipants() {
        return User_1.User.find({ participating: true }).select('fullName');
    }
}
exports.SecretService = SecretService;
