// src/controllers/userController.js
import User from "../models/User.js";
import Contest from "../models/Contest.js";
import Payment from "../models/Payment.js";

/**
 * GET /api/v1/users/me
 * Current user + stats (participated count, win count)
 */
export const getMyProfile = async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // total participations
  const participationCount = await Payment.countDocuments({
    user: userId,
    status: "paid",
  });

  // total winnings (winner.id === userId)
  const winningCount = await Contest.countDocuments({
    "winner.id": userId,
  });

  res.json({
    user,
    stats: {
      participated: participationCount,
      wins: winningCount,
    },
  });
};

/**
 * PUT /api/v1/users/me
 * Update user profile
 */
export const updateMyProfile = async (req, res) => {
  const { name, photoURL, bio } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      ...(name && { name }),
      ...(photoURL && { photoURL }),
      ...(bio && { bio }),
    },
    { new: true }
  ).select("-password");

  res.json({
    message: "Profile updated successfully",
    user: updatedUser,
  });
};

/**
 * GET /api/v1/users/leaderboard?limit=10
 * Public – users ranked by number of contest wins
 */
export const getLeaderboard = async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;

  // top users by wins, তারপর participatedCount
  const users = await User.find(
    {},
    "name email photoURL role participatedCount winCount createdAt"
  )
    .sort({ winCount: -1, participatedCount: -1 })
    .limit(limit)
    .lean();

  const leaderboard = users.map((u, index) => {
    const participated = u.participatedCount || 0;
    const wins = u.winCount || 0;
    const winPercentage =
      participated === 0 ? 0 : Math.round((wins / participated) * 100);

    return {
      rank: index + 1,
      _id: u._id,
      name: u.name,
      email: u.email,
      photoURL: u.photoURL,
      role: u.role,
      participatedCount: participated,
      winCount: wins,
      winPercentage,
      joinedAt: u.createdAt,
    };
  });

  res.json(leaderboard);
};
