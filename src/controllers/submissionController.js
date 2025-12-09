// src/controllers/submissionController.js
import asyncHandler from "express-async-handler";
import Submission from "../models/Submission.js";
import Contest from "../models/Contest.js";
import User from "../models/User.js";

/**
 * POST /api/v1/submissions
 * Private (user/creator/admin)
 * Body: { contestId, submissionLink, notes }
 */
export const createSubmission = asyncHandler(async (req, res) => {
  const { contestId, submissionLink, notes } = req.body;

  if (!contestId || !submissionLink) {
    return res
      .status(400)
      .json({ message: "contestId and submissionLink are required" });
  }

  const contest = await Contest.findById(contestId);

  if (!contest) {
    return res.status(404).json({ message: "Contest not found" });
  }

  if (contest.status !== "approved") {
    return res
      .status(400)
      .json({ message: "Only approved contests can accept submissions" });
  }

  const now = new Date();
  if (contest.deadline && now > contest.deadline) {
    return res
      .status(400)
      .json({ message: "Contest has ended. Submissions are closed." });
  }

  // এক ইউজার যেন এক contest এ একবারই submit করতে পারে
  const already = await Submission.findOne({
    contest: contestId,
    "contestant.id": req.user.id,
  });

  if (already) {
    return res
      .status(400)
      .json({ message: "You have already submitted to this contest." });
  }

  const submission = await Submission.create({
    contest: contestId,
    contestant: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      photoURL: req.user.photoURL || "",
    },
    submissionLink,
    notes,
  });

  // Optional: stats update
  await User.findByIdAndUpdate(req.user.id, {
    $inc: { participatedCount: 1 },
  });

  contest.participantsCount = (contest.participantsCount || 0) + 1;
  await contest.save();

  res.status(201).json({
    message: "Submission created successfully",
    submission,
  });
});

/**
 * GET /api/v1/submissions/contest/:contestId
 * Private (creator/admin) – creator নিজ contest এর সব submissions দেখতে পারবে
 */
export const getContestSubmissionsForCreator = asyncHandler(
  async (req, res) => {
    const { contestId } = req.params;

    const contest = await Contest.findById(contestId);

    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }

    const isAdmin = req.user.role === "admin";
    const isOwner =
      contest.creator?.id?.toString() === req.user.id?.toString();

    if (!isAdmin && !isOwner) {
      return res
        .status(403)
        .json({ message: "Not allowed to view submissions for this contest" });
    }

    const submissions = await Submission.find({
      contest: contestId,
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json(submissions);
  }
);

/**
 * PATCH /api/v1/submissions/:submissionId/declare-winner
 * Private (creator/admin) – winner declare
 */
export const declareWinner = asyncHandler(async (req, res) => {
  const { submissionId } = req.params;

  const submission = await Submission.findById(submissionId);

  if (!submission) {
    return res.status(404).json({ message: "Submission not found" });
  }

  const contest = await Contest.findById(submission.contest);

  if (!contest) {
    return res.status(404).json({ message: "Contest not found" });
  }

  const isAdmin = req.user.role === "admin";
  const isOwner =
    contest.creator?.id?.toString() === req.user.id?.toString();

  if (!isAdmin && !isOwner) {
    return res
      .status(403)
      .json({ message: "Not allowed to declare winner for this contest" });
  }

  const now = new Date();
  if (contest.deadline && now < contest.deadline) {
    return res.status(400).json({
      message: "You can declare a winner only after the contest deadline.",
    });
  }

  if (contest.winner && contest.winner.id) {
    return res
      .status(400)
      .json({ message: "Winner already declared for this contest." });
  }

  // এই submission কে winner হিসেবে mark করি
  submission.status = "winner";
  await submission.save();

  // একই contest এর অন্য সব submission কে lost করি
  await Submission.updateMany(
    {
      contest: contest._id,
      _id: { $ne: submission._id },
    },
    { $set: { status: "lost" } }
  );

  // contest এ winner info save
  contest.winner = {
    id: submission.contestant.id,
    name: submission.contestant.name,
    email: submission.contestant.email,
    photoURL: submission.contestant.photoURL,
    submissionId: submission._id,
    announcedAt: new Date(),
  };

  await contest.save();

  // winner user stats update
  await User.findByIdAndUpdate(submission.contestant.id, {
    $inc: { winCount: 1 },
  });

  res.json({
    message: "Winner declared successfully",
    winner: contest.winner,
  });
});
