import express from 'express';
import {
  getDashboardStats,
  getUrlAnalytics,
} from '../controllers/analyticsController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.get('/dashboard', protect, getDashboardStats);
router.get('/url/:id', protect, getUrlAnalytics);

export default router;
