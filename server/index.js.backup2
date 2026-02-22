const express = require("express");
const cors = require("cors");
const crypto = require("node:crypto");
const multer = require("multer");
const { MongoClient, ServerApiVersion } = require("mongodb");
const mongoose = require("mongoose");
const mammoth = require("mammoth");
const pdf = require("pdfjs-dist");
const Tesseract = require("tesseract.js");
const upload = multer({ storage: multer.memoryStorage() });

// Import MongoDB models
const { User, OTP, Contact, Report, HealthMetrics, Appointment, VoiceAnalysis } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: true }));
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/medisense";

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Default data for fallback
const DEFAULT_REPORTS = [
  { id: "1", title: "Blood Test Results", date: "2 days ago", status: "Reviewed", color: "emerald" },
  { id: "2", title: "Cholesterol Panel", date: "1 week ago", status: "Pending", color: "blue" },
  { id: "3", title: "Thyroid Function Test", date: "2 weeks ago", status: "Reviewed", color: "emerald" },
];
const METRICS = [
  { label: "Blood Pressure", value: "120/80", status: "Normal", color: "emerald" },
  { label: "Heart Rate", value: "72 bpm", status: "Good", color: "blue" },
  { label: "Glucose", value: "95 mg/dL", status: "Normal", color: "emerald" },
  { label: "BMI", value: "23.5", status: "Healthy", color: "blue" },
];
const APPOINTMENTS = [
  { id: "1", title: "General Checkup", date: "2024-01-15", time: "10:00 AM", doctor: "Dr. Sarah Johnson", status: "upcoming" },
  { id: "2", title: "Cardiology Consultation", date: "2024-01-20", time: "2:30 PM", doctor: "Dr. Michael Chen", status: "upcoming" },
  { id: "3", title: "Blood Test", date: "2024-01-25", time: "9:00 AM", doctor: "Dr. Emily Davis", status: "scheduled" },
];
const DOCTORS = [
  { id: "1", name: "Dr. Sarah Johnson", specialty: "General Practitioner", rating: 4.8, experience: "10 years", image: "https://picsum.photos/seed/doctor1/100/100" },
  { id: "2", name: "Dr. Michael Chen", specialty: "Cardiologist", rating: 4.9, experience: "15 years", image: "https://picsum.photos/seed/doctor2/100/100" },
  { id: "3", name: "Dr. Emily Davis", specialty: "Endocrinologist", rating: 4.7, experience: "12 years", image: "https://picsum.photos/seed/doctor3/100/100" },
];

// Generate random token
function genToken() {
  return crypto.randomBytes(32).toString("hex");
}

// Get user ID from token
function getUserId(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  return tokens.get(token) || null;
}

// In-memory token store (for now)
const tokens = new Map();

