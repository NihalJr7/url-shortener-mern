import mongoose from 'mongoose';

/**
 * Click Schema
 * Tracks individual click events for granular analytics
 */
const clickSchema = new mongoose.Schema({
  urlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Url',
    required: [true, 'URL ID is required'],
    index: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
  ipAddress: {
    type: String,
    default: 'unknown',
  },
  device: {
    type: String,
    default: 'unknown',
  },
  browser: {
    type: String,
    default: 'unknown',
  },
  referrer: {
    type: String,
    default: 'direct',
  },
});

// Compound index for efficient analytics queries
clickSchema.index({ urlId: 1, timestamp: -1 });

const Click = mongoose.model('Click', clickSchema);

export default Click;
