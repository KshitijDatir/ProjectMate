const mongoose = require("mongoose");
const JoinRequest = require("../models/JoinRequest");
const Project = require("../models/Project");
const Notification = require("../models/Notification");
const { getIO } = require("../socket");

/**
 * Apply to join a project
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

    if (project.owner.equals(req.user._id)) {
      return res.status(403).json({
        message: "You cannot apply to your own project",
      });
    }

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

    // ✅ Save persistent notification
    const notification = await Notification.create({
      recipient: project.owner,
      type: "NEW_APPLICATION",
      message: `${req.user.name} applied to your project "${project.title}"`,
      entityId: joinRequest._id,
      entityType: "REQUEST",
    });

    // ✅ Emit real-time
    const io = getIO();
    io.to(`user:${project.owner.toString()}`).emit(
      "notification",
      notification
    );

    return res.status(201).json({
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
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get my join requests
 */
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await JoinRequest.find({
      applicant: req.user._id,
    }).populate("project", "title status");

    return res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get join requests for a project (owner)
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

    return res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Accept / Reject join request
 */
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

    // ✅ Save persistent notification
    const notification = await Notification.create({
      recipient: request.applicant,
      type: "REQUEST_DECISION",
      message: `Your request for "${request.project.title}" was ${decision}`,
      entityId: request._id,
      entityType: "REQUEST",
    });

    // ✅ Emit real-time
    const io = getIO();
    io.to(`user:${request.applicant.toString()}`).emit(
      "notification",
      notification
    );

    return res.status(200).json({
      success: true,
      request,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get single request (owner view)
 */
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

    const isOwner =
      request.project.owner.toString() === req.user._id.toString();

    const isApplicant =
      request.applicant._id.toString() === req.user._id.toString();

    if (!isOwner && !isApplicant) {
      return res.status(403).json({ message: "Not authorized" });
    }

    return res.status(200).json({
      success: true,
      request,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
/**
 * Edit SOP (Applicant Only)
 */
exports.editRequest = async (req, res) => {
  try {
    const { sop, __v } = req.body;
    const { requestId } = req.params;

    if (!sop || typeof __v !== "number") {
      return res.status(400).json({
        message: "SOP and version (__v) are required",
      });
    }

    const existingRequest = await JoinRequest.findById(requestId);

    if (!existingRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (!existingRequest.applicant.equals(req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (existingRequest.status !== "PENDING") {
      return res.status(400).json({
        message: "Cannot edit a decided request",
      });
    }

    const project = await Project.findOne({
      _id: existingRequest.project,
      isDeleted: false,
    });

    if (!project || project.status !== "OPEN") {
      return res.status(400).json({
        message: "Project is closed",
      });
    }

    const updatedRequest = await JoinRequest.findOneAndUpdate(
      {
        _id: requestId,
        applicant: req.user._id,
        status: "PENDING",
        __v: __v,
      },
      {
        $set: { sop },
        $inc: { __v: 1 },
      },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(409).json({
        message: "Request was modified or decided. Please refresh.",
      });
    }

    return res.status(200).json({
      success: true,
      request: updatedRequest,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};