import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import errorHandler from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import urlRoutes from './routes/urlRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import { redirectUrl } from './controllers/urlController.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// =====================
// Security Middleware
// =====================
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// =====================
// Body Parsing
// =====================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// =====================
// Logging (development)
// =====================
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// =====================
// Rate Limiting
// =====================
app.use('/api', apiLimiter);

// =====================
// API Routes
// =====================
app.use('/api/auth', authRoutes);
app.use('/api/url', urlRoutes);
app.use('/api/analytics', analyticsRoutes);

// =====================
// Health Check
// =====================
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'URL Shortener API is running',
    timestamp: new Date().toISOString(),
  });
});

// =====================
// Short URL Redirect
// Must be AFTER API routes to avoid conflicts
// =====================
app.get('/:shortCode', redirectUrl);

// =====================
// Error Handler (must be last)
// =====================
app.use(errorHandler);

// =====================
// Start Server
// =====================
app.listen(PORT, () => {
  console.log(`
  🚀 Server running on port ${PORT}
  📡 Environment: ${process.env.NODE_ENV || 'development'}
  🔗 API: http://localhost:${PORT}/api
  💊 Health: http://localhost:${PORT}/api/health
  `);
});

export default app;
