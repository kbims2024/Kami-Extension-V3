import mongoose, { Schema, Document } from 'mongoose';

export interface ISettingsDocument extends Document {
  id: string;
  heroBackground?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettingsDocument>(
  {
    heroBackground: { type: String, default: null },
  },
  { timestamps: true }
);

SettingsSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

export const Settings = mongoose.models.Settings || mongoose.model<ISettingsDocument>('Settings', SettingsSchema);