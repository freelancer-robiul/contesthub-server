// src/controllers/adminController.js
import User from "../models/User.js";

/**
 * GET /api/v1/admin/users
 * Admin only – সব user list (password ছাড়া)
 */
export const getAllUsers = async (req, res) => {
  const users = await User.find({}, "-password").sort({ createdAt: -1 });
  res.json(users);
};

/**
 * PATCH /api/v1/admin/users/:id/role
 * Admin only – user ↔ creator ↔ admin role change
 */
export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const allowedRoles = ["user", "creator", "admin"];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  // নিজের role block করতে চাইলে এখানে check যোগ করতে পারো
  if (req.user.id === id && role !== "admin") {
    return res
      .status(400)
      .json({ message: "You cannot change your own admin role" });
  }

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.role = role;
  const updated = await user.save();

  res.json({
    message: `Role updated to ${role}`,
    user: {
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      photoURL: updated.photoURL,
      role: updated.role,
    },
  });
};
