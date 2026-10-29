import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import { useAuth } from '../context/AuthContext';
import { jobsAPI } from '../services/api';
import VerifiedBadge from '../components/common/VerifiedBadge';
import ApplicationModal from '../components/common/ApplicationModal';
import SEO from '../components/common/SEO';
import { formatStipend, formatDate } from '../utils/helpers';
import {
  MapPin,
  Building2,
  Calendar,
  Clock,
  Briefcase,
  GraduationCap,
  Bookmark,
  Share2,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  Users,
  Send,
  ExternalLink,
  Mail,
  Copy,
  Check,
  Layers,
  FileText,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export default function JobDetails() {
  const { id } = useParams();
  const { getJobById, getCompanyById, isJobSaved, toggleSaveJob, hasApplied } = useJobs();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [localJob, setLocalJob] = useState(() => getJobById(id));
  const [loading, setLoading] = useState(!localJob);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [copyAlert, setCopyAlert] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [emailInitiated, setEmailInitiated] = useState(false);

  // Fallback direct fetch if job not in memory/cached context
  useEffect(() => {
    const found = getJobById(id);
    if (found) {
      setLocalJob(found);
      setLoading(false);
    } else {
      setLoading(true);
      jobsAPI
        .getJobById(id)
        .then((res) => {
          if (res.data?.success && res.data.job) {
            setLocalJob(res.data.job);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [id, getJobById]);

  const job = localJob;

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#173B63] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-600">Loading opportunity details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <SEO
          title="Opportunity Not Available | CA Dwar"
          description="This opportunity has expired or is no longer accepting applications on CA Dwar."
          canonicalPath={`/jobs/${id}`}
          noindex={true}
        />
        <h2 className="text-2xl font-bold text-[#173B63]">Opportunity Not Found</h2>
        <p className="text-sm text-slate-600">
          The requested job vacancy might have expired or been removed by the employer.
        </p>
        <Link
          to="/articleship"
          className="inline-block px-5 py-2.5 bg-[#173B63] text-white text-sm font-semibold rounded-xl"
        >
          Browse Active Openings
        </Link>
      </div>
    );
  }

  const rawCompany = getCompanyById(job.companyId?._id || job.companyId?.id || job.companyId);
  const company = rawCompany || (job.companyId && typeof job.companyId === 'object' ? job.companyId : {
    name: job.companyName || 'Verified Partner Firm',
    isVerified: true,
    city: job.city || 'Mumbai',
    description: 'Prominent financial services & accounting firm.',
    address: 'Mumbai, India',
    website: 'https://cadwar.in',
  });

  const displayName = job.companyName || company.name || 'Hiring Firm';

  // Check if vacancy is expired
  const isExpired =
    job.status !== 'Published' ||
    (job.expiresAt && new Date(job.expiresAt) < new Date());

  // Determine effective application method (with backward-compatibility)
  const appMethod =
    job.applicationMethod ||
    (job.applicationLink && job.applicationLink.trim()
      ? 'external'
      : job.recruiterEmail && job.recruiterEmail.trim()
      ? 'email'
      : 'internal');

  let safeExternalUrl = '';
  if (appMethod === 'external') {
    const rawLink = (job.applicationLink || '').trim();
    if (rawLink) {
      safeExternalUrl =
        rawLink.startsWith('http://') || rawLink.startsWith('https://')
          ? rawLink
          : `https://${rawLink}`;
    }
  }

  // Email subject and body formatting
  const mailSubject = encodeURIComponent(`Application for ${job.title} - ${displayName}`);
  const mailBody = encodeURIComponent(
    `Dear Hiring Team at ${displayName},\n\nI am writing to apply for the ${job.title} vacancy listed on CA Dwar (Ref: ${job.id || job._id || id}).\n\nPlease find my resume and professional credentials attached for your review.\n\nKey Details:\n- Name: ${user?.name || '[Your Name]'}\n- Contact: ${user?.phone || '[Contact Number]'}\n- Email: ${user?.email || '[Your Email]'}\n\nBest regards,\n${user?.name || '[Your Name]'}`
  );
  const mailtoHref = `mailto:${job.recruiterEmail || ''}?subject=${mailSubject}&body=${mailBody}`;
  const gmailWebHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(job.recruiterEmail || '')}&su=${mailSubject}&body=${mailBody}`;

  const handleCopyEmail = (e) => {
    e?.preventDefault();
    if (job.recruiterEmail && navigator.clipboard) {
      navigator.clipboard.writeText(job.recruiterEmail);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  };

  const handleEmailApply = (e) => {
    e?.preventDefault();
    setEmailInitiated(true);
    window.location.href = mailtoHref;
  };

  const handleApplyClick = () => {
    if (isExpired) return;
    if (appMethod === 'external') {
      if (safeExternalUrl) {
        window.open(safeExternalUrl, '_blank', 'noopener,noreferrer');
      }
    } else if (appMethod === 'email') {
      handleEmailApply();
    } else {
      setIsApplyModalOpen(true);
    }
  };

  const isSaved = isJobSaved(job.id || job._id);
  const alreadyApplied = hasApplied(job.id || job._id, user?.id, user?.email);

  // Regex extractions for structured fields from description if not stored separately
  const extractedJoiningDate =
    job.joiningDate ||
    job.description?.match(/Joining Date:\s*([^\n\r]+)/i)?.[1]?.trim() ||
    null;

  const extractedDeadline =
    job.applicationDeadline ||
    job.description?.match(/Application Deadline:\s*([^\n\r]+)/i)?.[1]?.trim() ||
    job.deadline ||
    null;

  const candidateProfileMatch = job.description?.match(
    /(?:Candidate Profile|Candidate Requirements):\s*([\s\S]*?)(?=\n\s*(?:Application Instructions|Application Email|CA Dwar|Important Note|$))/i
  );
  const candidateProfileText = candidateProfileMatch ? candidateProfileMatch[1].trim() : null;

  const appInstructionsMatch = job.description?.match(
    /Application Instructions:\s*([\s\S]*?)(?=\n\s*(?:Application Email|CA Dwar|Important Note|$))/i
  );
  const appInstructionsText = appInstructionsMatch ? appInstructionsMatch[1].trim() : null;

  const cleanDescription = (job.description || '').replace(/\s+/g, ' ').trim();
  const seoTitle = `${job.title} at ${displayName} | CA Dwar`;
  const seoDescription =
    cleanDescription.length > 155
      ? `${cleanDescription.substring(0, 152)}...`
      : cleanDescription || `Apply for ${job.title} vacancy at ${displayName} on CA Dwar.`;

  const jobPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description || seoDescription,
    datePosted: job.createdAt ? new Date(job.createdAt).toISOString() : new Date().toISOString(),
    validThrough: job.expiresAt ? new Date(job.expiresAt).toISOString() : undefined,
    employmentType: job.category === 'ca-jobs' ? 'FULL_TIME' : 'INTERN',
    hiringOrganization: {
      '@type': 'Organization',
      name: displayName,
      sameAs: company.website && !company.website.includes('casetu.com') ? company.website : 'https://cadwar.in',
      logo: 'https://cadwar.in/favicon-512x512.png',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.city || 'India',
        addressCountry: 'IN',
      },
    },
    baseSalary:
      job.stipendMin && job.stipendMax
        ? {
            '@type': 'MonetaryAmount',
            currency: 'INR',
            value: {
              '@type': 'QuantitativeValue',
              minValue: job.stipendMin,
              maxValue: job.stipendMax,
              unitText: job.stipendPeriod === 'Per Annum' ? 'YEAR' : 'MONTH',
            },
          }
        : undefined,
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopyAlert(true);
      setTimeout(() => setCopyAlert(false), 2500);
    }
  };

  const getCategoryLink = () => {
    if (job.category === 'industrial-training') return '/industrial-training';
    if (job.category === 'ca-jobs') return '/ca-jobs';
    return '/articleship';
  };

  const categoryLabel =
    job.category === 'industrial-training'
      ? 'CA Industrial Training'
      : job.category === 'ca-jobs'
      ? 'CA Qualified Job'
      : 'CA Articleship';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-24 md:pb-12">
      <SEO
        title={seoTitle}
        description={seoDescription}
        canonicalPath={`/jobs/${job.id || job._id || id}`}
        jsonLd={jobPostingJsonLd}
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
        <Link to="/" className="hover:text-[#176FA8]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to={getCategoryLink()} className="hover:text-[#176FA8]">
          {categoryLabel}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#152B45] font-semibold truncate max-w-xs">{job.title}</span>
      </nav>

      {/* Copy link toast */}
      {copyAlert && (
        <div className="fixed top-20 right-6 z-50 bg-[#173B63] text-white px-4 py-2 rounded-xl shadow-lg text-xs font-semibold animate-in fade-in">
          Link copied to clipboard!
        </div>
      )}

      {/* PART 2.A: Top Job Summary Section */}
      <div className="bg-white border border-[#DCE5ED] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5">
            {/* Company Logo / Avatar Fallback */}
            <div className="w-16 h-16 rounded-xl bg-[#F0F7FF] border border-[#DCE5ED] flex items-center justify-center font-black text-xl text-[#173B63] shrink-0 overflow-hidden shadow-2xs">
              {company.logo ? (
                <img
                  src={company.logo}
                  alt={displayName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              ) : null}
              <span className={company.logo ? 'hidden' : 'block'}>
                {displayName.slice(0, 2).toUpperCase()}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center flex-wrap gap-2">
                <Link
                  to={getCategoryLink()}
                  className="text-[11px] font-bold uppercase tracking-wider text-[#173B63] bg-[#F0F7FF] px-2.5 py-0.5 rounded-full border border-[#DCE5ED] hover:bg-[#E2E8F0] transition-colors"
                >
                  {categoryLabel}
                </Link>
                {company.isVerified && <VerifiedBadge size="sm" />}
                {isExpired && (
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                    Closed
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-[#173B63] leading-snug">
                {job.title}
              </h1>

              <div className="flex items-center flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-slate-600">
                <span className="font-bold text-slate-900">{displayName}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {job.city || 'India'} {job.workMode ? `(${job.workMode})` : ''}
                </span>
                <span>·</span>
                <span className="font-bold text-[#173B63]">
                  {formatStipend(job)}
                </span>
              </div>
            </div>
          </div>

          {/* Top Header Actions: Prominent Apply Button + Share + Save */}
          <div className="flex items-center gap-3 shrink-0 self-stretch sm:self-auto justify-end border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
            <button
              onClick={handleShare}
              title="Share Opportunity"
              className="p-3 rounded-xl border border-[#DCE5ED] text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleSaveJob(job.id || job._id)}
              title={isSaved ? 'Saved' : 'Save'}
              className="p-3 rounded-xl border border-[#DCE5ED] text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#173B63] text-[#173B63]' : ''}`} />
            </button>

            {/* Prominent Header Apply Button */}
            {isExpired ? (
              <button
                disabled
                className="px-6 py-3 bg-slate-200 text-slate-500 font-bold text-xs rounded-xl cursor-not-allowed"
              >
                Applications Closed
              </button>
            ) : appMethod === 'external' ? (
              <a
                href={safeExternalUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#173B63] hover:bg-[#0F2642] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Apply on Official Portal ↗</span>
              </a>
            ) : appMethod === 'email' ? (
              <button
                onClick={handleEmailApply}
                className="px-6 py-3 bg-[#173B63] hover:bg-[#0F2642] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>Apply via Email (Send CV)</span>
              </button>
            ) : alreadyApplied ? (
              <span className="px-5 py-3 bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs rounded-xl flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Application Submitted ✓</span>
              </span>
            ) : (
              <button
                onClick={() => setIsApplyModalOpen(true)}
                className="px-6 py-3 bg-[#173B63] hover:bg-[#0F2642] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Apply on CA Dwar</span>
              </button>
            )}
          </div>
        </div>

        {/* PART 2.B: Individual Information Cards Grid (8 Key Attributes) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-100">
          {/* 1. Number of Vacancies */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
              <Users className="w-3.5 h-3.5 text-[#173B63]" />
              <span>Vacancies</span>
            </div>
            <p className="font-bold text-xs sm:text-sm text-[#173B63]">
              {job.openVacancies ? `${job.openVacancies} Openings` : 'Not Specified'}
            </p>
          </div>

          {/* 2. Stipend or Salary (clearly distinguishing monthly vs annual) */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5 text-[#173B63]" />
              <span>{job.stipendPeriod === 'Per Annum' ? 'Annual Compensation' : 'Monthly Stipend'}</span>
            </div>
            <p className="font-bold text-xs sm:text-sm text-[#173B63]">
              {formatStipend(job)}
            </p>
          </div>

          {/* 3. Job Role / Position */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
              <Briefcase className="w-3.5 h-3.5 text-[#173B63]" />
              <span>Role / Position</span>
            </div>
            <p className="font-bold text-xs sm:text-sm text-[#173B63] truncate" title={job.title}>
              {job.title}
            </p>
          </div>

          {/* 4. Location & Work Mode */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-[#173B63]" />
              <span>Location & Mode</span>
            </div>
            <p className="font-bold text-xs sm:text-sm text-[#173B63]">
              {job.city || 'India'} {job.workMode ? `(${job.workMode})` : ''}
            </p>
          </div>

          {/* 5. Department / Domain */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-[#173B63]" />
              <span>Domain / Function</span>
            </div>
            <p className="font-bold text-xs sm:text-sm text-[#173B63] truncate" title={job.domain || 'Finance'}>
              {job.domain || 'Finance & Accounting'}
            </p>
          </div>

          {/* 6. Eligibility Criteria */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
              <GraduationCap className="w-3.5 h-3.5 text-[#173B63]" />
              <span>Eligibility</span>
            </div>
            <p className="font-bold text-[11px] sm:text-xs text-[#173B63] leading-snug">
              {job.category === 'industrial-training'
                ? 'CA Finalist with min 12m articleship'
                : job.eligibility || (job.requiredGroups ? `${job.requiredGroups} Cleared` : 'CA Inter Cleared')}
            </p>
          </div>

          {/* 7. Joining Date (from field or extracted) */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5 text-[#173B63]" />
              <span>Expected Joining</span>
            </div>
            <p className="font-bold text-xs sm:text-sm text-[#173B63]">
              {extractedJoiningDate || 'Immediate / As per ICAI'}
            </p>
          </div>

          {/* 8. Application Deadline */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-[#854D0E]" />
              <span>Application Deadline</span>
            </div>
            <p className="font-bold text-xs sm:text-sm text-[#854D0E]">
              {extractedDeadline || 'Active Opportunity'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Description & Structured Content (Left) + Sticky Application Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: PART 2.C - Organized Job Description */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: About the Role */}
          <div className="bg-white border border-[#DCE5ED] rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-[#173B63] flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#173B63]" />
              <span>About the Role</span>
            </h2>
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line font-normal space-y-2">
              {job.description}
            </div>
          </div>

          {/* Section 2: Key Responsibilities (if available) */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="bg-white border border-[#DCE5ED] rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-[#173B63] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#173B63]" />
                <span>Key Responsibilities</span>
              </h2>
              <ul className="space-y-2.5">
                {job.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Section 3: Candidate Profile (if extracted or available) */}
          {candidateProfileText && (
            <div className="bg-white border border-[#DCE5ED] rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-[#173B63] flex items-center gap-2">
                <Users className="w-5 h-5 text-[#173B63]" />
                <span>Candidate Profile & Prerequisites</span>
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4">
                {candidateProfileText}
              </div>
            </div>
          )}

          {/* Section 4: Eligibility and Platform Screening Requirements */}
          <div className="bg-white border border-[#DCE5ED] rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-[#173B63] flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#173B63]" />
              <span>Eligibility & Screening Guidelines</span>
            </h2>

            <div className="space-y-3">
              {job.category === 'industrial-training' ? (
                <div className="p-4 bg-[#F0F7FF] border border-[#DCE5ED] rounded-xl space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#173B63]">
                    <span>CA Dwar Platform Screening Standard</span>
                  </div>
                  <p className="text-sm font-bold text-[#173B63]">
                    CA Finalist with min 12 months of completed articleship
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Mandatory practical training guideline as per ICAI Industrial Training regulations.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
                    <span>Standard Eligibility</span>
                  </div>
                  <p className="text-sm font-bold text-[#173B63]">
                    {job.eligibility || (job.category === 'ca-jobs' ? 'Qualified Chartered Accountant' : 'CA Intermediate cleared')}
                  </p>
                </div>
              )}

              {(job.requiredGroups || (job.attempts && job.attempts !== 'Any')) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {job.requiredGroups && (
                    <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                        Required Groups
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-[#173B63]">{job.requiredGroups}</span>
                    </div>
                  )}
                  {job.attempts && job.attempts !== 'Any' && (
                    <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                        Attempt Criteria
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-[#173B63]">{job.attempts}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Section 5: Application Instructions (if extracted or available) */}
          {appInstructionsText && (
            <div className="bg-white border border-[#DCE5ED] rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-[#173B63] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#173B63]" />
                <span>Application Instructions</span>
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4">
                {appInstructionsText}
              </div>
            </div>
          )}

          {/* Section 6: Required & Preferred Skills */}
          {job.requiredSkills && job.requiredSkills.length > 0 && (
            <div className="bg-white border border-[#DCE5ED] rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-[#173B63]">
                Required Skills & Functional Exposure
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-[#F8FAFC] text-slate-800 text-xs font-semibold rounded-lg border border-[#E2E8F0]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Section 7: About the Hiring Entity */}
          <div className="bg-white border border-[#DCE5ED] rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#173B63]">
                About {displayName}
              </h2>
              {company.isVerified && <VerifiedBadge size="sm" />}
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {company.description || `${displayName} is an established organization offering professional training and career growth opportunities.`}
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-500">
              {company.registrationNumber && (
                <span><strong>Registration / CIN / FRN:</strong> {company.registrationNumber}</span>
              )}
              {company.city && (
                <span><strong>Location:</strong> {company.city}</span>
              )}
              {company.website && !company.website.includes('casetu.com') && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#176FA8] hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Visit Official Site</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* PART 2.D: Secondary Apply Action Area (At bottom of description) */}
          <div className="bg-[#F8FAFC] border-2 border-[#DCE5ED] rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-base font-bold text-[#173B63]">
                Ready to submit your application?
              </h3>
              <p className="text-xs text-slate-600">
                Deadline: <strong>{extractedDeadline || 'Active Opening'}</strong> · Role: {job.title}
              </p>
            </div>

            <div className="shrink-0 w-full sm:w-auto">
              {isExpired ? (
                <button
                  disabled
                  className="w-full sm:w-auto px-6 py-3 bg-slate-200 text-slate-500 font-bold text-xs rounded-xl cursor-not-allowed"
                >
                  Applications Closed
                </button>
              ) : appMethod === 'external' ? (
                <a
                  href={safeExternalUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 bg-[#173B63] hover:bg-[#0F2642] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Apply on Official Portal ↗</span>
                </a>
              ) : appMethod === 'email' ? (
                <button
                  onClick={handleEmailApply}
                  className="w-full sm:w-auto px-6 py-3 bg-[#173B63] hover:bg-[#0F2642] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Apply via Email (Send CV)</span>
                </button>
              ) : alreadyApplied ? (
                <span className="w-full sm:w-auto px-5 py-3 bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Application Submitted ✓</span>
                </span>
              ) : (
                <button
                  onClick={() => setIsApplyModalOpen(true)}
                  className="w-full sm:w-auto px-6 py-3 bg-[#173B63] hover:bg-[#0F2642] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Apply on CA Dwar</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: PART 2.D - Desktop Application Sticky Box */}
        <div className="hidden lg:block sticky top-24 space-y-4">
          <div className="bg-white border border-[#DCE5ED] rounded-2xl p-6 shadow-xs space-y-6">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-medium">Offered Stipend / CTC</span>
              <div className="text-2xl font-black text-[#173B63]">
                {formatStipend(job)}
              </div>
              <p className="text-xs text-slate-400">
                Posted {job.postedTime || 'recently'} · {job.applicantCount || 0} applicants so far
              </p>
            </div>

            {/* Expired State */}
            {isExpired ? (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-center space-y-1">
                <AlertCircle className="w-5 h-5 text-rose-600 mx-auto" />
                <p className="text-xs font-bold text-rose-800">Applications Closed</p>
                <p className="text-[11px] text-rose-600">This vacancy is no longer accepting new applicants.</p>
              </div>
            ) : appMethod === 'external' ? (
              /* Method 1: External Application Link */
              <div className="space-y-3">
                {safeExternalUrl ? (
                  <a
                    href={safeExternalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 bg-[#173B63] hover:bg-[#0F2642] text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Apply on Official Portal ↗</span>
                  </a>
                ) : (
                  <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Application link is not configured for this vacancy.</span>
                  </div>
                )}
                <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                  You will continue to the employer's official careers portal.
                </p>
              </div>
            ) : appMethod === 'email' ? (
              /* Method 2: Recruiter / Firm Email (PART 4 FIX) */
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleEmailApply}
                  className="w-full py-3.5 bg-[#173B63] hover:bg-[#0F2642] text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Apply via Email (Send CV)</span>
                </button>

                {/* Feedback indicator when clicked */}
                {emailInitiated && (
                  <div className="p-3 bg-[#F0F7FF] border border-[#DCE5ED] rounded-xl text-xs text-[#173B63] space-y-1.5 animate-in fade-in">
                    <p className="font-bold flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#176FA8]" />
                      <span>Opening email draft in your default client...</span>
                    </p>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      If your mail app didn't launch automatically, use the direct Gmail button below or copy the recruiter's address.
                    </p>
                  </div>
                )}

                {/* Direct Webmail (Gmail) Fallback Button */}
                <a
                  href={gmailWebHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-white border border-[#DCE5ED] hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-2xs"
                >
                  <Mail className="w-3.5 h-3.5 text-red-500" />
                  <span>Open in Gmail (Web) ↗</span>
                </a>

                {/* Application Email Panel with Copy Email Action */}
                <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="font-semibold text-slate-700">Application Email:</span>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="text-[#176FA8] hover:underline font-bold flex items-center gap-1"
                    >
                      {copiedEmail ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedEmail ? 'Copied!' : 'Copy Email'}</span>
                    </button>
                  </div>
                  <div className="font-bold text-[#173B63] text-xs break-all select-all bg-white p-2 rounded-lg border border-[#E2E8F0]">
                    {job.recruiterEmail}
                  </div>
                  <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 leading-relaxed font-medium">
                    ⚠️ <strong>Important:</strong> Attach your resume/CV before clicking Send. Opening an email draft does not submit your application until you send it.
                  </div>
                </div>
              </div>
            ) : (
              /* Method 3: Direct Platform Application */
              <div className="space-y-2">
                {alreadyApplied ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-1">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                    <p className="text-sm font-bold text-emerald-800">Application Recorded ✓</p>
                    <p className="text-xs text-emerald-700">
                      Saved in CA Dwar database. Track status in your student dashboard.
                    </p>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setIsApplyModalOpen(true)}
                      className="w-full py-3.5 bg-[#173B63] hover:bg-[#0F2642] text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Apply on CA Dwar</span>
                    </button>
                    <p className="text-[11px] text-slate-400 text-center">
                      Direct 1-click submission recorded in platform database.
                    </p>
                  </>
                )}
              </div>
            )}

            <button
              onClick={() => toggleSaveJob(job.id || job._id)}
              className="w-full py-2.5 border border-[#DCE5ED] text-[#173B63] text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#173B63] text-[#173B63]' : ''}`} />
              <span>{isSaved ? 'Saved in Bookmarks' : 'Save for Later'}</span>
            </button>

            <div className="pt-4 border-t border-slate-100 space-y-3 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified ICAI Firm & Company Listing</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#173B63] shrink-0" />
                <span>Strict anti-duplicate application screening</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PART 2.D: Mobile Responsive Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#DCE5ED] p-3 px-4 flex items-center justify-between gap-3 lg:hidden shadow-lg">
        <div className="flex flex-col">
          <span className="text-xs font-black text-[#173B63]">{formatStipend(job)}</span>
          <span className="text-[10px] text-slate-500 truncate max-w-[130px]">{displayName}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleSaveJob(job.id || job._id)}
            className="p-2.5 border border-[#DCE5ED] rounded-xl text-slate-600"
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#173B63] text-[#173B63]' : ''}`} />
          </button>

          {isExpired ? (
            <span className="px-4 py-2.5 bg-slate-100 text-slate-500 text-xs font-bold rounded-xl">
              Closed
            </span>
          ) : appMethod === 'external' ? (
            safeExternalUrl ? (
              <a
                href={safeExternalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-[#173B63] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <span>Apply on Portal ↗</span>
              </a>
            ) : (
              <span className="text-xs text-slate-500 font-medium">Link Unavailable</span>
            )
          ) : appMethod === 'email' ? (
            <button
              onClick={handleEmailApply}
              className="px-5 py-2.5 bg-[#173B63] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Apply via Email</span>
            </button>
          ) : alreadyApplied ? (
            <span className="px-4 py-2.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200">
              Applied ✓
            </span>
          ) : (
            <button
              onClick={() => setIsApplyModalOpen(true)}
              className="px-5 py-2.5 bg-[#173B63] text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Apply on CA Dwar
            </button>
          )}
        </div>
      </div>

      {/* Internal Application Modal */}
      <ApplicationModal
        job={job}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />
    </div>
  );
}
