import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(express.json());
app.use(cookieParser()); // parse HTTP-only cookies for JWT auth
app.use(cors({
    origin: "http://localhost:5173", // Vite dev server
    credentials: true               // allow cookies to be sent cross-origin
}));

// Routes
app.use("/api/auth", authRoutes); // public: register, login, logout, /me
app.use("/api", chatRoutes);      // protected: all chat + thread routes

// Database Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected with Database!");
    } catch (error) {
        console.error("Failed to connect with DB:", error);
        process.exit(1);
    }
};

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});