// src/routes/adminRoutes.js
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/roleMiddleware.js";
import {
  getAllUsers,
  updateUserRole,
  getAdminContests,
} from "../controllers/adminController.js";

const router = express.Router();

// সব admin route-এর আগে protect + admin check
router.use(protect, requireRole("admin"));

// USERS
router.get("/users", getAllUsers);
router.patch("/users/:id/role", updateUserRole);

// CONTESTS
router.get("/contests", getAdminContests);

export default router;
