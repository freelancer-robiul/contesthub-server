// src/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      // Google sign-in user দের জন্য password null থাকতে পারে
      required: false,
      minlength: 6,
      select: false, // normal query তে password আসবে না
    },
    photoURL: {
      type: String,
      default:
        "https://i.ibb.co/3sWZyPc/default-avatar.png",
    },
    role: {
      type: String,
      enum: ["user", "creator", "admin"],
      default: "user",
    },
    participatedCount: {
      type: Number,
      default: 0,
    },
    winCount: {
      type: Number,
      default: 0,
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
