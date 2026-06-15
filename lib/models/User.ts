import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  password?: string;
  isResident: boolean;
  referralCode?: string;
  referredByCode?: string;
  profileImage?: string;
  idCard?: string;
  selfie?: string;
  status: 'ACTIVE' | 'BLOCKED';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      default: '',
      required: true,
    },
    lastName: {
      type: String,
      default: '',
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    password: {
      type: String,
    },
    isResident: {
      type: Boolean,
      default: true,
    },
    referralCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    referredByCode: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    idCard: {
      type: String,
    },
    selfie: {
      type: String,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'BLOCKED'],
      default: 'ACTIVE',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in hot reload mode
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;