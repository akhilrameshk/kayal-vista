import mongoose from 'mongoose';

const AvailabilitySchema = new mongoose.Schema(
  {
    boatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Boat', // References your existing boat collection
      required: true,
      unique: true,
    },
    blockedDates: [
      {
        type: String, // Plain string 'yyyy-MM-dd' format to bypass server timezone skewing
        required: true,
      },
    ],
  },
  { timestamps: true }
);

// Fallback logic keeps Next.js hot-reloading from recompiling models repeatedly
export default mongoose.models.Availability || mongoose.model('Availability', AvailabilitySchema);