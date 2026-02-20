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

    status: {
      type: String,
      enum: ["OPEN", "CLOSED"],
      default: "OPEN",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true,
    optimisticConcurrency: true,
   }
);

module.exports = mongoose.model("Project", projectSchema);
