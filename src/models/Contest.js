// src/models/Contest.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const winnerSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    name: String,
    photoURL: String,
  },
  { _id: false }
);

const contestSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Contest name is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Contest image is required"],
    },
    description: {
      type: String,
      required: [true, "Contest description is required"],
    },
    price: {
      type: Number,
      required: [true, "Entry fee is required"],
      default: 0,
    },
    prizeMoney: {
      type: Number,
      required: [true, "Prize money is required"],
      default: 0,
    },
    taskInstructions: {
      type: String,
      required: [true, "Task instruction is required"],
    },
    contestType: {
      type: String,
      enum: [
        "image-design",
        "article-writing",
        "business-idea",
        "game-review",
        "other",
      ],
      default: "other",
    },
    tags: {
      type: [String],
      default: [],
    },
    deadline: {
      type: Date,
      required: [true, "Deadline is required"],
    },
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
      id: { type: Schema.Types.ObjectId, ref: "User" },
      name: String,
      email: String,
    },
    winner: winnerSchema,
  },
  { timestamps: true }
);

const Contest = mongoose.model("Contest", contestSchema);

export default Contest;
