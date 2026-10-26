import { Application } from '../models/Application.js';
import { Job } from '../models/Job.js';
import { StudentProfile } from '../models/StudentProfile.js';

// @desc    Apply to a job
// @route   POST /api/applications
// @access  Private (Student)
export async function applyToJob(req, res, next) {
  try {
    const { jobId, coverNote } = req.body;
    const studentId = req.user._id;

    // Check if job exists & is published
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job vacancy not found' });
    }
    if (job.status !== 'Published') {
      return res.status(400).json({ success: false, message: 'This vacancy is no longer accepting applications.' });
    }

    // Check duplicate
    const alreadyApplied = await Application.findOne({ jobId, studentId });
    if (alreadyApplied) {
      return res.status(409).json({ success: false, message: 'You have already applied to this opportunity.' });
    }

    const profile = await StudentProfile.findOne({ userId: studentId });

    const application = await Application.create({
      jobId,
      studentId,
      studentName: req.user.name,
      studentEmail: req.user.email,
      studentPhone: req.user.phone || '',
      caStage: profile?.caStage || 'Inter',
      groupsCleared: profile?.groupsCleared || 'Both Groups',
      attemptsCount: profile?.attemptsCount || 1,
      city: profile?.city || 'Mumbai',
      coverNote: coverNote || '',
      resumeUrl: profile?.resumeUrl || '',
      status: 'Applied',
      statusHistory: [
        { status: 'Applied', note: 'Application submitted on CA Dwar portal' },
      ],
    });

    // Increment applicant count on job
    await Job.findByIdAndUpdate(jobId, { $inc: { applicantCount: 1 } });

    res.status(201).json({ success: true, application });
  } catch (error) {
    next(error);
  }
}

// @desc    Get student's own applications
// @route   GET /api/applications/my
// @access  Private (Student)
export async function getMyApplications(req, res, next) {
  try {
    const applications = await Application.find({ studentId: req.user._id })
      .populate('jobId')
      .sort({ createdAt: -1 });

    res.json({ success: true, applications });
  } catch (error) {
    next(error);
  }
}

// @desc    Update applicant status (Applied, Shortlisted, Interview, Selected, Rejected)
// @route   PUT /api/applications/:id/status
// @access  Private (Employer / Admin)
export async function updateApplicationStatus(req, res, next) {
  try {
    const { status, note } = req.body;

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application record not found' });
    }

    application.status = status;
    application.statusHistory.push({
      status,
      date: new Date(),
      note: note || `Status changed to ${status}`,
    });

    await application.save();

    res.json({ success: true, application });
  } catch (error) {
    next(error);
  }
}
