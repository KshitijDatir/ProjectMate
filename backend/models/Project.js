const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    details: {
      type: String,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    requiredSkills: [
      {
        type: String,
      },
    ],

    teamSize: {
      type: Number,
      required: true,
      min: 1,
    },

    currentTeamSize: {
      type: Number,
      default: 1, // owner is first member
    },

    status: {
      type: String,
      enum: ["OPEN", "CLOSED"],
      default: "OPEN",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
