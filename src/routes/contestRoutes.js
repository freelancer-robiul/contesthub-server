// src/routes/contestRoutes.js
import express from "express";
import asyncHandler from "express-async-handler";
import { protect } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/roleMiddleware.js";

import {
  getAllContests,
  getContestById,
  getMyContests,
  createContest,
  updateContest,
  deleteContest,
  approveContest,
  rejectContest,
} from "../controllers/contestController.js";

const router = express.Router();

/**
 * PUBLIC ROUTES
 */

// GET /api/v1/contests  -> all approved contests (or by query)
router.get("/", asyncHandler(getAllContests));

/**
 * CREATOR / ADMIN ROUTES
 * NOTE: /mine অবশ্যই /:id এর উপরে থাকবে
 */

// GET /api/v1/contests/mine -> logged-in creator/admin's contests
router.get(
  "/mine",
  protect,
  requireRole("creator", "admin"),
  asyncHandler(getMyContests)
);

// GET /api/v1/contests/:id -> single contest details (public)
router.get("/:id", asyncHandler(getContestById));

// POST /api/v1/contests -> create contest
router.post(
  "/",
  protect,
  requireRole("creator", "admin"),
  asyncHandler(createContest)
);

// PUT /api/v1/contests/:id -> update contest
router.put(
  "/:id",
  protect,
  requireRole("creator", "admin"),
  asyncHandler(updateContest)
);

// DELETE /api/v1/contests/:id -> delete contest
router.delete(
  "/:id",
  protect,
  requireRole("creator", "admin"),
  asyncHandler(deleteContest)
);

/**
 * ADMIN ONLY ROUTES
 */

// PATCH /api/v1/contests/:id/approve
router.patch(
  "/:id/approve",
  protect,
  requireRole("admin"),
  asyncHandler(approveContest)
);

// PATCH /api/v1/contests/:id/reject
router.patch(
  "/:id/reject",
  protect,
  requireRole("admin"),
  asyncHandler(rejectContest)
);

export default router;
