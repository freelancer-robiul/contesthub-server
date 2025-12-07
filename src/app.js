// src/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import adminRoutes from "./routes/adminRoutes.js";
import contestRoutes from "./routes/contestRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

/* ------------------------------
   CORS – dev এর জন্য সব allow
   cors() নিজেই preflight (OPTIONS)
   handle করে, কিছু extra লাগবে না
-------------------------------- */
app.use(
  cors({
    origin: "http://localhost:5173", // তোমার client
  })
);

/* ------------------------------
   BODY PARSER
-------------------------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ------------------------------
   ROOT ROUTE
-------------------------------- */
app.get("/", (req, res) => {
  res.send("ContestHub API is running...");
});

/* ------------------------------
   API ROUTES
-------------------------------- */
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/contests", contestRoutes);
app.use("/api/v1/payments", paymentRoutes);

/* ------------------------------
   ERROR HANDLER
-------------------------------- */
app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* ------------------------------
   404 HANDLER
-------------------------------- */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

export default app;
