import Device from "../models/Device.model.js";
import Project from "../models/Project.model.js";
import Feature from "../models/Feature.model.js";
import { myError } from "../utils/error.js";
import { generateSecret } from "../utils/generateSecret.js";



export const listDevices = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user._id;

    // 1. Verify project belongs to this user
    const project = await Project.findOne({ _id: projectId, owner: userId });
    if (!project) {
      return res
        .status(404)
        .json({ message: "Project not found or unauthorized." });
    }

    // 2. Fetch devices for the project and populate features
    const devices = await Device.find({ projectId })
      .populate("features") // <-- populate the features subdocuments
      .lean();

    // 3. Return list
    return res.status(200).json({
      message: "Devices fetched successfully.",
      devices,
    });
  } catch (err) {
    myError(err, "Error in listDevices controller");
    return res.status(500).json({ message: "Server error listing devices." });
  }
};

export const getDevice = async (req, res) => {
  try {
    const { projectId, id: deviceId } = req.params;
    const userId = req.user._id;

    // 1. Verify project belongs to this user
    const project = await Project.findOne({ _id: projectId, owner: userId });
    if (!project) {
      return res
        .status(404)
        .json({ message: "Project not found or unauthorized." });
    }

    // 2. Fetch device by ID & project, and populate features
    const device = await Device.findOne({ _id: deviceId, projectId })
      .populate("features")
      .lean();

    if (!device) {
      return res.status(404).json({ message: "Device not found." });
    }

    // 3. Return the device
    return res.status(200).json({
      message: "Device fetched successfully.",
      device,
    });
  } catch (err) {
    myError(err, "Error in getDevice controller");
    return res.status(500).json({ message: "Server error fetching device." });
  }
};

export const createDevice = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, deviceType, meta = {} } = req.body;
    const userId = req.user._id;

    // 1. Validate input
    if (!name || !deviceType) {
      return res.status(400).json({
        message: "Name and deviceType are required.",
      });
    }

    // 2. Verify project ownership
    const project = await Project.findOne({ _id: projectId, owner: userId });
    if (!project) {
      return res.status(404).json({
        message: "Project not found or unauthorized.",
      });
    }

    // 3. Generate a unique secret for this device
    let secret;
    do {
      secret = generateSecret(24);
    } while (await Device.exists({ secret }));

    // 4. Create the device with empty features and data
    const newDevice = await Device.create({
      name,
      deviceType,
      secret,
      projectId,
      meta,
    });

    // 5. (Optional) Link device to project's devices array
    project.devices.push(newDevice._id);
    await project.save();

    // 6. Populate features (currently empty) and return
    const device = await Device.findById(newDevice._id)
      .populate("features")
      .lean();

    return res.status(201).json({
      message: "Device created successfully.",
      device,
    });
  } catch (err) {
    myError(err, "Error in createDevice controller");
    return res.status(500).json({
      message: "Server error while creating device.",
    });
  }
};

export const updateDevice = async (req, res) => {
  try {
    const { projectId, id: deviceId } = req.params;
    const userId = req.user._id;
    const { name, deviceType, meta } = req.body;

    // 1. Verify project ownership
    const project = await Project.findOne({ _id: projectId, owner: userId });
    if (!project) {
      return res
        .status(404)
        .json({ message: "Project not found or unauthorized." });
    }

    // 2. Fetch the device and ensure it belongs to this project
    const device = await Device.findOne({ _id: deviceId, projectId });
    if (!device) {
      return res.status(404).json({ message: "Device not found." });
    }

    // 3. If renaming, ensure new name is unique within this project
    if (name !== undefined && name !== device.name) {
      const duplicate = await Device.exists({
        projectId,
        name,
        _id: { $ne: deviceId },
      });
      if (duplicate) {
        return res.status(400).json({
          message: "A device with this name already exists in the project.",
        });
      }
      device.name = name;
    }

    // 4. Update other allowed fields if provided
    if (deviceType !== undefined) {
      device.deviceType = deviceType;
    }
    if (meta !== undefined && typeof meta === "object") {
      device.meta = meta;
    }

    // 5. Save changes
    const updated = await device.save();

    // 6. Populate features and return
    const populated = await Device.findById(updated._id)
      .populate("features")
      .lean();

    return res.status(200).json({
      message: "Device updated successfully.",
      device: populated,
    });
  } catch (err) {
    myError(err, "Error in updateDevice controller");
    return res.status(500).json({
      message: "Server error while updating device.",
    });
  }
};

export const deleteDevice = async (req, res) => {
  try {
    const { projectId, id: deviceId } = req.params;
    const userId = req.user._id;

    // 1. Verify project ownership
    const project = await Project.findOne({ _id: projectId, owner: userId });
    if (!project) {
      return res
        .status(404)
        .json({ message: "Project not found or unauthorized." });
    }

    // 2. Fetch the device and ensure it belongs to this project
    const device = await Device.findOne({ _id: deviceId, projectId });
    if (!device) {
      return res.status(404).json({ message: "Device not found." });
    }

    // 3. delete associated features
    if (device.features && device.features.length) {
      await Feature.deleteMany({ _id: { $in: device.features } });
    }

    // 4. Remove the device document
    await Device.deleteOne({ _id: deviceId });

    // 5. Remove reference from project.devices array
    await Project.findByIdAndUpdate(projectId, {
      $pull: { devices: deviceId },
    });

    return res.status(200).json({
      message: "Device deleted successfully.",
    });
  } catch (err) {
    myError(err, "Error in deleteDevice controller");
    return res.status(500).json({
      message: "Server error while deleting device.",
    });
  }
};
