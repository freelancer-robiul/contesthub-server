// src/controllers/paymentController.js
import Contest from "../models/Contest.js";
import User from "../models/User.js";
import Participation from "../models/Participation.js";

/**
 * POST /api/v1/payments/checkout
 * Body: { contestId }
 * Private (JWT)
 * কাজ: fake payment + participation create + counters update
 */
export const checkoutAndJoinContest = async (req, res) => {
  const { contestId } = req.body;
  const userId = req.user.id;

  if (!contestId) {
    return res.status(400).json({ message: "contestId is required" });
  }

  // contest খুঁজে বের করো
  const contest = await Contest.findById(contestId);
  if (!contest) {
    return res.status(404).json({ message: "Contest not found" });
  }

  // deadline চেক
  const now = new Date();
  if (contest.deadline && new Date(contest.deadline) < now) {
    return res.status(400).json({ message: "This contest has already ended" });
  }

  // আগেই joined কিনা চেক
  const existing = await Participation.findOne({
    user: userId,
    contest: contestId,
    status: "paid",
  });

  if (existing) {
    return res
      .status(400)
      .json({ message: "You have already joined this contest" });
  }

  const amount = contest.price || 0;

  // fake transaction id (real gateway লাগলে এখানেই integrate করবে)
  const transactionId =
    "TXN-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);

  const participation = await Participation.create({
    user: userId,
    contest: contestId,
    amount,
    status: "paid",
    transactionId,
  });

  // contest participants count update
  contest.participantsCount = (contest.participantsCount || 0) + 1;
  await contest.save();

  // user participatedCount update (schema তে আছে ধরে নিচ্ছি)
  await User.findByIdAndUpdate(userId, {
    $inc: { participatedCount: 1 },
  });

  return res.status(201).json({
    message: "Payment successful. You are now registered for this contest.",
    participation,
  });
};

/**
 * GET /api/v1/payments/my-participations
 * Private (JWT)
 * কাজ: logged-in user এর সব paid participations + contest info
 */
export const getMyParticipations = async (req, res) => {
  const userId = req.user.id;

  const participations = await Participation.find({
    user: userId,
    status: "paid",
  })
    .populate("contest")
    .sort({ createdAt: -1 });

  return res.json(participations);
};
