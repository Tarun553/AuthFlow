import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import cors from "cors";
dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", "https://authflow-frontend-vxpt.onrender.com"],
    
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Connect to MongoDB
connectDB();

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
