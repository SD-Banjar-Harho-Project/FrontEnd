import express from 'express';
import { getSchoolProfile, updateSchoolProfile } from '../controllers/schoolProfileController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route
router.get('/', getSchoolProfile);

// Admin only route
router.put('/', authenticate, authorize('admin', 'super_admin'), updateSchoolProfile);

export default router;
