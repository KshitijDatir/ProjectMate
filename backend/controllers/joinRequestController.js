const JoinRequest = require("../models/JoinRequest");
const Project = require("../models/Project");

/**
 * Apply to join a project
 * POST /api/projects/:projectId/join
 */
exports.applyToProject = async (req, res) => {
  try {
    const { sop } = req.body;
    const { projectId } = req.params;

    if (!sop) {
      return res.status(400).json({ message: "SOP is required" });
    }

    const project = await Project.findById(projectId);
    if (!project || project.status === "CLOSED") {
      return res.status(404).json({ message: "Project not available" });
    }

    const existingRequest = await JoinRequest.findOne({
      project: projectId,
      applicant: req.user._id,
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Already applied" });
    }

    const joinRequest = await JoinRequest.create({
      project: projectId,
      applicant: req.user._id,
      sop,
      applicantSnapshot: {
        name: req.user.name,
        email: req.user.email,
        college: req.user.college,
        branch: req.user.branch,
        year: req.user.year,
        skills: req.user.skills,
        resumeUrl: req.user.resumeUrl,
      },
    });

    res.status(201).json({
      success: true,
      request: joinRequest,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get my join requests
 * GET /api/requests/my
 */
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await JoinRequest.find({
      applicant: req.user._id,
    }).populate("project", "title status");

    res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get join requests for a project (owner)
 * GET /api/projects/:projectId/requests
 */
exports.getProjectRequests = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project || project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const requests = await JoinRequest.find({
      project: project._id,
    }).populate("applicant", "name email skills");

    res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Accept / Reject join request
 * PUT /api/requests/:requestId/decision
 */
exports.decideRequest = async (req, res) => {
  try {
    const { decision } = req.body;

    if (!["ACCEPTED", "REJECTED"].includes(decision)) {
      return res.status(400).json({ message: "Invalid decision" });
    }

    const request = await JoinRequest.findById(req.params.requestId).populate(
      "project"
    );

    if (
      !request ||
      request.project.owner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    request.status = decision;
    request.decisionAt = new Date();
    await request.save();

    if (decision === "ACCEPTED") {
      request.project.currentTeamSize += 1;

      if (request.project.currentTeamSize >= request.project.teamSize) {
        request.project.status = "CLOSED";
      }

      await request.project.save();
    }

    res.status(200).json({
      success: true,
      request,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
