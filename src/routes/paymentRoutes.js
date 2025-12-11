// src/routes/paymentRoutes.js
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  joinContest,
  getMyParticipations,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/join", protect, joinContest);
router.get("/my-participations", protect, getMyParticipations);

export default router;
