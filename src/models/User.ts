import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    contactDetails: {
      type: String,
      required: [true, 'Contact information is required'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      enum: ['SUPER_ADMIN', 'BOAT_OWNER', 'NORMAL_USER'],
      default: 'NORMAL_USER',
    },
  },
  { timestamps: true }
);

// Prevent compiling errors on hot-reloads during Next.js local runtime
export const User = models.User || model('User', UserSchema);