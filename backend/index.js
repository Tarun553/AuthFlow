import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import cors from "cors";

const app = express();

const AllowedOrigins = process.env.ALLOWED_ORIGINS?.split(",");

// Middleware
app.use(
  cors({
    origin: function (origin, cb) {
      console.log("origin ==> ", origin);
      if (AllowedOrigins && AllowedOrigins.indexOf(origin) !== -1) {
        cb(null, origin);
      } else {
        cb(new Error("Not Allowed by CORS"), false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
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
