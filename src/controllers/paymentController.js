// src/controllers/paymentController.js
import asyncHandler from "express-async-handler";
import Contest from "../models/Contest.js";
import Participation from "../models/Participation.js";
import User from "../models/User.js";

export const joinContest = asyncHandler(async (req, res) => {
  const { contestId } = req.body;
  const userId = req.user.id;

  if (!contestId) {
    return res.status(400).json({ message: "contestId is required" });
  }

  const contest = await Contest.findById(contestId);
  if (!contest) {
    return res.status(404).json({ message: "Contest not found" });
  }

  if (contest.deadline && new Date(contest.deadline) < new Date()) {
    return res.status(400).json({ message: "Contest has already ended" });
  }

  const exists = await Participation.findOne({
    user: userId,
    contest: contestId,
    status: "paid",
  });

  if (exists) {
    return res
      .status(400)
      .json({ message: "You have already joined this contest" });
  }

  const amount = contest.price || 0;
  const transactionId =
    "TXN-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);

  const participation = await Participation.create({
    user: userId,
    contest: contestId,
    amountPaid: amount,
    status: "paid",
    transactionId,
  });

  contest.participantsCount = (contest.participantsCount || 0) + 1;
  await contest.save();

  await User.findByIdAndUpdate(userId, {
    $inc: { participatedCount: 1 },
  });

  res.status(201).json({
    message: "Payment successful! You are now registered for this contest.",
    participation,
  });
});

export const getMyParticipations = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const participations = await Participation.find({
    user: userId,
    status: "paid",
  })
    .populate("contest")
    .sort({ createdAt: -1 });

  res.json(participations);
});
