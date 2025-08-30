import mongoose, { Document, Schema } from 'mongoose';

export interface ISystem extends Document {
  eventLocked: boolean;
  assignmentsDone: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const systemSchema = new Schema<ISystem>(
  {
    eventLocked: {
      type: Boolean,
      default: false,
    },
    assignmentsDone: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const System = mongoose.model<ISystem>('System', systemSchema);

// Initialize system document if it doesn't exist
export async function initializeSystem(): Promise<void> {
  const count = await System.countDocuments();
  if (count === 0) {
    await System.create({
      eventLocked: false,
      assignmentsDone: false,
    });
  }
}
