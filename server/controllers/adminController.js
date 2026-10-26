import { Company } from '../models/Company.js';
import { Job } from '../models/Job.js';
import { User } from '../models/User.js';
import { Application } from '../models/Application.js';

// @desc    Admin Dashboard Statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
export async function getAdminStats(req, res, next) {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalEmployers = await User.countDocuments({ role: 'employer' });
    const totalCompanies = await Company.countDocuments();
    const verifiedCompanies = await Company.countDocuments({ isVerified: true });
    const pendingCompanies = await Company.countDocuments({ isVerified: false });
    const publishedJobs = await Job.countDocuments({ status: 'Published' });
    const pendingJobs = await Job.countDocuments({ status: 'Pending Review' });
    const totalApplications = await Application.countDocuments();

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalEmployers,
        totalCompanies,
        verifiedCompanies,
        pendingCompanies,
        publishedJobs,
        pendingJobs,
        totalApplications,
      },
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Admin Verify or Revoke Company Verification
// @route   PUT /api/admin/companies/:id/verify
// @access  Private (Admin)
export async function verifyCompany(req, res, next) {
  try {
    const { isVerified } = req.body;
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      {
        isVerified,
        verifiedBy: req.user._id,
        verifiedAt: isVerified ? new Date() : null,
      },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    res.json({
      success: true,
      message: isVerified
        ? 'Company verified successfully with CA Dwar trust badge.'
        : 'Company verification revoked.',
      company,
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Admin Approve or Reject Job
// @route   PUT /api/admin/jobs/:id/moderation
// @access  Private (Admin)
export async function moderateJob(req, res, next) {
  try {
    const { status } = req.body; // 'Published' or 'Rejected'
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({ success: true, job });
  } catch (error) {
    next(error);
  }
}
