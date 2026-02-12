const Project = require("../models/Project");
const JoinRequest = require("../models/JoinRequest");

/**
 * @desc    Create a new project
 * @route   POST /api/projects
 * @access  Private
 */
exports.createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      details,
      requiredSkills,
      teamSize,
    } = req.body;

    if (!title || !description || !teamSize) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const project = await Project.create({
      title,
      description,
      details,
      requiredSkills,
      teamSize,
      owner: req.user._id,
    });

    res.status(201).json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Get all open projects
 * @route   GET /api/projects
 * @access  Public
 */
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      status: "OPEN",
      owner: { $ne: req.user._id },
    })
      .populate("owner", "name email skills")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * @desc    Get single project by ID
 * @route   GET /api/projects/:id
 * @access  Public
 */
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email skills");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * @desc    Get projects owned by logged-in user
 * @route   GET /api/projects/my
 * @access  Private
 */
exports.getMyProjects = async (req, res) => {
  try {
    // Fetch projects owned by user
    const projects = await Project.find({ owner: req.user._id })
      .select("title teamSize currentTeamSize status")
      .sort({ createdAt: -1 });

    // Attach request count for each project
    const projectsWithCounts = await Promise.all(
      projects.map(async (project) => {
        const requestCount = await JoinRequest.countDocuments({
          project: project._id,
          status: "PENDING",
        });

        return {
          _id: project._id,
          title: project.title,
          teamSize: project.teamSize,
          currentTeamSize: project.currentTeamSize,
          status: project.status,
          requestCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      projects: projectsWithCounts,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
