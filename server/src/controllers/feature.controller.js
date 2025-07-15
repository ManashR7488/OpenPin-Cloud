import Device from "../models/Device.model.js";
import Feature from "../models/Feature.model.js";
import Project from "../models/Project.model.js";
import { myError } from "../utils/error.js";

export const listFeatures = async (req, res) => {
  try {
    const { projectId, deviceId } = req.params;
    const userId = req.user._id;

    // 1. Verify project ownership
    const project = await Project.findOne({ _id: projectId, owner: userId });
    if (!project) {
      return res.status(404).json({
        message: "Project not found or unauthorized.",
      });
    }

    // 2. Verify device belongs to this project
    const device = await Device.findOne({ _id: deviceId, projectId });
    if (!device) {
      return res.status(404).json({
        message: "Device not found.",
      });
    }

    // 3. Populate or fetch the features
    // Assuming `features` is an array of ObjectId refs on Device:
    const features = await Feature.find({
      _id: { $in: device.features },
    }).lean();

    // 4. Return the list
    return res.status(200).json({
      message: "Features fetched successfully.",
      features,
    });
  } catch (err) {
    myError(err, "Error in listFeatures controller");
    return res.status(500).json({
      message: "Server error listing features.",
    });
  }
};

export const getFeature = async (req, res) => {
  try {
    const { projectId, deviceId, id: featureId } = req.params;
    const userId = req.user._id;

    // 1. Verify project ownership
    const project = await Project.findOne({ _id: projectId, owner: userId });
    if (!project) {
      return res.status(404).json({
        message: "Project not found or unauthorized.",
      });
    }

    // 2. Verify device belongs to this project
    const device = await Device.findOne({ _id: deviceId, projectId });
    if (!device) {
      return res.status(404).json({
        message: "Device not found.",
      });
    }

    // 3. Ensure this featureId is associated with the device
    if (!device.features.includes(featureId)) {
      return res.status(404).json({
        message: `Feature "${featureId}" not found on this device.`,
      });
    }

    // 4. Fetch the feature document
    const feature = await Feature.findById(featureId).lean();
    if (!feature) {
      return res.status(404).json({
        message: "Feature not found.",
      });
    }

    // 5. Return the feature
    return res.status(200).json({
      message: "Feature fetched successfully.",
      feature,
    });
  } catch (err) {
    myError(err, "Error in getFeature controller");
    return res.status(500).json({
      message: "Server error fetching feature.",
    });
  }
};

export const createFeature = async (req, res) => {
  try {
    const { projectId, deviceId } = req.params;
    const userId = req.user._id;
    const { key, name, type, unit = "", pin = null } = req.body;

    // 1. Validate required fields
    if (!key || !name || !type) {
      return res.status(400).json({
        message: "key, name and type are required to create a feature.",
      });
    }

    // 2. Verify project ownership
    const project = await Project.findOne({ _id: projectId, owner: userId });
    if (!project) {
      return res
        .status(404)
        .json({ message: "Project not found or unauthorized." });
    }

    // 3. Verify device belongs to this project
    const device = await Device.findOne({ _id: deviceId, projectId });
    if (!device) {
      return res.status(404).json({ message: "Device not found." });
    }

    // 4. Prevent duplicate feature keys within this device
    const existingFeature = await Feature.findOne({ deviceId, key });
    if (existingFeature) {
      return res.status(400).json({
        message: `A feature with key '${key}' already exists on this device.`,
      });
    }

    // 5. Create the new feature with value=null
    const newFeature = await Feature.create({
      key,
      name,
      deviceId,
      type,
      value: null,
      unit,
      pin,
      meta,
    });

    // 6. Link it into the device
    device.features.push(newFeature._id);
    await device.save();

    // 7. Return the newly created feature
    return res.status(201).json({
      message: "Feature created successfully.",
      feature: newFeature.toObject(),
    });
  } catch (err) {
    myError(err, "Error in createFeature controller");
    return res.status(500).json({
      message: "Server error while creating feature.",
    });
  }
};

export const updateFeature = async (req, res) => {
  try {
    const { projectId, deviceId, id: featureId } = req.params;
    const userId = req.user._id;
    const { key, name, type, unit, pin } = req.body;

    // 1. Validate presence of some update fields
    if (!key && !name && !type && !unit && !pin) {
      return res.status(400).json({
        message:
          "At least one field (key, name, type, unit, pin) must be provided for update.",
      });
    }

    // 2. Verify project ownership
    const project = await Project.findOne({ _id: projectId, owner: userId });
    if (!project) {
      return res
        .status(404)
        .json({ message: "Project not found or unauthorized." });
    }

    // 3. Verify device belongs to the project
    const device = await Device.findOne({ _id: deviceId, projectId });
    if (!device) {
      return res.status(404).json({ message: "Device not found." });
    }

    const existFeature = await Feature.findOne({
      key,
      name,
      type,
      deviceId,
      _id: featureId,
    });
    if (existFeature) {
      return res.status(400).json({
        message:
          "At least one field (key, name, type) must be diffrent for update.",
      });
    }

    // 4. Get the feature and validate ownership
    const feature = await Feature.findOne({ _id: featureId, deviceId });
    if (!feature) {
      return res.status(404).json({ message: "Feature not found." });
    }

    // 5. If key is being updated, ensure it's unique within the device
    if (key && key !== feature.key) {
      const keyExists = await Feature.findOne({ deviceId, key });
      if (keyExists) {
        return res.status(400).json({
          message: `Feature with key "${key}" already exists on this device.`,
        });
      }
      feature.key = key;
    }

    // 6. Update other fields if present
    if (name) feature.name = name;
    if (type) feature.type = type;
    if (unit !== undefined) feature.unit = unit;
    if (pin !== undefined) feature.pin = pin;

    // 7. Save and return updated feature
    await feature.save();

    return res.status(200).json({
      message: "Feature updated successfully.",
      feature: feature.toObject(),
    });
  } catch (err) {
    myError(err, "Error in updateFeature controller");
    return res
      .status(500)
      .json({ message: "Server error while updating feature." });
  }
};

export const deleteFeature = async (req, res) => {
  try {
    const { projectId, deviceId, id: featureId } = req.params;
    const userId = req.user._id;

    // 1. Verify project ownership
    const project = await Project.findOne({ _id: projectId, owner: userId });
    if (!project) {
      return res
        .status(404)
        .json({ message: "Project not found or unauthorized." });
    }

    // 2. Verify device exists and belongs to the project
    const device = await Device.findOne({ _id: deviceId, projectId });
    if (!device) {
      return res.status(404).json({ message: "Device not found." });
    }

    // 3. Verify feature exists and belongs to the device
    const feature = await Feature.findOne({ _id: featureId, deviceId });
    if (!feature) {
      return res.status(404).json({ message: "Feature not found." });
    }

    // 4. Remove the feature from the device's features array
    device.features.pull(featureId);

    // 5. Remove the feature's key from the device's data object if exists
    if (device.data && feature.key in device.data) {
      delete device.data[feature.key];
    }

    await device.save();

    // 6. Delete the feature from the DB
    await Feature.deleteOne({ _id: featureId });

    return res.status(200).json({
      message: "Feature deleted successfully.",
    });
  } catch (err) {
    myError(err, "Error in deleteFeature controller");
    return res.status(500).json({
      message: "Server error while deleting feature.",
    });
  }
};
