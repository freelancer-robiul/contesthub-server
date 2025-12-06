// src/routes/contestRoutes.js
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/roleMiddleware.js";
// import { createContest, updateContest, deleteContest } from "../controllers/contestController.js";

const router = express.Router();

// Creator: add new contest
router.post("/", protect, requireRole("creator"), (req, res) => {
  // placeholder
  res.json({ message: "Create contest (creator only) - TODO" });
});

// Creator: edit own contest (only if pending)
router.put("/:id", protect, requireRole("creator"), (req, res) => {
  // placeholder
  res.json({ message: "Update contest (creator only, pending) - TODO" });
});

// Creator: delete own contest (only if pending)
router.delete("/:id", protect, requireRole("creator"), (req, res) => {
  // placeholder
  res.json({ message: "Delete contest (creator only, pending) - TODO" });
});

export default router;
