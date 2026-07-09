import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  logout,
} from '../controllers/authController.js';
import protect from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public routes (with rate limiting)
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/update', protect, updateProfile);
router.post('/logout', protect, logout);

export default router;
