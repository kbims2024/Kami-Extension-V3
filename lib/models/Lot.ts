import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILot extends Document {
  name: string;
  block: string;
  surface: string;
  priceRes: number;
  priceNon: number;
  status: 'AVAILABLE' | 'RESERVED' | 'PAID';
  description?: string;
  positionX?: number;
  positionY?: number;
  createdAt: Date;
  updatedAt: Date;
}

const LotSchema = new Schema<ILot>(
  {
    name: {
      type: String,
      required: true,
    },
    block: {
      type: String,
      required: true,
    },
    surface: {
      type: String,
      required: true,
    },
    priceRes: {
      type: Number,
      required: true,
    },
    priceNon: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['AVAILABLE', 'RESERVED', 'PAID'],
      default: 'AVAILABLE',
    },
    description: {
      type: String,
    },
    positionX: {
      type: Number,
    },
    positionY: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Lot: Model<ILot> = mongoose.models.Lot || mongoose.model<ILot>('Lot', LotSchema);

export default Lot;