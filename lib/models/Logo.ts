import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILogo extends Document {
  text: string;
  imageUrl?: string;
  textColor: string;
  backgroundColor: string;
  createdAt: Date;
  updatedAt: Date;
}

const LogoSchema = new Schema<ILogo>(
  {
    text: {
      type: String,
      default: 'KAMI-EXTENSION',
    },
    imageUrl: {
      type: String,
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

const Logo: Model<ILogo> = mongoose.models.Logo || mongoose.model<ILogo>('Logo', LogoSchema);

export default Logo;