// src/routes/contestRoutes.js
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/roleMiddleware.js";
import {
  getAllContests,
  getPopularContests,
  getContestById,
  createContest,
  updateContest,
  deleteContest,
  getMyContests,
  approveContest,
  rejectContest,
} from "../controllers/contestController.js";

const router = express.Router();

// Public routes
router.get("/", getAllContests); // ?page=&limit=&type=&search=
router.get("/popular", getPopularContests);

// Creator/Admin – নিজের contests
router.get("/mine", protect, requireRole("creator", "admin"), getMyContests);

// Admin approve / reject
router.patch(
  "/:id/approve",
  protect,
  requireRole("admin"),
  approveContest
);
router.patch(
  "/:id/reject",
  protect,
  requireRole("admin"),
  rejectContest
);

// Single contest
router.get("/:id", getContestById);

// Create / update / delete
router.post("/", protect, requireRole("creator", "admin"), createContest);
router.put("/:id", protect, requireRole("creator", "admin"), updateContest);
router.delete(
  "//:id",
  protect,
  requireRole("creator", "admin"),
  deleteContest
);

export default router;
