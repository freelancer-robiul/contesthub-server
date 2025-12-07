// src/routes/adminRoutes.js
import express from "express";
import asyncHandler from "express-async-handler";
import { protect } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/roleMiddleware.js";
import { getAllUsers, updateUserRole } from "../controllers/adminController.js";

const router = express.Router();

// সব admin route এর আগে auth + admin check
router.use(protect, requireRole("admin"));

// GET /api/v1/admin/users  -> সব user
router.get("/users", asyncHandler(getAllUsers));

// PATCH /api/v1/admin/users/:id/role  -> role change
router.patch("/users/:id/role", asyncHandler(updateUserRole));

export default router;
