const express = require("express");
const router = express.Router();
const { getMyProjects } = require("../controllers/projectController");


const authMiddleware = require("../middlewares/authMiddleware");
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProjectStatus,
  updateProject
} = require("../controllers/projectController");

const {
  applyToProject,
  getProjectRequests,
} = require("../controllers/joinRequestController");

// Create project (protected)
router.post("/", authMiddleware, createProject);
router.get("/", authMiddleware, getAllProjects);

// Get projects owned by logged-in user
router.get("/my", authMiddleware, getMyProjects);

router.get("/:id", authMiddleware, getProjectById);


// Apply to project
router.post("/:projectId/join", authMiddleware, applyToProject);

// View project join requests (owner)
router.get("/:projectId/requests", authMiddleware, getProjectRequests);


router.put("/:id/status", authMiddleware, updateProjectStatus);

router.put("/:id", authMiddleware, updateProject)



module.exports = router;
