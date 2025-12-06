// src/routes/paymentRoutes.js
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// After successful payment (webhook or confirm endpoint)
// Example: only normal users can join (role === "user")
router.post("/join/:contestId", protect, requireRole("user"), (req, res) => {
  // TODO:
  // - mark this user as participant for this contest
  // - increase participantsCount
  res.json({ message: "Join contest after payment - TODO" });
});

export default router;
