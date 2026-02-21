import express from "express";
import cors from "cors";
import multer from "multer";
import crypto from "crypto";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: true }));
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// In-memory stores
const users = new Map();
const tokens = new Map();
const contacts = [];
const reportsByUser = new Map();
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
  { title: "Annual Checkup", date: "Mar 15, 2026", time: "10:00 AM", doctor: "Dr. Sarah Johnson" },
  { title: "Follow-up Consultation", date: "Mar 22, 2026", time: "2:30 PM", doctor: "Dr. Michael Chen" },
];

function genToken() {
  return "tk_" + crypto.randomBytes(24).toString("hex");
}

function getUserId(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  return tokens.get(token) || null;
}

// POST /api/auth/signup
app.post("/api/auth/signup", (req, res) => {
  const { name, email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }
  if (users.has(email.toLowerCase())) {
    return res.status(400).json({ message: "Email already registered" });
  }
  const id = "u_" + crypto.randomBytes(8).toString("hex");
  const user = { id, name: name || "User", email: email.toLowerCase() };
  users.set(email.toLowerCase(), { ...user, password });
  const token = genToken();
  tokens.set(token, id);
  res.json({ token, user: { id, name: user.name, email: user.email } });
});

// POST /api/auth/login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }
  const record = users.get(email.toLowerCase());
  if (!record || record.password !== password) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const token = genToken();
  tokens.set(token, record.id);
  res.json({
    token,
    user: { id: record.id, name: record.name, email: record.email },
  });
});

// POST /api/contact
app.post("/api/contact", (req, res) => {
  const { firstName, lastName, email, phone, subject, message } = req.body || {};
  contacts.push({ firstName, lastName, email, phone, subject, message, at: new Date().toISOString() });
  res.json({ success: true, message: "Message received. We'll get back to you within 24 hours." });
});

// POST /api/reports/upload
app.post("/api/reports/upload", upload.single("file"), (req, res) => {
  const userId = getUserId(req);
  const file = req.file;
  const title = file?.originalname || "Uploaded Report";
  const id = "r_" + Date.now();
  const report = { id, title, date: "Just now", status: "Pending", color: "blue" };
  if (userId) {
    const list = reportsByUser.get(userId) || [];
    list.unshift(report);
    reportsByUser.set(userId, list);
  }
  res.json({ id, title });
});

// POST /api/reports/analyze - analyze uploaded PDF/report (mock AI response)
app.post("/api/reports/analyze", upload.single("file"), (req, res) => {
  const file = req.file;
  const filename = file?.originalname || "report";
  const isPdf = filename.toLowerCase().endsWith(".pdf");
  const isImage = file?.mimetype?.startsWith("image/");
  res.json({
    summary: isPdf
      ? "Your report has been processed. Key biomarkers and findings have been extracted and interpreted below."
      : isImage
        ? "Your image report has been analyzed. Please review the findings and recommendations."
        : "Your document has been analyzed. Summary and recommendations are provided below.",
    keyFindings: [
      "Document type: " + (isPdf ? "PDF" : isImage ? "Image" : "Text/Other"),
      "All major sections were detected and parsed successfully.",
      "No critical abnormalities flagged in the reviewed ranges.",
      "Values within normal reference ranges where applicable.",
    ],
    recommendations: [
      "Discuss these results with your healthcare provider at your next visit.",
      "Keep a copy of this report for your records.",
      "Schedule follow-up tests if your doctor has recommended them.",
    ],
    status: "Reviewed",
  });
});

// GET /api/reports
app.get("/api/reports", (req, res) => {
  const userId = getUserId(req);
  const list = userId ? (reportsByUser.get(userId) || []) : [];
  const combined = list.length ? list : DEFAULT_REPORTS;
  res.json(combined);
});

// POST /api/voice/analyze
app.post("/api/voice/analyze", upload.single("audio"), (req, res) => {
  res.json({
    symptoms: ["Headache", "Fatigue", "Mild fever"],
    possibleConditions: ["Common Cold", "Stress-related headache", "Dehydration"],
    recommendations: [
      "Rest and hydrate well",
      "Monitor temperature",
      "Consult a doctor if symptoms persist beyond 3 days",
    ],
  });
});

// POST /api/voice/save - save voice analysis to user dashboard
app.post("/api/voice/save", (req, res) => {
  const userId = getUserId(req);
  const { analysisId } = req.body || {};
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  res.json({ success: true });
});

// GET /api/user - get current user (for dashboard welcome)
app.get("/api/user", (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  for (const u of users.values()) {
    if (u.id === userId) {
      return res.json({ id: u.id, name: u.name, email: u.email });
    }
  }
  res.status(404).json({ message: "User not found" });
});

// GET /api/dashboard/metrics
app.get("/api/dashboard/metrics", (req, res) => {
  res.json(METRICS);
});

// GET /api/dashboard/appointments
app.get("/api/dashboard/appointments", (req, res) => {
  res.json(APPOINTMENTS);
});

app.listen(PORT, () => {
  console.log(`MediSense API running at http://localhost:${PORT}`);
});
