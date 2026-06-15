import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPayment extends Document {
  userId: string;
  lotId: string;
  amount: number;
  status: 'PENDING' | 'VALIDATED';
  type: 'FULL' | 'PARTIAL';
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    lotId: {
      type: String,
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'VALIDATED'],
      default: 'PENDING',
    },
    type: {
      type: String,
      enum: ['FULL', 'PARTIAL'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Payment: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);

export default Payment;