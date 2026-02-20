const mongoose = require("mongoose");

const joinRequestSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sop: {
      type: String,
      required: true,
      trim: true,
    },

    applicantSnapshot: {
      name: String,
      email: String,
      college: String,
      branch: String,
      year: String,
      skills: [String],
      resumeUrl: String,
    },

    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED"],
      default: "PENDING",
    },

    decisionAt: {
      type: Date,
    },

    decisionMessage: {
      type: String,
    },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,   // ✅ ADDED
  }
);

/**
 * 🔒 Prevent duplicate applications
 */
joinRequestSchema.index(
  { project: 1, applicant: 1 },
  { unique: true }
);

module.exports = mongoose.model("JoinRequest", joinRequestSchema);
