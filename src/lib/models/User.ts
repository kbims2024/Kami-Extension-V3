import mongoose, { Schema, Document } from 'mongoose';

export interface IUserDocument extends Document {
  id: string;
  name: string;
  pseudo: string;
  phone?: string;
  email?: string;
  password?: string;
  role: string;
  isResident: boolean;
  referralCode?: string;
  referredByCode?: string;
  status: string;
  resetToken?: string;
  resetTokenExpires?: Date;
  quartier?: string;
  villageOrigine?: string;
  congratulatedLots: string;
  profilePhoto?: string;
  lastSeen?: Date;
  isOnline?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    pseudo: { type: String, required: true, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
    email: { type: String, unique: true, sparse: true },
    password: { type: String, default: null },
    role: { type: String, default: 'USER', enum: ['USER', 'ADMIN', 'MANAGEMENT_COMMITTEE'] },
    isResident: { type: Boolean, default: true },
    referralCode: { type: String, unique: true, sparse: true },
    referredByCode: { type: String, default: null },
    status: { type: String, default: 'ACTIVE', enum: ['ACTIVE', 'BLOCKED'] },
    resetToken: { type: String, unique: true, sparse: true },
    resetTokenExpires: { type: Date, default: null },
    quartier: { type: String, default: null },
    villageOrigine: { type: String, default: null },
    congratulatedLots: { type: String, default: '' },
    profilePhoto: { type: String, default: null },
    lastSeen: { type: Date, default: null },
    isOnline: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual for id (maps _id to id)
UserSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    delete (ret as any)._id;
    return ret;
  },
});

export const User = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);
