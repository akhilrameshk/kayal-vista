import mongoose, { Schema, model, models } from 'mongoose';

const BookingSchema = new Schema({
  boatId: { type: Schema.Types.ObjectId, ref: 'Boat', required: true },
  customer: { name: String, email: String, phone: String },
  totalPrice: { type: Number, required: true },
  status: { type: String, default: 'PENDING' },
  paymentId: { type: String },
  orderId: { type: String },
  travelDate: { type: Date, required: true }, // Add this line
  createdAt: { type: Date, default: Date.now }
});

const Booking = models.Booking || model('Booking', BookingSchema);
export default Booking;