import crypto from 'crypto';
import { Job } from '../models/Job.js';
import { Company } from '../models/Company.js';
import { User } from '../models/User.js';

/**
 * Timing-safe string comparison to prevent timing attacks on API keys
 */
function safeTimingCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Parse stipend / salary input string cleanly without fabricating figures
 */
function parseSalary(rawStipend, rawMin, rawMax, rawPeriod) {
  let stipendMin = undefined;
  let stipendMax = undefined;
  let stipendPeriod = rawPeriod === 'Per Annum' ? 'Per Annum' : 'Monthly';

  if (rawMin !== undefined && rawMin !== '' && !isNaN(Number(rawMin))) {
    stipendMin = Number(rawMin);
  }
  if (rawMax !== undefined && rawMax !== '' && !isNaN(Number(rawMax))) {
    stipendMax = Number(rawMax);
  }

  const text = (rawStipend || '').toString().trim();
  if (text) {
    const lower = text.toLowerCase();
    if (lower.includes('lpa') || lower.includes('annum') || lower.includes('year') || lower.includes('annual')) {
      stipendPeriod = 'Per Annum';
    }

    // If numbers haven't been provided explicitly, attempt clean extraction from string
    if (stipendMin === undefined && stipendMax === undefined) {
      // Check for non-numeric phrases (e.g. Not Disclosed, Competitive, As per ICAI)
      if (
        !lower.includes('not disclosed') &&
        !lower.includes('competitive') &&
        !lower.includes('as per icai') &&
        !lower.includes('negotiable')
      ) {
        // Find numbers in format: 15,000 - 20,000 or 15000 or 8-12 LPA
        const cleaned = text.replace(/,/g, '');
        const matches = cleaned.match(/(\d+(?:\.\d+)?)/g);
        if (matches && matches.length >= 2) {
          const num1 = Number(matches[0]);
          const num2 = Number(matches[1]);
          if (!isNaN(num1) && !isNaN(num2)) {
            // Check if numbers are in lakhs (e.g. 8 - 12 LPA)
            if (stipendPeriod === 'Per Annum' && num1 < 100) {
              stipendMin = Math.round(num1 * 100000);
              stipendMax = Math.round(num2 * 100000);
            } else {
              stipendMin = Math.min(num1, num2);
              stipendMax = Math.max(num1, num2);
            }
          }
        } else if (matches && matches.length === 1) {
          const num = Number(matches[0]);
          if (!isNaN(num)) {
            if (stipendPeriod === 'Per Annum' && num < 100) {
              stipendMin = Math.round(num * 100000);
            } else {
              stipendMin = num;
            }
          }
        }
      }
    }
  }

  return { stipendMin, stipendMax, stipendPeriod };
}

/**
 * @desc    Publish approved vacancy from Google Sheets Automation Control Centre
 * @route   POST /api/automation/publish-job
 * @access  Private (Automated with x-api-key header)
 */