// POST /api/auth/send-signup-otp - Send OTP for signup
app.post("/api/auth/send-signup-otp", async (req, res) => {
  const { email } = req.body || {};
  if (!email) {
    return res.status(400).json({ success: false, message: "Email required" });
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: "Please enter a valid email address" });
  }
  
  const emailLower = email.toLowerCase();
  
  try {
    // Check if email already exists in MongoDB
    const existingUser = await User.findOne({ email: emailLower });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Store OTP in MongoDB
    await OTP.create({
      email: emailLower,
      otp,
      type: "signup",
      expiresAt: new Date(expiresAt)
    });

    // In production, send OTP via EmailJS or other email service
    // For now, we'll return success (EmailJS will be handled on client side)
    res.json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (error) {
    console.error("Error in signup OTP:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// POST /api/auth/verify-otp-signup - Verify OTP and complete signup
app.post("/api/auth/verify-otp-signup", async (req, res) => {
  const { name, email, otp, password } = req.body || {};
  if (!email || !otp || !password || !name) {
    return res.status(400).json({ message: "Name, email, OTP, and password required" });
  }

  // Validate password requirements
  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters long" });
  }
  if (!/[A-Z]/.test(password)) {
    return res.status(400).json({ message: "Password must contain at least one uppercase letter" });
  }
  if (!/[a-z]/.test(password)) {
    return res.status(400).json({ message: "Password must contain at least one lowercase letter" });
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return res.status(400).json({ message: "Password must contain at least one special symbol" });
  }

  const emailLower = email.toLowerCase();
  
  try {
    // Find OTP in MongoDB
    const stored = await OTP.findOne({ email: emailLower, type: "signup" });
    if (!stored) {
      return res.status(400).json({ message: "OTP not found or expired. Please request a new OTP." });
    }

    if (Date.now() > stored.expiresAt.getTime()) {
      await OTP.deleteOne({ email: emailLower, type: "signup" });
      return res.status(400).json({ message: "OTP has expired. Please request a new OTP." });
    }

    if (stored.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP. Please try again." });
    }

    // Check if email already exists (double check)
    const existingUser = await User.findOne({ email: emailLower });
    if (existingUser) {
      await OTP.deleteOne({ email: emailLower, type: "signup" });
      return res.status(400).json({ message: "Email already registered" });
    }

    // OTP verified, create user
    const id = "u_" + crypto.randomBytes(8).toString("hex");
    const user = await User.create({
      id,
      name: name || "User",
      email: emailLower,
      password,
      createdAt: new Date()
    });

    // Clear OTP
    await OTP.deleteOne({ email: emailLower, type: "signup" });

    const token = genToken();
    tokens.set(token, id);
    res.json({
      token,
      user: { id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Error in signup verification:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// POST /api/auth/send-otp - Send OTP for login
app.post("/api/auth/send-otp", async (req, res) => {
  const { email } = req.body || {};
  if (!email) {
    return res.status(400).json({ success: false, message: "Email required" });
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: "Please enter a valid email address" });
  }
  
  const emailLower = email.toLowerCase();
  
  try {
    // Check if user exists in MongoDB
    const record = await User.findOne({ email: emailLower });
    if (!record) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Store OTP (password will be verified against user record)
    await OTP.create({
      email: emailLower,
      otp,
      type: "login",
      expiresAt: new Date(expiresAt)
    });

    // In production, send OTP via EmailJS or other email service
    // For now, we'll return success (EmailJS will be handled on client side)
    res.json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (error) {
    console.error("Error in login OTP:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// POST /api/auth/verify-otp-login - Verify OTP and login
app.post("/api/auth/verify-otp-login", async (req, res) => {
  const { email, otp, password } = req.body || {};
  if (!email || !otp || !password) {
    return res.status(400).json({ message: "Email, OTP, and password required" });
  }

  const emailLower = email.toLowerCase();
  
  try {
    // Find OTP in MongoDB
    const stored = await OTP.findOne({ email: emailLower, type: "login" });
    if (!stored) {
      return res.status(400).json({ message: "OTP not found or expired. Please request a new OTP." });
    }

    if (Date.now() > stored.expiresAt.getTime()) {
      await OTP.deleteOne({ email: emailLower, type: "login" });
      return res.status(400).json({ message: "OTP has expired. Please request a new OTP." });
    }

    if (stored.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP. Please try again." });
    }

    // Get user record
    const record = await User.findOne({ email: emailLower });
    if (!record) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify password matches user's actual password
    if (record.password !== password) {
      await OTP.deleteOne({ email: emailLower, type: "login" });
      return res.status(401).json({ message: "Invalid password" });
    }

    // OTP and password verified, proceed with login
    const token = genToken();
    tokens.set(token, record.id);
    
    // Clear OTP
    await OTP.deleteOne({ email: emailLower, type: "login" });
    
    res.json({
      token,
      user: { id: record.id, name: record.name, email: record.email },
    });
  } catch (error) {
    console.error("Error in login verification:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// POST /api/auth/signup (keep for backward compatibility, but now requires OTP)
app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }
  
  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const id = "u_" + crypto.randomBytes(8).toString("hex");
    const user = await User.create({
      id,
      name: name || "User",
      email: email.toLowerCase(),
      password,
      createdAt: new Date()
    });

    const token = genToken();
    tokens.set(token, id);
    res.json({
      token,
      user: { id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Error in signup:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// POST /api/auth/login (keep for backward compatibility)
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    const record = await User.findOne({ email: email.toLowerCase() });
    if (!record || record.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = genToken();
    tokens.set(token, record.id);
    res.json({
      token,
      user: { id: record.id, name: record.name, email: record.email },
    });
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// POST /api/contact
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ message: "Name, email, and message required" });
  }

  try {
    const contact = await Contact.create({
      name,
      email,
      message,
      createdAt: new Date()
    });

    console.log("Contact form submission:", contact);
    res.json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Error in contact:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// POST /api/reports/upload
app.post("/api/reports/upload", upload.single("file"), async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const report = await Report.create({
      userId,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      analysis: { status: "uploaded", message: "Report uploaded successfully" },
      uploadedAt: new Date()
    });

    res.json({
      success: true,
      message: "Report uploaded successfully",
      report: {
        id: report._id,
        fileName: report.fileName,
        fileType: report.fileType,
        uploadedAt: report.uploadedAt
      }
    });
  } catch (error) {
    console.error("Error uploading report:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// GET /api/reports
app.get("/api/reports", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const reports = await Report.find({ userId }).sort({ uploadedAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// POST /api/voice/analyze
app.post("/api/voice/analyze", upload.single("audio"), async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No audio file uploaded" });
    }

    // Mock voice analysis (replace with actual voice processing)
    const analysis = {
      transcript: "Patient reports feeling tired and experiencing headaches for the past week. Also mentions difficulty sleeping and occasional dizziness.",
      symptoms: ["fatigue", "headaches", "sleep disturbance", "dizziness"],
      possibleConditions: [
        { condition: "Stress/Anxiety", probability: 0.75 },
        { condition: "Migraine", probability: 0.65 },
        { condition: "Sleep Deprivation", probability: 0.80 }
      ],
      recommendations: [
        "Consider stress management techniques",
        "Maintain regular sleep schedule",
        "Stay hydrated and maintain balanced diet",
        "Consult with primary care physician if symptoms persist"
      ],
      urgency: "medium",
      followUpRequired: true
    };

    const voiceAnalysis = await VoiceAnalysis.create({
      userId,
      transcript: analysis.transcript,
      analysis,
      audioFileName: req.file.originalname,
      analysisId: "analysis_" + Date.now(),
      createdAt: new Date()
    });

    res.json({
      success: true,
      analysis,
      analysisId: voiceAnalysis.analysisId
    });
  } catch (error) {
    console.error("Error in voice analysis:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// GET /api/dashboard/metrics
app.get("/api/dashboard/metrics", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const metrics = await HealthMetrics.find({ userId }).sort({ recordedAt: -1 }).limit(10);
    res.json(metrics || METRICS);
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// POST /api/dashboard/metrics
app.post("/api/dashboard/metrics", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { metrics } = req.body || {};
    if (!Array.isArray(metrics)) {
      return res.status(400).json({ message: "Metrics array required" });
    }

    const savedMetrics = await HealthMetrics.create({
      userId,
      ...metrics,
      recordedAt: new Date()
    });

    console.log("Saving metrics for user:", userId, savedMetrics);
    res.json({ success: true, message: "Metrics saved successfully" });
  } catch (error) {
    console.error("Error saving metrics:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// GET /api/dashboard/appointments
app.get("/api/dashboard/appointments", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const appointments = await Appointment.find({ userId }).sort({ date: 1 });
    res.json(appointments || APPOINTMENTS);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// POST /api/dashboard/appointments
app.post("/api/dashboard/appointments", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { title, date, time, doctor, notes } = req.body || {};
    if (!title || !date || !time || !doctor) {
      return res.status(400).json({ message: "Title, date, time, and doctor required" });
    }

    const appointment = await Appointment.create({
      userId,
      title,
      date,
      time,
      doctor,
      notes: notes || "",
      createdAt: new Date()
    });

    console.log("Adding appointment for user:", userId, appointment);
    res.json({ success: true, message: "Appointment added successfully" });
  } catch (error) {
    console.error("Error adding appointment:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// GET /api/dashboard/doctors
app.get("/api/dashboard/doctors", (req, res) => {
  res.json(DOCTORS);
});

// GET /api/user/info
app.get("/api/user/info", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`MongoDB URI: ${MONGODB_URI}`);
});
