// src/routes/adminRoutes.js
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/roleMiddleware.js";
import { updateUserRole } from "../controllers/adminController.js";

const router = express.Router();

// Change user role (Admin only)
router.patch("/users/:id/role", protect, requireRole("admin"), updateUserRole);

export default router;
