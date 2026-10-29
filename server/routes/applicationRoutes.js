import express from 'express';
import {
  applyToJob,
  getMyApplications,
  getEmployerApplications,
  getAllApplications,
  updateApplicationStatus,
} from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, authorize('admin'), getAllApplications);
router.get('/employer', protect, authorize('employer', 'admin'), getEmployerApplications);
router.get('/my', protect, authorize('student'), getMyApplications);
router.post('/', protect, authorize('student'), applyToJob);
router.put('/:id/status', protect, authorize('employer', 'admin'), updateApplicationStatus);

export default router;
