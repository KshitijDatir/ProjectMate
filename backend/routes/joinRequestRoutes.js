const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const {
  getMyRequests,
  decideRequest,
} = require("../controllers/joinRequestController");

// My join requests
router.get("/my", authMiddleware, getMyRequests);

// Accept / reject request
router.put("/:requestId/decision", authMiddleware, decideRequest);

module.exports = router;
