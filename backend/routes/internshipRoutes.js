const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const {
  createInternship,
  getAllInternships,
} = require("../controllers/internshipController");

// Create internship (protected)
router.post("/", authMiddleware, createInternship);

// Get all internships
router.get("/", getAllInternships);

module.exports = router;
