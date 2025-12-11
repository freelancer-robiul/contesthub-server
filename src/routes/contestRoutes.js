// src/routes/contestRoutes.js
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/roleMiddleware.js";
import {
  getAllContests,
  getMyContests,
  getContestById,
  createContest,
  updateContest,
  deleteContest,
  approveContest,
  rejectContest,
} from "../controllers/contestController.js";

const router = express.Router();

// ----- public -----
router.get("/", getAllContests);

// ⚠️ more specific routes আগে
router.get("/mine/list", protect, requireRole("creator", "admin"), getMyContests);

// public details
router.get("/:id", getContestById);

// ----- private (creator / admin) -----
router.post("/", protect, requireRole("creator", "admin"), createContest);

router.put("/:id", protect, requireRole("creator", "admin"), updateContest);

router.delete("/:id", protect, requireRole("creator", "admin"), deleteContest);

// ----- admin only -----
router.patch("/:id/approve", protect, requireRole("admin"), approveContest);
router.patch("/:id/reject", protect, requireRole("admin"), rejectContest);

export default router;
