import mongoose, { Schema, Document } from 'mongoose';

export interface IReservationDocument extends Document {
  id: string;
  userId: string;
  lotId: string;
  paidAmount: number;
  totalPrice: number;
  isResident: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReservationSchema = new Schema<IReservationDocument>(
  {
    userId: { type: String, required: true, index: true },
    lotId: { type: String, required: true, index: true },
    paidAmount: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    isResident: { type: Boolean, required: true },
    status: { type: String, default: 'RESERVED', enum: ['RESERVED', 'PAID'] },
  },
  { timestamps: true }
);

ReservationSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    delete (ret as any)._id;
    return ret;
  },
});

export const Reservation = mongoose.models.Reservation || mongoose.model<IReservationDocument>('Reservation', ReservationSchema);