import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdminFile extends Document {
  type: string;
  filename: string;
  path: string;
  mimeType: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
}

const AdminFileSchema = new Schema<IAdminFile>(
  {
    type: {
      type: String,
      required: true,
      unique: true,
    },
    filename: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AdminFile: Model<IAdminFile> =
  mongoose.models.AdminFile || mongoose.model<IAdminFile>('AdminFile', AdminFileSchema);

export default AdminFile;