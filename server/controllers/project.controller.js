import Project from "../Models/Project.model.js";
import Device from "../Models/Device.model.js";
import User from "../models/User.model.js";
import { myError } from "../utils/error.js";

export const getProject = async (req, res) => {
  try {
    const userId = req.user._id;
    const projectId = req.params.id;

    const project = await Project.findOne({ _id: projectId, owner: userId })
      .populate("devices")
      .lean();

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    return res.status(200).json({
      message: "Project fetched successfully",
      project,
    });
  } catch (err) {
    myError(err, "Error in getProject controller");
    return res.status(500).json({ message: "Server error fetching project." });
  }
};

export const listProjects = async (req, res) => {
  try {
    const userId = req.user._id;

    const projects = await Project.find({ owner: userId })
      .populate("devices") // Assumes you've added `devices: [{ type: ObjectId, ref: 'Device' }]` to Project schema
      .lean(); // Return plain JS objects

    return res.status(200).json({
      message: "Projects fetched successfully",
      projects,
    });
  } catch (err) {
    myError(err, "Error in listProjects controller");
    return res.status(500).json({ message: "Server error fetching projects." });
  }
};

export const createProject = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, description } = req.body;

    // 1. Validate input
    if (!name) {
      return res.status(400).json({ message: "Project name is required." });
    }

    // 2. Validate unique project name for this user
    const duplicate = await Project.exists({ name, owner: userId });
    if (duplicate) {
      return res
        .status(400)
        .json({ message: "You already have a project with this name." });
    }

    // 3. Create the project
    const newProject = await Project.create({
      name,
      description: description || "",
      owner: userId,
      devices: [],
    });

    // 4. Link project to user
    await User.findByIdAndUpdate(
      { _id: userId },
      { $push: { projects: newProject._id } }, // assumes User.schema has `projects: [{ type: ObjectId, ref: 'Project' }]`
      { new: true }
    );

    // 5. Populate devices (empty array) and return
    const project = await Project.findById(newProject._id)
      .populate("devices")
      .lean();

    return res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (err) {
    myError(err, "Error in createProject controller");
    return res.status(500).json({ message: "Server error creating project." });
  }
};

export const updateProject = async (req, res) => {
  try {
    const userId = req.user._id;
    const projectId = req.params.id;
    const { name, description } = req.body;

    // 1. Fetch the project and ensure ownership
    const project = await Project.findOne({ _id: projectId, owner: userId });
    if (!project) {
      return res
        .status(404)
        .json({ message: "Project not found or unauthorized." });
    }

    // 2. If name is changing, ensure uniqueness for this user
    if (name && name !== project.name) {
      const exists = await Project.exists({ name, owner: userId });
      if (exists) {
        return res
          .status(400)
          .json({ message: "You already have a project with this name." });
      }
      project.name = name;
    }

    // 3. Update other allowed fields
    if (description !== undefined) {
      project.description = description;
    }

    // 4. Save and return the updated project (with devices populated)
    const updated = await project.save();
    const populated = await Project.findById(updated._id)
      .populate("devices")
      .lean();

    return res.status(200).json({
      message: "Project updated successfully",
      project: populated,
    });
  } catch (err) {
    myError(err, "Error in updateProject controller");
    return res.status(500).json({ message: "Server error updating project." });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const userId = req.user._id;
    const projectId = req.params.id;

    // 1. Verify project exists and belongs to user
    const project = await Project.findOne({ _id: projectId, owner: userId });
    if (!project) {
      return res
        .status(404)
        .json({ message: "Project not found or unauthorized." });
    }

    // 2. Delete all devices under this project
    await Device.deleteMany({ projectId });

    // 3. Remove the project document
    await Project.deleteOne({ _id: projectId });

    // 4. Pull the projectId from the user's projects array
    await User.findByIdAndUpdate(
      { _id: userId },
      {
        $pull: { projects: projectId },
      }
    );

    return res
      .status(200)
      .json({ message: "Project and its devices have been deleted." });
  } catch (err) {
    myError(err, "Error in deleteProject controller");
    return res.status(500).json({ message: "Server error deleting project." });
  }
};
