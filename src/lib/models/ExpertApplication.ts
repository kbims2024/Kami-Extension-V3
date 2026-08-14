import mongoose, { Schema, Document } from 'mongoose';

export interface IExpertApplicationDocument extends Document {
  id: string;
  fullName: string;
  phone: string;
  whatsapp?: string;
  categoryId: string;
  specialty: string;
  experience: string;
  location: string;
  certifications: string[];
  bio: string;
  availability: string;
  profileImage?: string;
  status: string;
  rejectReason?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ExpertApplicationSchema = new Schema<IExpertApplicationDocument>(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    whatsapp: { type: String, default: null },
    categoryId: { type: String, required: true },
    specialty: { type: String, required: true },
    experience: { type: String, required: true },
    location: { type: String, required: true },
    certifications: [{ type: String }],
    bio: { type: String, required: true },
    availability: { type: String, default: 'Disponible sous 72h' },
    profileImage: { type: String, default: null },
    status: { type: String, default: 'PENDING', enum: ['PENDING', 'APPROVED', 'REJECTED'] },
    rejectReason: { type: String, default: null },
    reviewedBy: { type: String, default: null },
    reviewedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

ExpertApplicationSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    delete (ret as any)._id;
    return ret;
  },
});

export const ExpertApplication =
  mongoose.models.ExpertApplication ||
  mongoose.model<IExpertApplicationDocument>('ExpertApplication', ExpertApplicationSchema);
