import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

// Configure environment variables
dotenv.config();

const app = express();

app.use(cors())

// CORS Configuration
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || "http://localhost:5173", // Match frontend port
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true
//   })
// );

// Middleware
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);

// Server setup
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
