// src/controllers/authController.js
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

// POST /api/v1/auth/register
export const registerUser = async (req, res) => {
  const { name, email, password, photoURL } = req.body;

  if (!name || !email || !password || !photoURL) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: "Email is already in use" });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
    photoURL,
    role: "user",
  });

  const token = generateToken(user);

  res.status(201).json({
    message: "User registered successfully",
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      photoURL: user.photoURL,
      role: user.role,
    },
  });
};

// POST /api/v1/auth/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = generateToken(user);

  res.json({
    message: "Login successful",
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      photoURL: user.photoURL,
      role: user.role,
    },
  });
};

// POST /api/v1/auth/google-login
// Simple Google login handler (we trust Firebase client here)
export const googleLogin = async (req, res) => {
  const { name, email, photoURL } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  let user = await User.findOne({ email });

  if (!user) {
    // create random password (user will never use it)
    const randomPassword = await bcrypt.hash(Date.now().toString(), 10);

    user = await User.create({
      name: name || email.split("@")[0],
      email,
      photoURL: photoURL || "",
      password: randomPassword,
      role: "user",
    });
  }

  const token = generateToken(user);

  res.json({
    message: "Logged in with Google",
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      photoURL: user.photoURL,
      role: user.role,
    },
  });
};
