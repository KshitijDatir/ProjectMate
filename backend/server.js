const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const cleanupExpiredInternships = require("./utils/cleanupInternships");

// Load environment variables FIRST
dotenv.config();

// Connect to Database
connectDB();

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Start cron jobs
cleanupExpiredInternships();

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/requests", require("./routes/joinRequestRoutes"));
app.use("/api/internships", require("./routes/internshipRoutes"));

// Health check
app.get("/", (req, res) => {
  res.send("ProjectMate backend is running 🚀");
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
