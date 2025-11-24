import express from 'express';
import { getAllSeoMetadatas, getSeoMetadataById, createSeoMetadata, updateSeoMetadata, deleteSeoMetadata } from '../controllers/seoMetadataController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllSeoMetadatas);
router.get('/:id', getSeoMetadataById);


// Protected routes
router.post('/', authenticate, authorize('admin'), createSeoMetadata);
router.put('/:id', authenticate, authorize('admin'), updateSeoMetadata);
router.delete('/:id', authenticate, authorize('admin'), deleteSeoMetadata);

export default router;
