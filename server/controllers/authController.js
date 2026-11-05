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
    const {
      name,
      email,
      password,
      role,
      phone,
      companyName,
      frn,
      privacyAccepted,
      termsAccepted,
    } = req.body;

    // Prevent public registration as admin
    if (role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin accounts cannot be registered publicly.',
      });
    }

    // Enforce mandatory separate consents
    if (!privacyAccepted) {
      return res.status(400).json({
        success: false,
        message: 'You must read and agree to the CA Dwar Privacy Policy to register.',
      });
    }

    if (!termsAccepted) {
      return res.status(400).json({
        success: false,
        message: 'You must accept the CA Dwar Terms of Use to register.',
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
      authProvider: 'local',
      privacyConsent: {
        accepted: true,
        version: '1.0',
        consentedAt: new Date(),
      },
      termsConsent: {
        accepted: true,
        version: '1.0',
        consentedAt: new Date(),
      },
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
        authProvider: user.authProvider,
        privacyConsent: user.privacyConsent,
        termsConsent: user.termsConsent,
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

    let companyId = null;
    let companyName = null;
    if (user.role === 'employer') {
      const company = await Company.findOne({ userId: user._id });
      if (company) {
        companyId = company._id;
        companyName = company.name;
      }
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        authProvider: user.authProvider,
        avatar: user.avatar,
        companyId,
        companyName,
        privacyConsent: user.privacyConsent,
        termsConsent: user.termsConsent,
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
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let profileData = null;
    let companyId = null;
    let companyName = null;

    if (user.role === 'student') {
      profileData = await StudentProfile.findOne({ userId: user._id });
    } else if (user.role === 'employer') {
      profileData = await Company.findOne({ userId: user._id });
      if (profileData) {
        companyId = profileData._id;
        companyName = profileData.name;
      }
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        authProvider: user.authProvider,
        avatar: user.avatar,
        companyId,
        companyName,
        privacyConsent: user.privacyConsent,
        termsConsent: user.termsConsent,
      },
      profile: profileData,
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Google OAuth Sign-in & Sign-up
// @route   POST /api/auth/google
// @access  Public
export async function googleAuth(req, res, next) {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google ID token credential is required.',
      });
    }

    // Verify token with Google's official tokeninfo endpoint
    const googleRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
    );

    if (!googleRes.ok) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired Google credential token.',
      });
    }

    const payload = await googleRes.json();
    if (!payload.email) {
      return res.status(400).json({
        success: false,
        message: 'Unable to retrieve verified email from Google account.',
      });
    }

    // Strict verification of email ownership
    if (payload.email_verified !== 'true' && payload.email_verified !== true) {
      return res.status(403).json({
        success: false,
        message: 'Google email address is not verified by Google.',
      });
    }

    // Audience verification if GOOGLE_CLIENT_ID configured
    if (process.env.GOOGLE_CLIENT_ID && payload.aud !== process.env.GOOGLE_CLIENT_ID) {
      return res.status(401).json({
        success: false,
        message: 'Google token audience mismatch.',
      });
    }

    const email = payload.email.toLowerCase().trim();
    let user = await User.findOne({ email });
    let isNewUser = false;

    if (user) {
      // Existing user: Link Google ID securely
      if (!user.googleId) {
        user.googleId = payload.sub;
      }
      if (!user.avatar && payload.picture) {
        user.avatar = payload.picture;
      }
      await user.save();
    } else {
      // New user registration via Google: strictly student role (never escalated)
      isNewUser = true;
      user = await User.create({
        name: payload.name || email.split('@')[0],
        email,
        authProvider: 'google',
        googleId: payload.sub,
        avatar: payload.picture,
        role: 'student',
        privacyConsent: {
          accepted: false,
          version: '1.0',
        },
        termsConsent: {
          accepted: false,
          version: '1.0',
        },
      });

      await StudentProfile.create({
        userId: user._id,
        caStage: 'Inter',
        groupsCleared: 'Both Groups',
        city: 'Mumbai',
      });
    }

    let companyId = null;
    let companyName = null;
    if (user.role === 'employer') {
      const company = await Company.findOne({ userId: user._id });
      if (company) {
        companyId = company._id;
        companyName = company.name;
      }
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      isNewUser,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        authProvider: user.authProvider,
        companyId,
        companyName,
        privacyConsent: user.privacyConsent,
        termsConsent: user.termsConsent,
      },
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Record mandatory Privacy Policy & Terms of Use consent
// @route   POST /api/auth/consent
// @access  Private
export async function recordConsent(req, res, next) {
  try {
    const { privacyAccepted, termsAccepted, privacyVersion, termsVersion } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    if (privacyAccepted) {
      user.privacyConsent = {
        accepted: true,
        version: privacyVersion || '1.0',
        consentedAt: new Date(),
      };
    }

    if (termsAccepted) {
      user.termsConsent = {
        accepted: true,
        version: termsVersion || '1.0',
        consentedAt: new Date(),
      };
    }

    await user.save();

    res.json({
      success: true,
      message: 'Consent records updated successfully.',
      privacyConsent: user.privacyConsent,
      termsConsent: user.termsConsent,
    });
  } catch (error) {
    next(error);
  }
}
