"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentService = void 0;
const User_1 = require("../models/User");
const System_1 = require("../models/System");
class AssignmentService {
    static async performAssignment() {
        const system = await System_1.System.findOne();
        if (!system) {
            throw new Error('System not initialized');
        }
        if (system.assignmentsDone) {
            const assignments = await this.getExistingAssignments();
            return assignments;
        }
        const participants = await User_1.User.find({ participating: true });
        if (participants.length < 2) {
            throw new Error('Need at least 2 participants');
        }
        const assignments = this.generateDerangement(participants);
        await this.saveAssignments(assignments);
        system.eventLocked = true;
        system.assignmentsDone = true;
        await system.save();
        return assignments.map(assignment => ({
            from: assignment.from.fullName,
            to: assignment.to.fullName,
        }));
    }
    static async resetAssignments() {
        const system = await System_1.System.findOne();
        if (!system) {
            throw new Error('System not initialized');
        }
        // Reset all user assignments
        await User_1.User.updateMany({ participating: true }, {
            $set: {
                assignedFriendId: null,
                participating: false
            }
        });
        // Reset system state
        system.eventLocked = false;
        system.assignmentsDone = false;
        await system.save();
    }
    static async getSystemStatus() {
        const system = await System_1.System.findOne();
        if (!system) {
            throw new Error('System not initialized');
        }
        const participantCount = await User_1.User.countDocuments({ participating: true });
        return {
            isLocked: system.eventLocked,
            isAssignmentDone: system.assignmentsDone,
            participantCount
        };
    }
    static generateDerangement(participants) {
        const n = participants.length;
        const indices = Array.from({ length: n }, (_, i) => i);
        // Fisher-Yates shuffle with derangement check
        for (let i = n - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        // Check for and fix any self-assignments
        for (let i = 0; i < n; i++) {
            if (indices[i] === i) {
                // Swap with next element (cyclically)
                const next = (i + 1) % n;
                [indices[i], indices[next]] = [indices[next], indices[i]];
            }
        }
        return indices.map((toIndex, fromIndex) => ({
            from: participants[fromIndex],
            to: participants[toIndex],
        }));
    }
    static async saveAssignments(assignments) {
        const updates = assignments.map(({ from, to }) => User_1.User.findByIdAndUpdate(from._id, { assignedFriendId: to._id }));
        await Promise.all(updates);
    }
    static async getExistingAssignments() {
        const users = await User_1.User.find({ participating: true })
            .populate('assignedFriendId', 'fullName');
        return users.map(user => ({
            from: user.fullName,
            to: user.assignedFriendId?.fullName || 'Unknown',
        }));
    }
}
exports.AssignmentService = AssignmentService;
