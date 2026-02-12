const express = require("express");
const router = express.Router();
const {
  createInternship,
  getAllInternships,
  getInternshipById,
} = require("../controllers/internshipController");

const authMiddleware = require("../middlewares/authMiddleware");

// Create internship (protected)
router.post("/", authMiddleware, createInternship);


// Get all internships
router.get("/", authMiddleware,getAllInternships);

// Get single internship
router.get("/:id", authMiddleware, getInternshipById);


module.exports = router;
