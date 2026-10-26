import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { StudentProfile } from '../models/StudentProfile.js';
import { Company } from '../models/Company.js';

function generateToken(id) {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'ca-setu-super-secret-jwt-key-2026',
    { expiresIn: '30d' }
  );
}

// @desc    Register a new user (Student or Employer)
// @route   POST /api/auth/register
// @access  Public
export async function register(req, res, next) {
  try {
    const { name, email, password, role, phone, companyName, frn } = req.body;

    // Prevent public registration as admin
    if (role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin accounts cannot be registered publicly.',
      });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email address.',
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role || 'student',
      phone,
    });

    // Create corresponding profile
    if (user.role === 'student') {
      await StudentProfile.create({
        userId: user._id,
        caStage: 'Inter',
        groupsCleared: 'Both Groups',
        city: 'Mumbai',
      });
    } else if (user.role === 'employer') {
      await Company.create({
        userId: user._id,
        name: companyName || `${name} & Co.`,
        registrationNumber: frn || '100000W',
        city: 'Mumbai',
        address: 'Headquarters, India',
        isVerified: false,
      });
    }

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    let profileData = null;

    if (user.role === 'student') {
      profileData = await StudentProfile.findOne({ userId: user._id });
    } else if (user.role === 'employer') {
      profileData = await Company.findOne({ userId: user._id });
    }

    res.json({
      success: true,
      user,
      profile: profileData,
    });
  } catch (error) {
    next(error);
  }
}