export async function publishJobFromAutomation(req, res, next) {
  try {
    // 1. API Key Authentication
    const serverApiKey = process.env.AUTOMATION_API_KEY;
    if (!serverApiKey) {
      return res.status(500).json({
        success: false,
        message: 'Server automation integration is not configured. AUTOMATION_API_KEY environment variable is missing on the server.',
      });
    }

    const clientApiKey = req.headers['x-api-key'];
    if (!clientApiKey || typeof clientApiKey !== 'string') {
      return res.status(401).json({
        success: false,
        message: 'Access denied: Missing x-api-key header.',
      });
    }

    if (!safeTimingCompare(clientApiKey, serverApiKey)) {
      return res.status(401).json({
        success: false,
        message: 'Access denied: Invalid API key.',
      });
    }

    const body = req.body || {};

    // 2. Server-Side Approval Safeguards (Strict Enforcement)
    const approvalStatus = (body.approvalStatus || body['Approval Status'] || '').trim();
    const verificationStatus = (body.verificationStatus || body['Verification Status'] || '').trim();
    const duplicateCheck = (body.duplicateCheck || body['Duplicate Check'] || '').trim();
    const activeStatus = (body.activeStatus || body['Active Status'] || body.status || '').trim();
    const isActive = body.isActive;

    if (approvalStatus !== 'Approved') {
      return res.status(400).json({
        success: false,
        message: `Vacancy rejected: Approval Status must be 'Approved'. Current value is '${approvalStatus || 'None'}'. Unapproved vacancies cannot be published.`,
      });
    }

    if (verificationStatus !== 'Verified') {
      return res.status(400).json({
        success: false,
        message: `Vacancy rejected: Verification Status must be 'Verified'. Current value is '${verificationStatus || 'None'}'. Unverified vacancies cannot be published.`,
      });
    }

    if (duplicateCheck !== 'No Duplicate') {
      return res.status(400).json({
        success: false,
        message: `Vacancy rejected: Duplicate Check must be 'No Duplicate'. Current value is '${duplicateCheck || 'None'}'. Potential or confirmed duplicates cannot be published.`,
      });
    }

    if (activeStatus.toLowerCase() === 'inactive' || isActive === false) {
      return res.status(400).json({
        success: false,
        message: 'Vacancy rejected: Inactive vacancies cannot be published.',
      });
    }

    // 3. Field Extraction & Required Validations
    const externalId = (body.vacancyId || body['Vacancy ID'] || body.externalId || '').toString().trim();
    if (!externalId) {
      return res.status(400).json({
        success: false,
        message: 'Vacancy ID is required for automation publishing.',
      });
    }

    const title = (body.jobTitle || body['Job Title'] || body.title || '').toString().trim();
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Job Title is required.',
      });
    }

    const companyName = (body.companyName || body['Company Name'] || '').toString().trim();
    if (!companyName) {
      return res.status(400).json({
        success: false,
        message: 'Company / Firm Name is required.',
      });
    }

    // Category Mapping
    const rawCategory = (body.category || body['Category'] || '').toString().toLowerCase().trim();
    let category = '';
    let categoryName = '';

    if (rawCategory === 'articleship' || rawCategory.includes('article')) {
      category = 'articleship';
      categoryName = 'CA Articleship';
    } else if (rawCategory === 'industrial-training' || rawCategory.includes('industrial')) {
      category = 'industrial-training';
      categoryName = 'CA Industrial Training';
    } else if (
      rawCategory === 'ca-jobs' ||
      rawCategory.includes('qualified') ||
      rawCategory === 'ca jobs' ||
      rawCategory === 'jobs'
    ) {
      category = 'ca-jobs';
      categoryName = 'CA Qualified Jobs';
    } else {
      return res.status(400).json({
        success: false,
        message: `Invalid category '${body.category}'. Category must be 'Articleship', 'Industrial Training', or 'CA Qualified Jobs'.`,
      });
    }

    // Work Mode Mapping
    const rawWorkMode = (body.workMode || body['Work Mode'] || 'On-site').toString().toLowerCase().trim();
    let workMode = 'On-site';
    if (rawWorkMode.includes('remote') || rawWorkMode.includes('wfh')) {
      workMode = 'Remote';
    } else if (rawWorkMode.includes('hybrid')) {
      workMode = 'Hybrid';
    } else if (rawWorkMode.includes('onsite') || rawWorkMode.includes('office') || rawWorkMode.includes('on-site')) {
      workMode = 'On-site';
    }

    const city = (body.location || body['Location'] || body.city || 'Pan-India').toString().trim();
    const domain = (body.domain || body['Domain'] || categoryName).toString().trim();

    // Eligibility Mapping
    let eligibility = (body.eligibility || body['Eligibility'] || '').toString().trim();
    if (category === 'industrial-training' && (!eligibility || eligibility === 'default')) {
      eligibility = 'CA Finalist with min 12 months of completed articleship';
    } else if (!eligibility) {
      if (category === 'articleship') {
        eligibility = 'CA Intermediate (Both Groups / Either Group cleared)';
      } else {
        eligibility = 'Qualified Chartered Accountant';
      }
    }

    // Salary Parsing
    const rawStipend = body.stipend || body['Stipend / Salary'] || body.salary || '';
    const { stipendMin, stipendMax, stipendPeriod } = parseSalary(
      rawStipend,
      body.stipendMin,
      body.stipendMax,
      body.stipendPeriod
    );

    const deadline = (body.applicationDeadline || body['Application Deadline'] || body.deadline || '15 days left').toString().trim();

    let description = (body.description || body['Description'] || body.remarks || body['Remarks'] || '').toString().trim();
    const joiningDetails = (body.joiningDetails || body['Joining Details'] || '').toString().trim();
    const duration = (body.duration || body['Duration'] || '').toString().trim();

    if (!description) {
      const parts = [`${categoryName} opportunity at ${companyName} (${city}).`];
      if (domain) parts.push(`Domain: ${domain}.`);
      if (workMode) parts.push(`Work Mode: ${workMode}.`);
      if (eligibility) parts.push(`Eligibility: ${eligibility}.`);
      if (duration) parts.push(`Duration: ${duration}.`);
      if (joiningDetails) parts.push(`Joining Details: ${joiningDetails}.`);
      description = parts.join(' ');
    }

    const sourceUrl = (body.originalSourceUrl || body['Original Source URL'] || body.sourceUrl || '').toString().trim();

    // Application Method & Destination Validation
    let applicationMethod = (body.applicationMethod || body['Application Method'] || '').toString().toLowerCase().trim();
    let applicationLink = (body.applicationUrl || body['Application URL'] || body.applicationLink || '').toString().trim();
    let recruiterEmail = (body.contactDetails || body['Contact Details'] || body.recruiterEmail || '').toString().trim();

    if (applicationLink) {
      if (!applicationLink.startsWith('http://') && !applicationLink.startsWith('https://')) {
        applicationLink = 'https://' + applicationLink;
      }
      try {
        new URL(applicationLink);
      } catch {
        return res.status(400).json({
          success: false,
          message: 'Invalid Application URL provided.',
        });
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = recruiterEmail && emailRegex.test(recruiterEmail);

    if (applicationLink && (applicationMethod === 'external' || !applicationMethod || applicationMethod.includes('link') || applicationMethod.includes('form') || applicationMethod.includes('url'))) {
      applicationMethod = 'external';
    } else if (isEmailValid && (applicationMethod === 'email' || applicationMethod.includes('email') || !applicationMethod)) {
      applicationMethod = 'email';
    } else if (applicationMethod === 'internal' || (!applicationLink && !isEmailValid)) {
      applicationMethod = 'internal';
    } else if (applicationLink) {
      applicationMethod = 'external';
    }

    // 4. Locate or Create Partner Company Record
    const escapedName = companyName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    let company = await Company.findOne({ name: new RegExp(`^${escapedName}$`, 'i') });
    if (!company) {
      const adminUser = await User.findOne({ role: 'admin' });
      company = await Company.create({
        userId: adminUser ? adminUser._id : undefined,
        name: companyName,
        firmType: 'CA Firm / Corporate',
        registrationNumber: 'VERIFIED-PARTNER',
        city: city || 'Mumbai',
        address: 'India',
        isVerified: true,
      });
    }

    const clientUrl = (process.env.CLIENT_URL || 'https://cadwar.in').replace(/\/$/, '');

    // 5. Idempotency & Duplicate Prevention
    const existingJob = await Job.findOne({ externalId });
    if (existingJob) {
      // Security Check: Never overwrite or modify an unrelated employer-created job
      if (
        existingJob.postedByRole === 'employer' ||
        (existingJob.postingSource &&
          existingJob.postingSource !== 'sheets_automation' &&
          existingJob.postingSource !== 'admin_dashboard')
      ) {
        return res.status(409).json({
          success: false,
          message: `Conflict: Vacancy ID '${externalId}' matches an existing employer/manual job and cannot be overwritten.`,
        });
      }

      const liveUrl = `${clientUrl}/jobs/${existingJob._id}`;
      const isForceUpdate = body.updateIfExists === true || body.forceUpdate === true;

      if (isForceUpdate) {
        // Safe update: update details while guaranteeing status remains Published
        existingJob.title = title;
        existingJob.companyName = companyName;
        existingJob.companyId = company._id;
        existingJob.category = category;
        existingJob.categoryName = categoryName;
        existingJob.domain = domain;
        existingJob.city = city;
        existingJob.workMode = workMode;
        existingJob.eligibility = eligibility;
        if (stipendMin !== undefined) existingJob.stipendMin = stipendMin;
        if (stipendMax !== undefined) existingJob.stipendMax = stipendMax;
        existingJob.stipendPeriod = stipendPeriod;
        existingJob.deadline = deadline;
        existingJob.description = description;
        existingJob.applicationMethod = applicationMethod;
        existingJob.applicationLink = applicationMethod === 'external' ? applicationLink : '';
        existingJob.recruiterEmail = applicationMethod === 'email' ? recruiterEmail : '';
        existingJob.sourceUrl = sourceUrl;
        existingJob.status = 'Published';
        existingJob.isAdminVerified = true;
        existingJob.postingSource = 'sheets_automation';

        await existingJob.save();

        return res.json({
          success: true,
          action: 'updated',
          externalId,
          jobId: existingJob._id,
          liveUrl,
        });
      }

      // Default retry response: idempotent confirmation without duplicate creation
      return res.json({
        success: true,
        action: 'already_published',
        externalId,
        jobId: existingJob._id,
        liveUrl,
      });
    }

    // 6. Safe Job Publication
    const jobData = {
      externalId,
      title,
      companyName,
      companyId: company._id,
      category,
      categoryName,
      domain,
      city,
      workMode,
      stipendMin,
      stipendMax,
      stipendPeriod,
      eligibility,
      deadline,
      description,
      applicationMethod,
      applicationLink: applicationMethod === 'external' ? applicationLink : '',
      recruiterEmail: applicationMethod === 'email' ? recruiterEmail : '',
      sourceUrl,
      status: 'Published',
      postedByRole: 'admin',
      postingSource: 'sheets_automation',
      isAdminVerified: true,
      verifiedAt: new Date(),
      publishedAt: new Date(),
    };

    let newJob;
    try {
      newJob = await Job.create(jobData);
    } catch (err) {
      // Handle concurrent race condition (MongoDB E11000 duplicate key error)
      if (err.code === 11000 && err.keyPattern && err.keyPattern.externalId) {
        const racedJob = await Job.findOne({ externalId });
        if (racedJob) {
          return res.json({
            success: true,
            action: 'already_published',
            externalId,
            jobId: racedJob._id,
            liveUrl: `${clientUrl}/jobs/${racedJob._id}`,
          });
        }
      }
      throw err;
    }

    const liveUrl = `${clientUrl}/jobs/${newJob._id}`;

    return res.status(201).json({
      success: true,
      action: 'created',
      externalId,
      jobId: newJob._id,
      liveUrl,
    });
  } catch (error) {
    // Return clean, non-sensitive error messages
    return res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while publishing the vacancy.',
    });
  }
}
