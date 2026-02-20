const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const {
  getMyRequests,
  decideRequest,
  getSingleRequest,
  editRequest,   // ✅ ADDED
} = require("../controllers/joinRequestController");

// My join requests
router.get("/my", authMiddleware, getMyRequests);

// Get single application
router.get("/:id", authMiddleware, getSingleRequest);

// Accept / reject request
router.put("/:requestId/decision", authMiddleware, decideRequest);

// Edit request (Applicant only, PENDING only)
router.put("/:requestId", authMiddleware, editRequest);

module.exports = router;
