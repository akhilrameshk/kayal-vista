import mongoose, { Schema, model, models } from 'mongoose';
import { User } from './User'; // Ensure User model is registered

const BoatSchema = new Schema({
  name: { type: String, required: true },
  licenseNumber: { type: String, required: false },
  type: { type: String, required: true },
  rooms: { type: Number, required: true },
  capacity: { type: Number, required: true },
  basePrice: { type: Number, required: true },
  images: [{ type: String }],
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  features: [{ type: String }],
  status: { type: String, default: 'PENDING' }
}, { timestamps: true });

const Boat = models.Boat || model('Boat', BoatSchema);
export default Boat;