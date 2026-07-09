import validator from 'validator';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate inputs
    if (!name || !email || !password) {
      res.statusCode = 400;
      throw new Error('Please provide name, email, and password');
    }

    if (!validator.isEmail(email)) {
      res.statusCode = 400;
      throw new Error('Please provide a valid email address');
    }

    if (password.length < 6) {
      res.statusCode = 400;
      throw new Error('Password must be at least 6 characters');
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.statusCode = 400;
      throw new Error('An account with this email already exists');
    }

    // Create user
    const user = await User.create({ name, email, password });

    // Generate token
    const token = generateToken(user._id);

    // Set cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      res.statusCode = 400;
      throw new Error('Please provide email and password');
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      res.statusCode = 401;
      throw new Error('Invalid email or password');
    }

    // Generate token
    const token = generateToken(user._id);

    // Set cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.statusCode = 404;
      throw new Error('User not found');
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/update
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      res.statusCode = 404;
      throw new Error('User not found');
    }

    // Update name if provided
    if (req.body.name) {
      user.name = req.body.name;
    }

    // Update email if provided
    if (req.body.email) {
      if (!validator.isEmail(req.body.email)) {
        res.statusCode = 400;
        throw new Error('Please provide a valid email address');
      }

      // Check if email is taken by another user
      const emailExists = await User.findOne({
        email: req.body.email,
        _id: { $ne: user._id },
      });
      if (emailExists) {
        res.statusCode = 400;
        throw new Error('Email is already in use');
      }

      user.email = req.body.email;
    }

    // Update password if provided
    if (req.body.newPassword) {
      if (!req.body.currentPassword) {
        res.statusCode = 400;
        throw new Error('Please provide your current password');
      }

      const isMatch = await user.matchPassword(req.body.currentPassword);
      if (!isMatch) {
        res.statusCode = 400;
        throw new Error('Current password is incorrect');
      }

      if (req.body.newPassword.length < 6) {
        res.statusCode = 400;
        throw new Error('New password must be at least 6 characters');
      }

      user.password = req.body.newPassword;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user (clear cookie)
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};
