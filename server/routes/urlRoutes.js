import express from 'express';
import {
  createUrl,
  getAllUrls,
  getUrlById,
  updateUrl,
  deleteUrl,
} from '../controllers/urlController.js';
import protect from '../middleware/auth.js';
import { createUrlLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// All routes are protected
router.post('/create', protect, createUrlLimiter, createUrl);
router.get('/all', protect, getAllUrls);
router.get('/:id', protect, getUrlById);
router.put('/:id', protect, updateUrl);
router.delete('/:id', protect, deleteUrl);

export default router;
