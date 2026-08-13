import mongoose, { Schema, Document } from 'mongoose';

export interface ILotDocument extends Document {
  id: string;
  name: string;
  block: string;
  surface: string;
  priceRes: number;
  priceNon: number;
  status: string;
  description?: string;
  positionX?: number;
  positionY?: number;
  createdAt: Date;
  updatedAt: Date;
}

const LotSchema = new Schema<ILotDocument>(
  {
    name: { type: String, required: true },
    block: { type: String, required: true },
    surface: { type: String, required: true },
    priceRes: { type: Number, required: true },
    priceNon: { type: Number, required: true },
    status: { type: String, default: 'AVAILABLE', enum: ['AVAILABLE', 'RESERVED', 'PAID'] },
    description: { type: String, default: null },
    positionX: { type: Number, default: null },
    positionY: { type: Number, default: null },
  },
  { timestamps: true }
);

LotSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

export const Lot = mongoose.models.Lot || mongoose.model<ILotDocument>('Lot', LotSchema);