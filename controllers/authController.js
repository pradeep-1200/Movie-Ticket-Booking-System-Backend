import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d"
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    console.log("📝 Registration attempt:", { name, email, phone });
    
    // Validation
    if (!name || !email || !password || !phone) {
      console.log("❌ Validation failed: Missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("❌ Invalid email format:", email);
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Password length validation
    if (password.length < 6) {
      console.log("❌ Password too short");
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Phone validation (basic)
    if (phone.length < 10) {
      console.log("❌ Invalid phone number");
      return res.status(400).json({ message: "Invalid phone number" });
    }

    // Check if user exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      console.log("❌ Email already registered:", email);
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create user
    console.log("✅ Creating new user...");
    const user = await User.create({ 
      name: name.trim(), 
      email: email.toLowerCase().trim(), 
      password, 
      phone: phone.trim() 
    });

    console.log("✅ User created successfully:", user._id);

    // Generate token
    const token = generateToken(user._id);

    // Return response
    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      token
    });

    console.log("✅ Registration complete for:", email);

  } catch (error) {
    console.error("❌ Registration error:", error);
    console.error("Error details:", {
      message: error.message,
      name: error.name,
      stack: error.stack
    });

    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: "Validation error", 
        errors: messages 
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({ 
        message: "Email already registered" 
      });
    }

    res.status(500).json({ 
      message: "Server error during registration",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log("🔐 Login attempt:", email);

    // Validation
    if (!email || !password) {
      console.log("❌ Missing email or password");
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log("❌ Password mismatch for:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user._id);

    console.log("✅ Login successful:", email);

    // Return response
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      token
    });

  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ 
      message: "Server error during login",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error("❌ Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};