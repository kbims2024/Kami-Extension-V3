import mongoose, { Schema, Document } from 'mongoose';

export interface IProgressUpdateDocument extends Document {
  id: string;
  title: string;
  description: string;
  category: string; // TRAVAUX, EVENEMENT, INFRASTRUCTURE, paysage_autre
  images: string[];
  videos: string[];
  date: string; // ISO date string for the event date
  isPinned: boolean;
  authorId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProgressUpdateSchema = new Schema<IProgressUpdateDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['TRAVAUX', 'EVENEMENT', 'INFRASTRUCTURE', 'AUTRE'],
    },
    images: [{ type: String }],
    videos: [{ type: String }],
    date: { type: String, required: true },
    isPinned: { type: Boolean, default: false },
    authorId: { type: String, default: null },
  },
  { timestamps: true }
);

ProgressUpdateSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

export const ProgressUpdate =
  mongoose.models.ProgressUpdate ||
  mongoose.model<IProgressUpdateDocument>('ProgressUpdate', ProgressUpdateSchema);
