import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  entity: { type: String, enum: ["doctor"], required: true },
  entityId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "entity" },
  service: {
    name: { type: String, required: true },
    description: { type: String, required: true },
  },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ["Progress", "Confirmed", "Done", "Cancelled"], default: "Progress" },
});

export default mongoose.model("booking", BookingSchema);


