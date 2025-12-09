// src/controllers/authController.js
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

/**
 * POST /api/v1/auth/register
 * Body: { name, email, password, photoURL }
 */
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, photoURL } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email & password are required" });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res
      .status(409)
      .json({ message: "User already exists with this email" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    photoURL,
    role: "user",
    provider: "local",
  });

  const token = generateToken(user);

  res.status(201).json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      photoURL: user.photoURL,
      role: user.role,
      participatedCount: user.participatedCount,
      winCount: user.winCount,
    },
    token,
  });
});

/**
 * POST /api/v1/auth/login
 * Body: { email, password }
 */
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email & password are required" });
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (!user.password) {
    // তার মানে এই account টা শুধু Google দিয়ে তৈরি
    return res.status(400).json({
      message: "This account uses Google sign-in. Please login with Google.",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateToken(user);

  res.json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      photoURL: user.photoURL,
      role: user.role,
      participatedCount: user.participatedCount,
      winCount: user.winCount,
    },
    token,
  });
});

/**
 * POST /api/v1/auth/google-login
 * Body: { name, email, photoURL }
 * যদি না থাকে -> create, নাহলে শুধু login
 */
export const googleLogin = asyncHandler(async (req, res) => {
  const { name, email, photoURL } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name: name || email.split("@")[0],
      email,
      photoURL,
      provider: "google",
      role: "user",
      password: null,
    });
  }

  const token = generateToken(user);

  res.json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      photoURL: user.photoURL,
      role: user.role,
      participatedCount: user.participatedCount,
      winCount: user.winCount,
    },
    token,
  });
});

/**
 * GET /api/v1/auth/me
 * Private
 */
export const getMe = asyncHandler(async (req, res) => {
  // authMiddleware protect থেকে req.user সেট হয়ে আসে
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    photoURL: user.photoURL,
    role: user.role,
    participatedCount: user.participatedCount,
    winCount: user.winCount,
  });
});
