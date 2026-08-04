import mongoose, { Schema, Document } from 'mongoose';

export interface IPaymentDocument extends Document {
  id: string;
  userId: string;
  lotId: string;
  amount: number;
  status: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPaymentDocument>(
  {
    userId: { type: String, required: true, index: true },
    lotId: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    status: { type: String, default: 'PENDING', enum: ['PENDING', 'VALIDATED'] },
    type: { type: String, required: true, enum: ['FULL', 'PARTIAL'] },
  },
  { timestamps: true }
);

PaymentSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

export const Payment = mongoose.models.Payment || mongoose.model<IPaymentDocument>('Payment', PaymentSchema);