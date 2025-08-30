import { Wishlist, IWishlistItem } from '../models/Wishlist';
import { User } from '../models/User';

export class WishlistService {
  static async getWishlist(userId: string) {
    const wishlist = await Wishlist.findOne({ userId });
    return wishlist?.items || [];
  }

  static async updateWishlist(userId: string, items: IWishlistItem[]) {
    const wishlist = await Wishlist.findOneAndUpdate(
      { userId },
      { 
        $set: { items }
      },
      { 
        new: true,
        upsert: true
      }
    );
    return wishlist;
  }

  static async getAssignedFriendWishlist(userId: string) {
    const user = await User.findById(userId);
    if (!user?.assignedFriendId) {
      throw new Error('No assigned friend found');
    }

    const wishlist = await Wishlist.findOne({ userId: user.assignedFriendId });
    return wishlist?.items || [];
  }
}
