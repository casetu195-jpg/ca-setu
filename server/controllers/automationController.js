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
 * Known third-party job aggregators, generic listing portals, and competing platforms.
 * Candidate Apply buttons must never direct applicants to generic job boards or competing aggregators.
 */
export const BLOCKED_AGGREGATOR_DOMAINS = [
  'caway.in',
  'naukri.com',
  'indeed.com',
  'indeed.co.in',
  'foundit.in',
  'monsterindia.com',
  'shine.com',
  'internshala.com',
  'freshersworld.com',
  'timesjobs.com',
  'instahyre.com',
  'hirist.com',
  'hirist.tech',
  'iimjobs.com',
  'glassdoor.com',
  'glassdoor.co.in',
  'simplyhired.com',
  'simplyhired.co.in',
  'jooble.org',
  'caclubindia.com',
  'casansaar.com',
  'taxguru.in',
  'cadwar.in',
  'unstop.com',
  'cutshort.io',
  'apna.co',
  'linkedin.com',
];

/**
 * URL shorteners and masking domains that obscure the true destination.
 */
export const BLOCKED_SHORTENER_DOMAINS = [
  'bit.ly',
  'tinyurl.com',
  't.co',
  'cutt.ly',
  'rb.gy',
  'shorturl.at',
  'is.gd',
  'ow.ly',
  'rebrand.ly',
  'buff.ly',
];

/**
 * Supported Application Form platforms commonly used by employers.
 * Note: A URL on these platforms confirms the technical interface type,
 * but manual verification is still required to confirm it was created by the stated employer.
 */
export const SUPPORTED_FORM_DOMAINS = [
  'forms.gle',
  'forms.office.com',
  'forms.microsoft.com',
  'typeform.com',
  'forms.zohopublic.com',
  'forms.zoho.com',
  'forms.zohopublic.in',
  'forms.zoho.in',
];

/**
 * Supported Enterprise Applicant Tracking Systems (ATS) used by employers.
 */
export const SUPPORTED_ATS_DOMAINS = [
  'myworkdayjobs.com',
  'workday.com',
  'greenhouse.io',
  'lever.co',
  'smartrecruiters.com',
  'darwinbox.in',
  'darwinbox.com',
  'keka.com',
  'talentlyft.com',
  'recruitee.com',
  'bamboohr.com',
  'jobvite.com',
  'taleo.net',
  'successfactors.com',
  'successfactors.eu',
  'oraclecloud.com',
  'sap.com',
  'ashbyhq.com',
  'rippling.com',
  'freshteam.com',
  'workable.com',
  'icims.com',
  'zohorecruit.com',
  'zohorecruit.in',
];

/**
 * Parse URL safely, extracting normalized hostname and pathname
 */
export function parseUrlDetails(urlStr) {
  if (!urlStr || typeof urlStr !== 'string') return null;
  let trimmed = urlStr.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = 'https://' + trimmed;
  }
  try {
    const parsed = new URL(trimmed);
    return {
      hostname: parsed.hostname.toLowerCase(),
      pathname: parsed.pathname || '/',
      search: parsed.search || '',
      fullUrl: parsed.href,
    };
  } catch {
    return null;
  }
}

/**
 * Validates whether a hostname matches a domain or its subdomains.
 * Prevents false positives where domain is in query string or an unrelated word.
 */
export function isHostMatchingDomain(hostname, targetDomain) {
  if (!hostname || !targetDomain) return false;
  const h = hostname.toLowerCase();
  const t = targetDomain.toLowerCase();
  return h === t || h.endsWith('.' + t);
}

export function isBlockedAggregator(hostname) {
  if (!hostname) return false;
  return BLOCKED_AGGREGATOR_DOMAINS.some((domain) => isHostMatchingDomain(hostname, domain));
}

export function isBlockedShortener(hostname) {
  if (!hostname) return false;
  return BLOCKED_SHORTENER_DOMAINS.some((domain) => isHostMatchingDomain(hostname, domain));
}

export function isSupportedApplicationPlatform(hostname, pathname) {
  if (!hostname) return false;
  if (isHostMatchingDomain(hostname, 'forms.gle')) return true;
  if (isHostMatchingDomain(hostname, 'docs.google.com') && (pathname || '').startsWith('/forms')) return true;
  if (SUPPORTED_FORM_DOMAINS.some((domain) => isHostMatchingDomain(hostname, domain))) return true;
  if (SUPPORTED_ATS_DOMAINS.some((domain) => isHostMatchingDomain(hostname, domain))) return true;
  return false;
}

