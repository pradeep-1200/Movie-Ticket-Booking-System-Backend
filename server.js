import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

// Load environment variables
dotenv.config();

// Validate required environment variables
if (!process.env.MONGODB_URI) {
  console.error("❌ ERROR: MONGODB_URI is not defined in .env file");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("❌ ERROR: JWT_SECRET is not defined in .env file");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("CineBook API running");
});

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/bookings", bookingRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({ 
    message: "Something went wrong!", 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// Database connection with retry logic
const connectDB = async (retries = 5) => {
  try {
    console.log("🔄 Attempting to connect to MongoDB...");
    
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log("✅ MongoDB connected successfully!");
    console.log(`📍 Database: ${mongoose.connection.name}`);
    
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    
    if (retries > 0) {
      console.log(`🔄 Retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 3000));
      return connectDB(retries - 1);
    } else {
      console.error("❌ Failed to connect to MongoDB after multiple attempts");
      process.exit(1);
    }
  }
};

// Start server
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📡 API Base URL: http://localhost:${PORT}`);
      console.log(`🔐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log("\n📚 Available routes:");
      console.log(`   POST   /api/auth/register`);
      console.log(`   POST   /api/auth/login`);
      console.log(`   GET    /api/auth/profile`);
      console.log(`   GET    /api/movies`);
      console.log(`   POST   /api/bookings`);
      console.log(`   GET    /api/bookings/my-bookings`);
      console.log("\n✨ Server ready to accept requests!\n");
    });
    
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n⚠️  Shutting down gracefully...');
  await mongoose.connection.close();
  console.log('✅ MongoDB connection closed');
  process.exit(0);
});

// Start the server
startServer();