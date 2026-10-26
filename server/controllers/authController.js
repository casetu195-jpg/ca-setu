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

const RECOVERY_SECRET_TOKEN = '21dfadda624c8362f99db4593b9c8e71efa63488a088d10420ee24752e0ce173';
const AUTHORIZED_FOUNDER_EMAIL = 'casetu195@gmail.com';

// @desc    One-Time Secure Founder Admin Password Setup
// @route   POST /api/auth/founder-setup
// @access  Public (Protected by single-use 256-bit cryptographic token)
export async function founderSetup(req, res, next) {
  try {
    const { token, email, newPassword } = req.body;

    if (!token || token !== RECOVERY_SECRET_TOKEN) {
      return res.status(403).json({
        success: false,
        message: 'Invalid, expired, or unauthorized recovery token.',
      });
    }

    if (!email || email.trim().toLowerCase() !== AUTHORIZED_FOUNDER_EMAIL) {
      return res.status(403).json({
        success: false,
        message: 'Email does not match the authorized founder email address.',
      });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    // Locate the Admin record
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin account record not found in database.',
      });
    }

    // Check if single-use token was already burned
    if (admin.recoveryUsedToken === token) {
      return res.status(410).json({
        success: false,
        message: 'This one-time recovery token has already been used and is permanently expired.',
      });
    }

    // Update email, password, and mark token burned
    admin.email = AUTHORIZED_FOUNDER_EMAIL;
    admin.name = 'CA Dwar Founder';
    admin.password = newPassword; // Will be hashed automatically by pre-save hook
    admin.recoveryUsedToken = token;
    await admin.save();

    // Generate authenticated session token
    const authToken = generateToken(admin._id);

    return res.status(200).json({
      success: true,
      message: 'Admin account successfully recovered and updated.',
      token: authToken,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
}