export function doesHostMatchCompany(hostname, companyName) {
  if (!hostname || !companyName) return false;
  const cleanComp = companyName
    .toLowerCase()
    .replace(/\b(private|pvt|limited|ltd|llp|chartered|accountants|firm|and|co|company|corp|corporation|inc|india)\b/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim();

  const concatComp = cleanComp.replace(/\s+/g, '');
  if (concatComp.length >= 3 && hostname.includes(concatComp)) {
    return true;
  }

  const tokens = cleanComp.split(/\s+/).filter((t) => t.length >= 3);
  for (const token of tokens) {
    if (hostname.includes(token)) {
      return true;
    }
  }

  return false;
}

export function hasCareerSignals(hostname, pathname) {
  if (!hostname) return false;
  const hostParts = hostname.split('.');
  const subdomain = hostParts[0];
  const careerSubdomains = ['careers', 'career', 'jobs', 'job', 'talent', 'recruit', 'recruitment'];
  if (careerSubdomains.includes(subdomain)) {
    return true;
  }

  const p = (pathname || '').toLowerCase();
  const careerPaths = ['/careers', '/career', '/jobs', '/job/', '/openings', '/open-roles', '/vacancies', '/apply'];
  return careerPaths.some((cp) => p.includes(cp));
}

/**
 * Comprehensive destination evaluation using strict hostname parsing.
 * Evaluates whether a destination URL is supported and appropriate for candidates.
 * Note: Automated checks verify platform type; human verification (Verification Status = Verified)
 * is strictly required to confirm that the specific form, portal, or recruiter email belongs to the employer.
 */
export function evaluateApplicationDestination(urlStr, companyName = '') {
  const parsed = parseUrlDetails(urlStr);
  if (!parsed) {
    return {
      status: 'INVALID_URL',
      isAllowed: false,
      isSupported: false,
      reason: 'The provided application URL could not be parsed as a valid web address.',
    };
  }

  const { hostname, pathname } = parsed;

  if (isBlockedAggregator(hostname)) {
    return {
      status: 'BLOCKED_AGGREGATOR',
      isAllowed: false,
      isSupported: false,
      hostname,
      reason: `Application destination '${hostname}' is a third-party job aggregator or competing listing board. CA Dwar candidates must not be redirected to job aggregators.`,
    };
  }

  if (isBlockedShortener(hostname)) {
    return {
      status: 'BLOCKED_SHORTENER',
      isAllowed: false,
      isSupported: false,
      hostname,
      reason: `Application destination '${hostname}' is a URL shortener. Direct employer destination must be provided.`,
    };
  }

  if (isSupportedApplicationPlatform(hostname, pathname)) {
    return {
      status: 'SUPPORTED_PLATFORM',
      isAllowed: true,
      isSupported: true,
      hostname,
      reason: 'Supported employer application platform or official form provider.',
    };
  }

  const matchesCompany = doesHostMatchCompany(hostname, companyName);

  if (matchesCompany) {
    return {
      status: 'MATCHING_EMPLOYER_DOMAIN',
      isAllowed: true,
      isSupported: true,
      hostname,
      reason: 'Employer corporate domain matching the hiring entity name.',
    };
  }

  // 5. Unknown or unverified external domain
  // Even if an arbitrary domain has '/careers' or '/job' in its path, if it does not correlate
  // with the hiring company and is not a recognized ATS or official form, it cannot be trusted automatically.
  // It must be held for manual verification to protect candidates.
  return {
    status: 'UNVERIFIED_DESTINATION',
    isAllowed: false,
    isSupported: false,
    hostname,
    reason: `Application destination '${hostname}' is an unverified external domain. CA Dwar requires employer-controlled career portals, recognized ATS links, or official forms. Unverified destinations must be held for manual verification.`,
  };
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
        message: `Vacancy rejected: Verification Status must be 'Verified'. Current value is '${verificationStatus || 'None'}'. To protect candidates, employer identity, application destination (including Google Forms, ATS portals, and careers pages), and recruiter contact details must be manually verified and confirmed as employer-controlled before publishing.`,
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = recruiterEmail && emailRegex.test(recruiterEmail);

    // Safeguard: Strict Hostname Parsing & Destination Verification for Application Destination
    if (applicationLink) {
      const destEval = evaluateApplicationDestination(applicationLink, companyName);

      if (!destEval.isAllowed || !destEval.isSupported) {
        if (isEmailValid) {
          // Fall back cleanly to verified recruiter email destination and clear disallowed/unverified link
          applicationMethod = 'email';
          applicationLink = '';
        } else {
          // No verified employer application channel available: reject publication and hold for manual verification
          return res.status(400).json({
            success: false,
            message: `Vacancy rejected: ${destEval.reason}`,
          });
        }
      } else {
        // Link format is supported and allowed: normalize protocol
        if (!applicationLink.startsWith('http://') && !applicationLink.startsWith('https://')) {
          applicationLink = 'https://' + applicationLink;
        }
      }
    }

    // Require at least one verified application destination or verified recruiter email
    if (!applicationLink && !isEmailValid) {
      return res.status(400).json({
        success: false,
        message: 'Vacancy rejected: No verified employer application destination or verified recruiter email was provided. Vacancies must contain either a confirmed employer career portal, recognized ATS link, confirmed employer form (Google/Microsoft), or verified recruiter email to be published.',
      });
    }

    if (applicationLink) {
      applicationMethod = 'external';
    } else if (isEmailValid) {
      applicationMethod = 'email';
    } else {
      applicationMethod = 'internal';
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
