import { Job } from '../models/Job.js';
import { Company } from '../models/Company.js';

// @desc    Get all published jobs with multi-facet filters
// @route   GET /api/jobs
// @access  Public
export async function getJobs(req, res, next) {
  try {
    const { category, city, domain, workMode, groups, q, sort } = req.query;

    const query = { status: 'Published' };

    if (category) query.category = category;
    if (city) query.city = new RegExp(city, 'i');
    if (domain) query.domain = new RegExp(domain, 'i');
    if (workMode) query.workMode = workMode;
    if (groups) query.requiredGroups = groups;

    if (q) {
      query.$or = [
        { title: new RegExp(q, 'i') },
        { companyName: new RegExp(q, 'i') },
        { domain: new RegExp(q, 'i') },
        { description: new RegExp(q, 'i') },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'stipend') sortOption = { stipendMax: -1 };

    const jobs = await Job.find(query).populate('companyId').sort(sortOption);

    res.json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
export async function getJobById(req, res, next) {
  try {
    const job = await Job.findById(req.params.id).populate('companyId');
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job vacancy not found' });
    }
    res.json({ success: true, job });
  } catch (error) {
    next(error);
  }
}

// @desc    Create new job posting (Employer or Admin)
// @route   POST /api/jobs
// @access  Private (Employer / Admin)
export async function createJob(req, res, next) {
  try {
    const isAdmin = req.user.role === 'admin';
    let company = await Company.findOne({ userId: req.user._id });

    const rawCompanyName = (req.body.companyName || company?.name || '').trim();
    if (!rawCompanyName) {
      return res.status(400).json({ success: false, message: 'Company / Firm Name is required.' });
    }

    // If company not found for user (e.g. Admin posting on behalf of a firm), find or create company record
    if (!company || (isAdmin && req.body.companyName && req.body.companyName !== company.name)) {
      company = await Company.findOne({ name: new RegExp(`^${rawCompanyName}$`, 'i') });
      if (!company) {
        company = await Company.create({
          userId: req.user._id,
          name: rawCompanyName,
          firmType: 'CA Firm / Corporate',
          registrationNumber: 'VERIFIED-PARTNER',
          city: req.body.city || 'Mumbai',
          address: 'India',
          isVerified: true,
        });
      }
    }

    const jobData = {
      ...req.body,
      companyId: company._id,
      companyName: rawCompanyName,
      status: isAdmin ? (req.body.status || 'Published') : (company.isVerified ? 'Published' : 'Pending Review'),
    };

    const job = await Job.create(jobData);
    res.status(201).json({ success: true, job });
  } catch (error) {
    next(error);
  }
}

// @desc    Update job status (Pause, Close, Draft) or edit details
// @route   PUT /api/jobs/:id
// @access  Private (Employer / Admin)
export async function updateJob(req, res, next) {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Non-admin can only update their own company's jobs
    if (req.user.role !== 'admin') {
      const company = await Company.findOne({ userId: req.user._id });
      if (!company || String(job.companyId) !== String(company._id)) {
        return res.status(403).json({ success: false, message: 'Not authorized to update this job' });
      }
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, job });
  } catch (error) {
    next(error);
  }
}

// @desc    Delete job posting
// @route   DELETE /api/jobs/:id
// @access  Private (Employer / Admin)
export async function deleteJob(req, res, next) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job vacancy not found' });
    }

    // Admins can delete any job; Employers can only delete their own
    if (req.user.role !== 'admin') {
      const company = await Company.findOne({ userId: req.user._id });
      if (!company || String(job.companyId) !== String(company._id)) {
        return res.status(403).json({ success: false, message: 'Not authorized to delete this job' });
      }
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    next(error);
  }
}
