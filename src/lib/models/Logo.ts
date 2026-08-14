import mongoose, { Schema, Document } from 'mongoose';

export interface ILogoDocument extends Document {
  id: string;
  text: string;
  imageUrl?: string;
  textColor: string;
  backgroundColor: string;
  createdAt: Date;
  updatedAt: Date;
}

const LogoSchema = new Schema<ILogoDocument>(
  {
    text: { type: String, default: 'KAMI-EXTENSION' },
    imageUrl: { type: String, default: null },
    textColor: { type: String, default: '#8B5E3C' },
    backgroundColor: { type: String, default: '#ffffff' },
  },
  { timestamps: true }
);

LogoSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    delete (ret as any)._id;
    return ret;
  },
});

export const Logo = mongoose.models.Logo || mongoose.model<ILogoDocument>('Logo', LogoSchema);