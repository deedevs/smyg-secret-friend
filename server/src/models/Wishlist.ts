import mongoose, { Document, Schema } from 'mongoose';

export interface IWishlistItem {
  title: string;
  description?: string;
  link?: string;
}

export interface IWishlist extends Document {
  userId: mongoose.Types.ObjectId;
  items: IWishlistItem[];
  updatedAt: Date;
  createdAt: Date;
}

const wishlistSchema = new Schema<IWishlist>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [{
      title: {
        type: String,
        required: true,
      },
      description: String,
      link: String,
    }],
  },
  {
    timestamps: true,
  }
);

export const Wishlist = mongoose.model<IWishlist>('Wishlist', wishlistSchema);
