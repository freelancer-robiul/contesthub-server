// src/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import adminRoutes from "./routes/adminRoutes.js";
import contestRoutes from "./routes/contestRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ContestHub API is running...");
});

// BASE API PATH
app.use("/api/v1/admin", adminRoutes);

app.use("/api/v1/contests", contestRoutes);

app.use("/api/v1/payments", paymentRoutes);

export default app;
