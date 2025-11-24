import express from 'express';
import { getAllMenuItems, getMenuItemById, createMenuItem, updateMenuItem, deleteMenuItem } from '../controllers/menuItemController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllMenuItems);
router.get('/:id', getMenuItemById);


// Protected routes
router.post('/', authenticate, authorize('admin'), createMenuItem);
router.put('/:id', authenticate, authorize('admin'), updateMenuItem);
router.delete('/:id', authenticate, authorize('admin'), deleteMenuItem);

export default router;
