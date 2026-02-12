const Internship = require("../models/Internship");

/**
 * @desc    Create internship post
 * @route   POST /api/internships
 * @access  Private
 */
exports.createInternship = async (req, res) => {
  try {
    const {
      title,
      companyName,
      role,
      description,
      applicationLink,
      deadline,
    } = req.body;

    if (!title || !companyName || !role || !applicationLink || !deadline) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const internship = await Internship.create({
      title,
      companyName,
      role,
      description,
      applicationLink,
      deadline,
      postedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      internship,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Get all internships
 * @route   GET /api/internships
 * @access  Public
 */
exports.getAllInternships = async (req, res) => {
  try {
    const internships = await Internship.find()
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      internships,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
/**
 * @desc    Get single internship by ID
 * @route   GET /api/internships/:id
 * @access  Public
 */
exports.getInternshipById = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id)
      .populate("postedBy", "name email");

    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }

    res.status(200).json({
      success: true,
      internship,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
