import { User, IUser } from '../models/User';
import { System } from '../models/System';

export class SecretService {
  static async registerParticipant(userId: string): Promise<IUser> {
    const [user, system] = await Promise.all([
      User.findById(userId),
      System.findOne(),
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

  static async getAssignedFriend(userId: string): Promise<IUser | null> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.assignedFriendId) {
      return null;
    }

    const friend = await User.findById(user.assignedFriendId).select('fullName');
    if (!friend) {
      throw new Error('Assigned friend not found');
    }

    return friend;
  }

  static async getParticipants(): Promise<IUser[]> {
    return User.find({ participating: true }).select('fullName');
  }
}
