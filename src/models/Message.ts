import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IMessage extends Document {
  name: string;
  email: string;
  message: string;
  status: 'PENDING' | 'RESOLVED';
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['PENDING', 'RESOLVED'], default: 'PENDING' },
  },
  { timestamps: true }
);

export default models.Message || model<IMessage>('Message', MessageSchema);