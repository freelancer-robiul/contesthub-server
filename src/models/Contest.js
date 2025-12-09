// src/models/Contest.js
import mongoose from "mongoose";

const contestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      // entry fee
      type: Number,
      required: true,
    },
    prizeMoney: {
      type: Number,
      required: true,
    },
    taskInstructions: {
      type: String,
      required: true,
    },
    contestType: {
      type: String,
      default: "other", // Image Design, Article, Game Review etc.
    },
    deadline: {
      type: Date,
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    participantsCount: {
      type: Number,
      default: 0,
    },
    creator: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      name: String,
      email: String,
    },
    // Winner info (declare winner করলে এগুলো fill হবে)
    winner: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      name: String,
      email: String,
      photoURL: String,
      submissionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Submission",
      },
      announcedAt: Date,
    },
  },
  { timestamps: true }
);

const Contest = mongoose.model("Contest", contestSchema);

export default Contest;
