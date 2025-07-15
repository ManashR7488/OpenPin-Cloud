import express from 'express';
import {
  listFeatures,
  getFeature,
  createFeature,
  updateFeature,
  deleteFeature,
} from '../src/controllers/feature.controller.js';
import { protect } from '../src/middlewares/auth.middleware.js';

const router = express.Router({ mergeParams: true });

// GET    /api/projects/:projectId/devices/:deviceId/features
router.get('/', protect, listFeatures);

// GET    /api/projects/:projectId/devices/:deviceId/features/:id
router.get('/:id', protect, getFeature);

// POST   /api/projects/:projectId/devices/:deviceId/features/create
router.post('/create', protect, createFeature);

// PATCH  /api/projects/:projectId/devices/:deviceId/features/:id
router.patch('/:id', protect, updateFeature);

// DELETE /api/projects/:projectId/devices/:deviceId/features/:id
router.delete('/:id', protect, deleteFeature);

export default router;
