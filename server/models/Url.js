import mongoose from 'mongoose';

/**
 * URL Schema
 * Stores shortened URL data with analytics tracking
 */
const urlSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    originalUrl: {
      type: String,
      required: [true, 'Original URL is required'],
      trim: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customAlias: {
      type: String,
      trim: true,
      sparse: true, // Allow multiple null values while maintaining uniqueness
      unique: true,
      index: true,
    },
    qrCode: {
      type: String, // Base64 encoded QR code image
    },
    totalClicks: {
      type: Number,
      default: 0,
    },
    lastClicked: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Virtual to generate the full short URL
 */
urlSchema.virtual('shortUrl').get(function () {
  const base = process.env.BASE_URL || 'http://localhost:5000';
  return `${base}/${this.customAlias || this.shortCode}`;
});

// Ensure virtuals are included in JSON output
urlSchema.set('toJSON', { virtuals: true });
urlSchema.set('toObject', { virtuals: true });

const Url = mongoose.model('Url', urlSchema);

export default Url;
