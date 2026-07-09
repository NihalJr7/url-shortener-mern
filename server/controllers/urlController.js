import { nanoid } from 'nanoid';
import QRCode from 'qrcode';
import validator from 'validator';
import Url from '../models/Url.js';
import Click from '../models/Click.js';
import { parseUserAgent, getClientIp } from '../utils/helpers.js';

/**
 * @desc    Create a new short URL
 * @route   POST /api/url/create
 * @access  Private
 */
export const createUrl = async (req, res, next) => {
  try {
    const { originalUrl, customAlias } = req.body;

    // Validate original URL
    if (!originalUrl) {
      res.statusCode = 400;
      throw new Error('Please provide a URL to shorten');
    }

    if (
      !validator.isURL(originalUrl, {
        require_protocol: true,
        protocols: ['http', 'https'],
      })
    ) {
      res.statusCode = 400;
      throw new Error(
        'Please provide a valid URL (must include http:// or https://)'
      );
    }

    // Handle custom alias
    let shortCode;
    if (customAlias) {
      // Validate alias format (alphanumeric, hyphens, underscores, 3-30 chars)
      if (!/^[a-zA-Z0-9_-]{3,30}$/.test(customAlias)) {
        res.statusCode = 400;
        throw new Error(
          'Custom alias must be 3-30 characters (letters, numbers, hyphens, underscores only)'
        );
      }

      // Check if alias is already taken
      const existingAlias = await Url.findOne({
        $or: [{ customAlias }, { shortCode: customAlias }],
      });
      if (existingAlias) {
        res.statusCode = 400;
        throw new Error('This custom alias is already taken');
      }

      shortCode = customAlias;
    } else {
      // Generate unique short code
      shortCode = nanoid(8);

      // Ensure uniqueness (extremely unlikely collision, but safe)
      let exists = await Url.findOne({ shortCode });
      while (exists) {
        shortCode = nanoid(8);
        exists = await Url.findOne({ shortCode });
      }
    }

    // Generate QR code as base64 data URL
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    const fullShortUrl = `${baseUrl}/${shortCode}`;
    const qrCode = await QRCode.toDataURL(fullShortUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#1e1b4b',
        light: '#ffffff',
      },
    });

    // Create URL document
    const url = await Url.create({
      userId: req.user._id,
      originalUrl,
      shortCode,
      customAlias: customAlias || null,
      qrCode,
    });

    res.status(201).json({
      success: true,
      data: url,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all URLs for the authenticated user
 * @route   GET /api/url/all
 * @access  Private
 * @query   page, limit, search, sort
 */
export const getAllUrls = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const sort = req.query.sort || '-createdAt'; // Default: newest first

    // Build query
    const query = { userId: req.user._id };

    // Search filter
    if (search) {
      query.$or = [
        { originalUrl: { $regex: search, $options: 'i' } },
        { shortCode: { $regex: search, $options: 'i' } },
        { customAlias: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort object
    let sortObj = {};
    switch (sort) {
      case 'oldest':
        sortObj = { createdAt: 1 };
        break;
      case 'most-clicked':
        sortObj = { totalClicks: -1 };
        break;
      case 'least-clicked':
        sortObj = { totalClicks: 1 };
        break;
      default:
        sortObj = { createdAt: -1 }; // newest
    }

    const [urls, total] = await Promise.all([
      Url.find(query).sort(sortObj).skip(skip).limit(limit),
      Url.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: urls,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single URL by ID
 * @route   GET /api/url/:id
 * @access  Private
 */
export const getUrlById = async (req, res, next) => {
  try {
    const url = await Url.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!url) {
      res.statusCode = 404;
      throw new Error('URL not found');
    }

    res.status(200).json({
      success: true,
      data: url,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a URL
 * @route   PUT /api/url/:id
 * @access  Private
 */
export const updateUrl = async (req, res, next) => {
  try {
    const url = await Url.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!url) {
      res.statusCode = 404;
      throw new Error('URL not found');
    }

    const { originalUrl, customAlias } = req.body;

    // Update original URL if provided
    if (originalUrl) {
      if (
        !validator.isURL(originalUrl, {
          require_protocol: true,
          protocols: ['http', 'https'],
        })
      ) {
        res.statusCode = 400;
        throw new Error('Please provide a valid URL');
      }
      url.originalUrl = originalUrl;
    }

    // Update custom alias if provided
    if (customAlias !== undefined) {
      if (customAlias) {
        if (!/^[a-zA-Z0-9_-]{3,30}$/.test(customAlias)) {
          res.statusCode = 400;
          throw new Error(
            'Custom alias must be 3-30 characters (letters, numbers, hyphens, underscores only)'
          );
        }

        // Check uniqueness (exclude current URL)
        const existingAlias = await Url.findOne({
          $or: [{ customAlias }, { shortCode: customAlias }],
          _id: { $ne: url._id },
        });
        if (existingAlias) {
          res.statusCode = 400;
          throw new Error('This custom alias is already taken');
        }

        url.customAlias = customAlias;
      } else {
        url.customAlias = null;
      }

      // Regenerate QR code with new alias
      const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
      const fullShortUrl = `${baseUrl}/${url.customAlias || url.shortCode}`;
      url.qrCode = await QRCode.toDataURL(fullShortUrl, {
        width: 300,
        margin: 2,
        color: { dark: '#1e1b4b', light: '#ffffff' },
      });
    }

    const updatedUrl = await url.save();

    res.status(200).json({
      success: true,
      data: updatedUrl,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a URL and its click history
 * @route   DELETE /api/url/:id
 * @access  Private
 */
export const deleteUrl = async (req, res, next) => {
  try {
    const url = await Url.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!url) {
      res.statusCode = 404;
      throw new Error('URL not found');
    }

    // Delete associated click records
    await Click.deleteMany({ urlId: url._id });

    // Delete the URL
    await url.deleteOne();

    res.status(200).json({
      success: true,
      message: 'URL deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Redirect short URL to original URL
 * @route   GET /:shortCode
 * @access  Public
 */
export const redirectUrl = async (req, res, next) => {
  try {
    const { shortCode } = req.params;

    // Find URL by shortCode or customAlias
    const url = await Url.findOne({
      $or: [{ shortCode }, { customAlias: shortCode }],
      isActive: true,
    });

    if (!url) {
      res.statusCode = 404;
      throw new Error('Short URL not found');
    }

    // Track click asynchronously (don't block redirect)
    const { device, browser } = parseUserAgent(req.headers['user-agent']);
    const ipAddress = getClientIp(req);

    // Fire and forget — don't await
    Promise.all([
      Click.create({
        urlId: url._id,
        ipAddress,
        device,
        browser,
        referrer: req.headers.referer || 'direct',
      }),
      Url.findByIdAndUpdate(url._id, {
        $inc: { totalClicks: 1 },
        lastClicked: new Date(),
      }),
    ]).catch((err) => console.error('Click tracking error:', err));

    res.redirect(301, url.originalUrl);
  } catch (error) {
    next(error);
  }
};
