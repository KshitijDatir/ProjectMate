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

    const project = await Project.findOne({
      _id: projectId,
      isDeleted: false,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not available" });
    }

    if (project.status === "CLOSED") {
      return res.status(400).json({ message: "Project is closed" });
    }

    // 🔒 Prevent owner applying
    if (project.owner.equals(req.user._id)) {
      return res.status(403).json({
        message: "You cannot apply to your own project",
      });
    }

    // 🚫 Prevent applying if full
    if (project.members.length >= project.teamSize) {
      return res.status(400).json({
        message: "Project is already full",
      });
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
    if (error.code === 11000) {
      return res.status(400).json({
        message: "You have already applied to this project",
      });
    }

    console.error(error);
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
    const project = await Project.findOne({
  _id: req.params.projectId,
  isDeleted: false,
});

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
const mongoose = require("mongoose");

exports.decideRequest = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { decision, message } = req.body;

    if (!["ACCEPTED", "REJECTED"].includes(decision)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Invalid decision" });
    }

    const request = await JoinRequest.findById(req.params.requestId)
      .populate("project")
      .session(session);

    if (
      !request ||
      request.project.owner.toString() !== req.user._id.toString()
    ) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ message: "Not authorized" });
    }

    if (request.status !== "PENDING") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: "Request has already been decided",
      });
    }

    if (decision === "ACCEPTED") {
      const updatedProject = await Project.findOneAndUpdate(
        {
          _id: request.project._id,
          status: "OPEN",
          isDeleted: false,
          $expr: { $lt: [{ $size: "$members" }, "$teamSize"] },
        },
        {
          $addToSet: { members: request.applicant },
        },
        { new: true, session }
      );

      if (!updatedProject) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          message: "Project is already full or closed",
        });
      }

      if (updatedProject.members.length >= updatedProject.teamSize) {
        updatedProject.status = "CLOSED";
        await updatedProject.save({ session });
      }
    }

    if (decision === "REJECTED") {
      if (!message || message.trim() === "") {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          message: "Rejection message is required",
        });
      }
      request.decisionMessage = message;
    }

    request.status = decision;
    request.decisionAt = new Date();
    await request.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      request,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * GET /api/requests/:id
 */
exports.getSingleRequest = async (req, res) => {
  try {
    const request = await JoinRequest.findById(req.params.id)
      .populate("project")
      .populate("applicant", "-password");

    if (!request || request.project.isDeleted) {
  return res.status(404).json({ message: "Application not found" });
}


    if (
      request.project.owner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.status(200).json({
      success: true,
      request,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

