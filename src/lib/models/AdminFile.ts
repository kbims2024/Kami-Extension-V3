import mongoose, { Schema, Document } from 'mongoose';

export interface IAdminFileDocument extends Document {
  id: string;
  type: string;
  filename: string;
  path: string;
  mimeType: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
}

const AdminFileSchema = new Schema<IAdminFileDocument>(
  {
    type: { type: String, required: true, unique: true },
    filename: { type: String, required: true },
    path: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
  },
  { timestamps: true }
);

AdminFileSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

export const AdminFile = mongoose.models.AdminFile || mongoose.model<IAdminFileDocument>('AdminFile', AdminFileSchema);