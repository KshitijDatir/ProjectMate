const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notificationController");

// Get all notifications
router.get("/", authMiddleware, getNotifications);

// Mark single notification as read
router.patch("/:id/read", authMiddleware, markAsRead);

// Mark all as read
router.patch("/read-all", authMiddleware, markAllAsRead);

module.exports = router;