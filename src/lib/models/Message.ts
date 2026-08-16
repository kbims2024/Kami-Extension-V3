import mongoose, { Schema, Document } from 'mongoose';

export interface IMessageAttachment {
  type: 'audio' | 'video' | 'file';
  url: string;
  mimeType: string;
  size: number;
  name?: string;
  duration?: number;
}

export interface IMessageDocument extends Document {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  attachment?: IMessageAttachment | null;
  archivedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessageDocument>(
  {
    senderId: { type: String, required: true, index: true },
    receiverId: { type: String, required: true, index: true },
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
    attachment: { type: Schema.Types.Mixed, default: null },
    archivedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

MessageSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    delete (ret as any)._id;
    return ret;
  },
});

export const Message = mongoose.models.Message || mongoose.model<IMessageDocument>('Message', MessageSchema);