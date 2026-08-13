import mongoose, { Schema, Document } from 'mongoose';

export interface INotificationDocument extends Document {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string; // RESERVATION, PAYMENT, APPROVAL, SYSTEM
  read: boolean;
  data?: string; // JSON string for extra data (lotName, userName, amount, etc.)
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotificationDocument>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, required: true },
    read: { type: Boolean, default: false },
    data: { type: String, default: null },
  },
  { timestamps: true }
);

NotificationSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

export const Notification = mongoose.models.Notification || mongoose.model<INotificationDocument>('Notification', NotificationSchema);
