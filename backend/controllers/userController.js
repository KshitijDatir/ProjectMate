const User = require("../models/User");

/**
 * @desc    Get logged-in user profile
 * @route   GET /api/users/me
 * @access  Private
 */
exports.getMyProfile = async (req, res) => {
  try {
    // req.user is already attached by auth middleware
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Update logged-in user profile
 * @route   PUT /api/users/me
 * @access  Private
 */
exports.updateMyProfile = async (req, res) => {
  try {
    const allowedFields = [
      "year",
      "branch",
      "college",
      "skills",
      "resumeUrl",
      "contact",
    ];

    // Only update allowed fields
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        req.user[field] = req.body[field];
      }
    });

    const updatedUser = await req.user.save();

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
