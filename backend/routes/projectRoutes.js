const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const {
  createProject,
  getAllProjects,
  getProjectById,
} = require("../controllers/projectController");

const {
  applyToProject,
  getProjectRequests,
} = require("../controllers/joinRequestController");


// Create project (protected)
router.post("/", authMiddleware, createProject);

// Get all open projects
router.get("/", getAllProjects);

// Get single project
router.get("/:id", getProjectById);

// Apply to project
router.post("/:projectId/join", authMiddleware, applyToProject);

// View project join requests (owner)
router.get("/:projectId/requests", authMiddleware, getProjectRequests);


module.exports = router;
