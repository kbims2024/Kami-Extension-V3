import mongoose, { Schema, Document } from 'mongoose';

export interface IUploadedFileDocument extends Document {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  data: string; // base64 data URI, e.g. "data:image/jpeg;base64,..."
  category?: string; // e.g. 'expert-photo', 'admin-file', 'profile-photo', 'hero'
  createdAt: Date;
  updatedAt: Date;
}

const UploadedFileSchema = new Schema<IUploadedFileDocument>(
  {
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: String, required: true },
    category: { type: String, default: null },
  },
  { timestamps: true }
);

UploadedFileSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

export const UploadedFile =
  mongoose.models.UploadedFile ||
  mongoose.model<IUploadedFileDocument>('UploadedFile', UploadedFileSchema);
