import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    favorites: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, required: true },
        type: { type: String, enum: ["doctor"], required: true },
      },
    ],
    reviews: [
      {
        target: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "targetType",
          required: true,
        },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, default: "" },
        targetType: {
          type: String,
          enum: ["doctor"],
          required: true,
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
