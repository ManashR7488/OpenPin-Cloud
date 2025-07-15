import express from "express";
import {
  createProject,
  deleteProject,
  getProject,
  listProjects,
  updateProject,
} from "../controllers/project.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Get all projects for the authenticated user
// GET /api/projects
router.get("/", protect, listProjects);

// Get one project by project id for the authenticated user
// GET /api/projects/:id
router.get("/:id", protect, getProject);

// Create a new project
// POST /api/projects/createProject
router.post("/create", protect, createProject);

// Update an existing project
// PATCH /api/projects/:id
router.patch("/:id", protect, updateProject);

// Delete a project
// DELETE /api/projects/:id
router.delete("/:id", protect, deleteProject);

export default router;
