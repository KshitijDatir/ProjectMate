const Project = require("../models/Project");
const JoinRequest = require("../models/JoinRequest");

/**
 * Create Project
 */
exports.createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      details,
      requiredSkills,
      teamSize,
    } = req.body

    if (!title || !description || !teamSize) {
      return res.status(400).json({ message: "Required fields missing" })
    }

    const numericTeamSize = Number(teamSize)

    if (isNaN(numericTeamSize) || numericTeamSize < 1) {
      return res.status(400).json({ message: "Invalid team size" })
    }

    const project = await Project.create({
      title,
      description,
      details,
      requiredSkills,
      teamSize: numericTeamSize,
      owner: req.user._id,
      members: [req.user._id],
      status: numericTeamSize === 1 ? "CLOSED" : "OPEN",
    })

    res.status(201).json({
      success: true,
      project,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}


/**
 * Get All Open Projects
 */
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      status: "OPEN",
      isDeleted: false,
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
 * Get Single Project By ID
 */
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      isDeleted: false,
    })
      .populate("owner", "name email skills")
      .populate("members", "name email skills");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({
      success: true,
      project,
      currentTeamSize: project.members.length, // derived
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get My Projects
 */
exports.getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      owner: req.user._id,
      isDeleted: false,
    }).sort({ createdAt: -1 });

    const projectsWithCounts = await Promise.all(
      projects.map(async (project) => {
        const requestCount = await JoinRequest.countDocuments({
          project: project._id,
          status: "PENDING",
        });

        return {
          ...project.toObject(),
          currentTeamSize: project.members.length,
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
/**
 * Manually close or reopen project
 * PUT /api/projects/:id/status
 */
exports.updateProjectStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["OPEN", "CLOSED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id,
      isDeleted: false,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.status = status;
    await project.save();

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id,
      isDeleted: false,
    })

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    const { title, description, details, requiredSkills, teamSize } = req.body

    // 🔒 Logical constraint (industry required)
    if (teamSize !== undefined) {
      if (teamSize < project.members.length) {
        return res.status(400).json({
          message:
            "Team size cannot be smaller than current number of members",
        })
      }

      project.teamSize = teamSize
      if (project.members.length >= project.teamSize) {
        project.status = "CLOSED";
      } else {
        project.status = "OPEN";
      }
    }

    if (title !== undefined) project.title = title
    if (description !== undefined) project.description = description
    if (details !== undefined) project.details = details
    if (requiredSkills !== undefined)
      project.requiredSkills = requiredSkills

    await project.save() // 🔥 OCC applies here

    res.status(200).json({
      success: true,
      project,
    })
  } catch (error) {
    if (error.name === "VersionError") {
      return res.status(409).json({
        message:
          "This project was modified by someone else. Please refresh and try again.",
      })
    }

    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

