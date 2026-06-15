import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFlashInfo extends Document {
  text: string;
  emoji?: string;
  isUrgent: boolean;
  textColor: string;
  backgroundColor: string;
  createdAt: Date;
  updatedAt: Date;
}

const FlashInfoSchema = new Schema<IFlashInfo>(
  {
    text: {
      type: String,
      required: true,
    },
    emoji: {
      type: String,
    },
    isUrgent: {
      type: Boolean,
      default: false,
    },
    textColor: {
      type: String,
      default: '#8B5E3C',
    },
    backgroundColor: {
      type: String,
      default: '#ffffff',
    },
  },
  {
    timestamps: true,
  }
);

const FlashInfo: Model<IFlashInfo> =
  mongoose.models.FlashInfo || mongoose.model<IFlashInfo>('FlashInfo', FlashInfoSchema);

export default FlashInfo;