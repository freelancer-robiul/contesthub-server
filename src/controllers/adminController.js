// src/controllers/adminController.js
import User from "../models/User.js";
import Contest from "../models/Contest.js";

export const getAllUsers = async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users);
};

export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!["user", "creator", "admin"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.role = role;
  await user.save();

  res.json({ message: "Role updated successfully", user });
};

export const getAdminContests = async (req, res) => {
  const { status = "pending" } = req.query;

  const filter = {};
  if (status && status !== "all") {
    filter.status = status;
  }

  const contests = await Contest.find(filter)
    .sort({ createdAt: -1 })
    .populate("creator.id", "name email");

  res.json(contests);
};
