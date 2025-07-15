// routes/device.route.js

import express from "express";

import {
  createDevice,
  deleteDevice,
  getDevice,
  listDevices,
  updateDevice,
} from "./../controllers/device.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router({ mergeParams: true });
// mergeParams allows access to :projectId from the parent route

// GET    /api/projects/:projectId/devices
router.get("/", protect, listDevices);

// GET    /api/projects/:projectId/devices/:id
router.get("/:id", protect, getDevice);

// POST   /api/projects/:projectId/devices/create
router.post("/create", protect, createDevice);

// PATCH  /api/projects/:projectId/devices/:id
router.patch("/:id", protect, updateDevice);

// DELETE /api/projects/:projectId/devices/:id
router.delete("/:id", protect, deleteDevice);

export default router;
