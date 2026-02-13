const User = require("../models/User");
const Project = require("../models/Project");

/**
 * @desc    Get logged-in user profile + stats
 * @route   GET /api/users/me
 * @access  Private
 */
exports.getMyProfile = async (req, res) => {
  try {
    const user = req.user;

    // 🔹 Stats
    const managedProjects = await Project.countDocuments({
      owner: user._id,
    });

    const contributedProjects = await Project.countDocuments({
      members: user._id,
      owner: { $ne: user._id },
    });

    res.status(200).json({
      success: true,
      user,
      stats: {
        managedProjects,
        contributedProjects,
      },
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

/**
 * @desc    Get public user profile
 * @route   GET /api/users/:id
 * @access  Private (for now, requires auth)
 */
exports.getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "name college branch year skills resumeUrl"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

