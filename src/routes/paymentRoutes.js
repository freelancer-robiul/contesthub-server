// src/routes/paymentRoutes.js
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  checkoutAndJoinContest,
  getMyParticipations,
} from "../controllers/paymentController.js";

const router = express.Router();

// Payment + join
router.post("/checkout", protect, checkoutAndJoinContest);

// My participated contests
router.get("/my-participations", protect, getMyParticipations);

export default router;
