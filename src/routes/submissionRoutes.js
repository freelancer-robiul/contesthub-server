// src/routes/submissionRoutes.js
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/roleMiddleware.js";
import {
  createSubmission,
  getContestSubmissionsForCreator,
  declareWinner,
} from "../controllers/submissionController.js";

const router = express.Router();

// User/creator submission create
router.post(
  "/",
  protect,
  requireRole("user", "creator", "admin"),
  createSubmission
);

// Creator/Admin → এক contest এর সব submissions
router.get(
  "/contest/:contestId",
  protect,
  requireRole("creator", "admin"),
  getContestSubmissionsForCreator
);

// Creator/Admin → winner declare
router.patch(
  "/:submissionId/declare-winner",
  protect,
  requireRole("creator", "admin"),
  declareWinner
);

export default router;
