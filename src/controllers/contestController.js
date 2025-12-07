// src/controllers/contestController.js
import Contest from "../models/Contest.js";

/**
 * GET /api/v1/contests
 * Query: status, type, search
 * Public – mainly for All Contests page (approved by default)
 */
export const getAllContests = async (req, res) => {
  const { status = "approved", type, search } = req.query;

  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (type && type !== "all") {
    filter.contestType = type;
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
    ];
  }

  const contests = await Contest.find(filter).sort({
    createdAt: -1,
  });

  res.json(contests);
};

/**
 * GET /api/v1/contests/mine
 * Private – Creator/Admin: list contests created by logged-in user
 */
export const getMyContests = async (req, res) => {
  const userId = req.user.id;

  const contests = await Contest.find({
    "creator.id": userId,
  }).sort({ createdAt: -1 });

  res.json(contests);
};

/**
 * GET /api/v1/contests/:id
 * Public – contest details page
 */
export const getContestById = async (req, res) => {
  const { id } = req.params;

  const contest = await Contest.findById(id);

  if (!contest) {
    return res.status(404).json({ message: "Contest not found" });
  }

  res.json(contest);
};

/**
 * POST /api/v1/contests
 * Creator/Admin → নতুন contest তৈরি
 */
export const createContest = async (req, res) => {
  const {
    name,
    image,
    description,
    price,
    prizeMoney,
    taskInstructions,
    contestType,
    deadline,
    tags,
  } = req.body;

  if (
    !name ||
    !image ||
    !description ||
    price === undefined ||
    prizeMoney === undefined ||
    !taskInstructions ||
    !deadline
  ) {
    return res
      .status(400)
      .json({ message: "All required fields must be filled" });
  }

  const creatorInfo = {
    id: req.user?.id || null,
    name: req.user?.name || "",
    email: req.user?.email || "",
  };

  const contest = await Contest.create({
    name,
    image,
    description,
    price,
    prizeMoney,
    taskInstructions,
    contestType: contestType || "other",
    deadline,
    tags: tags || [],
    status: req.user?.role === "admin" ? "approved" : "pending",
    creator: creatorInfo,
  });

  res.status(201).json({
    message: "Contest created successfully",
    contest,
  });
};

/**
 * PUT /api/v1/contests/:id
 * Creator: নিজের pending contest update করতে পারবে
 * Admin: সব contest update করতে পারবে
 */
export const updateContest = async (req, res) => {
  const { id } = req.params;

  const contest = await Contest.findById(id);

  if (!contest) {
    return res.status(404).json({ message: "Contest not found" });
  }

  const isAdmin = req.user.role === "admin";
  const isOwner =
    contest.creator?.id?.toString() === req.user.id?.toString();

  if (!isAdmin && !isOwner) {
    return res
      .status(403)
      .json({ message: "Not allowed to edit this contest" });
  }

  // creator শুধুমাত্র pending থাকলে edit করতে পারবে
  if (!isAdmin && contest.status !== "pending") {
    return res.status(400).json({
      message: "Only pending contests can be edited by the creator",
    });
  }

  const updatableFields = [
    "name",
    "image",
    "description",
    "price",
    "prizeMoney",
    "taskInstructions",
    "contestType",
    "deadline",
    "tags",
  ];

  updatableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      contest[field] = req.body[field];
    }
  });

  const updated = await contest.save();

  res.json({
    message: "Contest updated successfully",
    contest: updated,
  });
};

/**
 * DELETE /api/v1/contests/:id
 * Creator: নিজের contest delete করতে পারবে (শুধু pending)
 * Admin: সব contest delete করতে পারবে
 */
export const deleteContest = async (req, res) => {
  const { id } = req.params;

  const contest = await Contest.findById(id);

  if (!contest) {
    return res.status(404).json({ message: "Contest not found" });
  }

  const isAdmin = req.user.role === "admin";
  const isOwner =
    contest.creator?.id?.toString() === req.user.id?.toString();

  if (!isAdmin && !isOwner) {
    return res
      .status(403)
      .json({ message: "Not allowed to delete this contest" });
  }

  // Creator only: pending না হলে delete করতে পারবে না
  if (!isAdmin && contest.status !== "pending") {
    return res.status(400).json({
      message: "Only pending contests can be deleted by the creator",
    });
  }

  await contest.deleteOne();

  res.json({ message: "Contest deleted successfully" });
};

/**
 * PATCH /api/v1/contests/:id/approve
 * Admin only
 */
export const approveContest = async (req, res) => {
  const { id } = req.params;

  const contest = await Contest.findById(id);

  if (!contest) {
    return res.status(404).json({ message: "Contest not found" });
  }

  contest.status = "approved";
  const updated = await contest.save();

  res.json({
    message: "Contest approved successfully",
    contest: updated,
  });
};

/**
 * PATCH /api/v1/contests/:id/reject
 * Admin only
 */
export const rejectContest = async (req, res) => {
  const { id } = req.params;

  const contest = await Contest.findById(id);

  if (!contest) {
    return res.status(404).json({ message: "Contest not found" });
  }

  contest.status = "rejected";
  const updated = await contest.save();

  res.json({
    message: "Contest rejected successfully",
    contest: updated,
  });
};
