"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistService = void 0;
const Wishlist_1 = require("../models/Wishlist");
const User_1 = require("../models/User");
class WishlistService {
    static async getWishlist(userId) {
        const wishlist = await Wishlist_1.Wishlist.findOne({ userId });
        return wishlist?.items || [];
    }
    static async updateWishlist(userId, items) {
        const wishlist = await Wishlist_1.Wishlist.findOneAndUpdate({ userId }, {
            $set: { items }
        }, {
            new: true,
            upsert: true
        });
        return wishlist;
    }
    static async getAssignedFriendWishlist(userId) {
        const user = await User_1.User.findById(userId);
        if (!user?.assignedFriendId) {
            throw new Error('No assigned friend found');
        }
        const wishlist = await Wishlist_1.Wishlist.findOne({ userId: user.assignedFriendId });
        return wishlist?.items || [];
    }
}
exports.WishlistService = WishlistService;
