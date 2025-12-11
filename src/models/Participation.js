// src/models/Participation.js
import mongoose from "mongoose";

const participationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contest",
      required: true,
    },
    amountPaid: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["paid", "refunded"],
      default: "paid",
    },
    transactionId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

participationSchema.index({ user: 1, contest: 1 }, { unique: true });

const Participation = mongoose.model("Participation", participationSchema);

export default Participation;
