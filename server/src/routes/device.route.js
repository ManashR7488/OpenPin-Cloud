// routes/device.route.js

import express from "express";
import {
  listDevices,
  getDevice,
  createDevice,
  updateDevice,
  deleteDevice,
} from "../src/controllers/device.controller.js";
import { protect } from "../src/middlewares/auth.middleware.js";

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
