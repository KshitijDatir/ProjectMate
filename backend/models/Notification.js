const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      required: true,
      enum: [
        "NEW_APPLICATION",
        "REQUEST_DECISION",
        "PROJECT_UPDATE",
        "FOLLOW_ACTIVITY",
      ],
    },

    message: {
      type: String,
      required: true,
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    entityType: {
      type: String,
      enum: ["PROJECT", "REQUEST", "USER"],
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);