import { Job } from '../models/Job.js';
import { Company } from '../models/Company.js';
import { Application } from '../models/Application.js';

// @desc    Get all published jobs with multi-facet filters
// @route   GET /api/jobs
// @access  Public
export async function getJobs(req, res, next) {
  try {
    const { category, city, domain, workMode, groups, q, sort, status } = req.query;

    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    } else if (!status) {
      query.status = 'Published';
    }

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

    const normalizedJobs = jobs.map((job) => {
      const j = job.toObject ? job.toObject() : { ...job };
      if (j.category === 'industrial-training') {
        if (
          !j.eligibility ||
          j.eligibility.includes('18 months') ||
          j.eligibility.includes('9-12 months') ||
          j.eligibility === 'CA Final student with 12 months minimum training completed' ||
          j.eligibility === 'CA Finalist with deep interest in public stock markets'
        ) {
          j.eligibility = 'CA Finalist with min 12 months of completed articleship';
        }
      }

      // Backward-compatible application method deduction
      if (!j.applicationMethod) {
        if (j.applicationLink && j.applicationLink.trim()) {
          j.applicationMethod = 'external';
        } else if (j.recruiterEmail && j.recruiterEmail.trim()) {
          j.applicationMethod = 'email';
        } else {
          j.applicationMethod = 'internal';
        }
      }

      return j;
    });

    res.json({
      success: true,
      count: normalizedJobs.length,
      jobs: normalizedJobs,
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Get live active vacancies and applications submitted per category
// @route   GET /api/jobs/category-stats
// @access  Public
export async function getCategoryStats(req, res, next) {
  try {
    const now = new Date();

    // 1. Match only active, published, non-expired vacancies
    const activeMatch = {
      status: 'Published',
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gt: now } },
      ],
    };

    const activeJobCounts = await Job.aggregate([
      { $match: activeMatch },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    // 2. Count actual application records submitted per category
    const applicationCounts = await Application.aggregate([
      {
        $lookup: {
          from: 'jobs',
          let: { jId: '$jobId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ['$_id', '$$jId'] },
                    { $eq: [{ $toString: '$_id' }, { $toString: '$$jId' }] },
                  ],
                },
              },
            },
            { $project: { category: 1 } },
          ],
          as: 'job',
        },
      },
      { $unwind: '$job' },
      {
        $group: {
          _id: '$job.category',
          count: { $sum: 1 },
        },
      },
    ]);

    const stats = {
      articleship: {
        activeOpenings: 0,
        applicationsSubmitted: 0,
      },
      'industrial-training': {
        activeOpenings: 0,
        applicationsSubmitted: 0,
      },
      'ca-jobs': {
        activeOpenings: 0,
        applicationsSubmitted: 0,
      },
    };

    activeJobCounts.forEach((item) => {
      if (item._id && stats[item._id]) {
        stats[item._id].activeOpenings = item.count;
      }
    });

    applicationCounts.forEach((item) => {
      if (item._id && stats[item._id]) {
        stats[item._id].applicationsSubmitted = item.count;
      }
    });

    res.json({
      success: true,
      stats,
      timestamp: new Date().toISOString(),
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
    const jobObj = job.toObject ? job.toObject() : { ...job };
    if (jobObj.category === 'industrial-training') {
      if (
        !jobObj.eligibility ||
        jobObj.eligibility.includes('18 months') ||
        jobObj.eligibility.includes('9-12 months') ||
        jobObj.eligibility === 'CA Final student with 12 months minimum training completed' ||
        jobObj.eligibility === 'CA Finalist with deep interest in public stock markets'
      ) {
        jobObj.eligibility = 'CA Finalist with min 12 months of completed articleship';
      }
    }

    if (!jobObj.applicationMethod) {
      if (jobObj.applicationLink && jobObj.applicationLink.trim()) {
        jobObj.applicationMethod = 'external';
      } else if (jobObj.recruiterEmail && jobObj.recruiterEmail.trim()) {
        jobObj.applicationMethod = 'email';
      } else {
        jobObj.applicationMethod = 'internal';
      }
    }

    res.json({ success: true, job: jobObj });
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
    const rawCompanyName = (req.body.companyName || '').trim();

    if (!rawCompanyName && isAdmin) {
      return res.status(400).json({ success: false, message: 'Company / Firm Name is required.' });
    }

    let company = null;

    if (isAdmin) {
      // Admin posting on behalf of any specified hiring company
      const escapedName = rawCompanyName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      company = await Company.findOne({ name: new RegExp(`^${escapedName}$`, 'i') });
      if (!company) {
        company = await Company.create({
          userId: req.user._id,
          name: rawCompanyName,
          firmType: 'Corporate / MNC',
          registrationNumber: 'VERIFIED-PARTNER',
          city: req.body.city || 'Mumbai',
          address: 'India',
          isVerified: true,
        });
      }
    } else {
      // Regular employer posting for their own registered company
      company = await Company.findOne({ userId: req.user._id });
      if (!company) {
        return res.status(400).json({
          success: false,
          message: 'Employer profile not found. Please complete company registration first.',
        });
      }
    }

    let eligibility = req.body.eligibility;
    if (req.body.category === 'industrial-training') {
      if (!eligibility || !eligibility.trim()) {
        eligibility = 'CA Finalist with min 12 months of completed articleship';
      }
    }

    // Application Method & Destination Validation
    let applicationMethod = req.body.applicationMethod;
    if (!applicationMethod) {
      if (req.body.applicationLink && req.body.applicationLink.trim()) {
        applicationMethod = 'external';
      } else if (req.body.recruiterEmail && req.body.recruiterEmail.trim()) {
        applicationMethod = 'email';
      } else {
        applicationMethod = 'internal';
      }
    }

    let applicationLink = (req.body.applicationLink || '').trim();
    let recruiterEmail = (req.body.recruiterEmail || '').trim();

    if (applicationMethod === 'external') {
      if (!applicationLink) {
        return res.status(400).json({ success: false, message: 'Application URL is required for External Link method.' });
      }
      if (!applicationLink.startsWith('http://') && !applicationLink.startsWith('https://')) {
        applicationLink = 'https://' + applicationLink;
      }
      try {
        new URL(applicationLink);
      } catch {
        return res.status(400).json({ success: false, message: 'Please provide a valid application URL.' });
      }
    } else if (applicationMethod === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!recruiterEmail || !emailRegex.test(recruiterEmail)) {
        return res.status(400).json({ success: false, message: 'Please provide a valid application email address.' });
      }
    }

    const jobData = {
      ...req.body,
      applicationMethod,
      applicationLink: applicationMethod === 'external' ? applicationLink : '',
      recruiterEmail: applicationMethod === 'email' ? recruiterEmail : '',
      eligibility: eligibility || req.body.eligibility,
      companyId: company._id,
      companyName: isAdmin ? rawCompanyName : company.name,
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

    // If companyName is modified by admin, locate or create matching company record
    if (req.user.role === 'admin' && req.body.companyName && req.body.companyName.trim() !== job.companyName) {
      const rawCompanyName = req.body.companyName.trim();
      const escapedName = rawCompanyName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      let company = await Company.findOne({ name: new RegExp(`^${escapedName}$`, 'i') });
      if (!company) {
        company = await Company.create({
          userId: req.user._id,
          name: rawCompanyName,
          firmType: 'Corporate / MNC',
          registrationNumber: 'VERIFIED-PARTNER',
          city: req.body.city || job.city || 'Mumbai',
          address: 'India',
          isVerified: true,
        });
      }
      req.body.companyId = company._id;
    }

    if (
      (req.body.category === 'industrial-training' || (!req.body.category && job.category === 'industrial-training')) &&
      req.body.eligibility !== undefined &&
      !req.body.eligibility.trim()
    ) {
      req.body.eligibility = 'CA Finalist with min 12 months of completed articleship';
    }

    if (req.body.applicationMethod !== undefined) {
      const method = req.body.applicationMethod;
      if (method === 'external') {
        let link = (req.body.applicationLink || '').trim();
        if (!link) {
          return res.status(400).json({ success: false, message: 'Application URL is required for External Link method.' });
        }
        if (!link.startsWith('http://') && !link.startsWith('https://')) {
          link = 'https://' + link;
        }
        try {
          new URL(link);
          req.body.applicationLink = link;
        } catch {
          return res.status(400).json({ success: false, message: 'Please provide a valid application URL.' });
        }
      } else if (method === 'email') {
        const email = (req.body.recruiterEmail || '').trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
          return res.status(400).json({ success: false, message: 'Please provide a valid application email address.' });
        }
        req.body.recruiterEmail = email;
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
