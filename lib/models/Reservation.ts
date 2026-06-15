import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReservation extends Document {
  userId: string;
  lotId: string;
  paidAmount: number;
  totalPrice: number;
  isResident: boolean;
  status: 'RESERVED' | 'PAID';
  createdAt: Date;
  updatedAt: Date;
}

const ReservationSchema = new Schema<IReservation>(
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
    paidAmount: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    isResident: {
      type: Boolean,
      required: true,
    },
    status: {
      type: String,
      enum: ['RESERVED', 'PAID'],
      default: 'RESERVED',
    },
  },
  {
    timestamps: true,
  }
);

const Reservation: Model<IReservation> =
  mongoose.models.Reservation || mongoose.model<IReservation>('Reservation', ReservationSchema);

export default Reservation;