import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  specialist: [
    {
      name: { type: String, required: true },
      description: { type: String, required: true },
    }
  ],
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String, default: "" },
    },
  ],
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    }
  ]
});

export default mongoose.model("doctor", DoctorSchema);
