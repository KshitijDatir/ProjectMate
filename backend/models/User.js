const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    contact: { type: String },

    year: { type: String },
    branch: { type: String },
    college: { type: String },

    skills: [{ type: String }],

    resumeUrl: { type: String },

    password: { type: String }, // null for Google users later
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
