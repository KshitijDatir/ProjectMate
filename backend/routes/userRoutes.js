const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const {
  getMyProfile,
  updateMyProfile,
  getPublicProfile,
} = require("../controllers/userController");

// GET profile
router.get("/me", authMiddleware, getMyProfile);

// UPDATE profile
router.put("/me", authMiddleware, updateMyProfile);

// Public profile
router.get("/:id", getPublicProfile);


module.exports = router;
