// src/routes/userRoutes.js
import express from "express";
import asyncHandler from "express-async-handler";
import { protect } from "../middlewares/authMiddleware.js";
import {
  getMyProfile,
  updateMyProfile,
  getLeaderboard,
} from "../controllers/userController.js";

const router = express.Router();

// 🔹 Public leaderboard
router.get("/leaderboard", asyncHandler(getLeaderboard));

// 🔐 Private profile routes
router.get("/me", protect, asyncHandler(getMyProfile));
router.put("/me", protect, asyncHandler(updateMyProfile));

export default router;
