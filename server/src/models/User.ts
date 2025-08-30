import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  passwordHash: string;
  role: 'user' | 'admin';
  participating: boolean;
  assignedFriendId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    participating: {
      type: Boolean,
      default: false,
    },
    assignedFriendId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
userSchema.index({ fullName: 1 }, { unique: true });

export const User = mongoose.model<IUser>('User', userSchema);
