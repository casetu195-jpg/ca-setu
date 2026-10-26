import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import { useAuth } from '../context/AuthContext';
import VerifiedBadge from '../components/common/VerifiedBadge';
import ApplicationModal from '../components/common/ApplicationModal';
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
} from 'lucide-react';

export default function JobDetails() {
  const { id } = useParams();
  const { getJobById, getCompanyById, isJobSaved, toggleSaveJob, hasApplied } = useJobs();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [copyAlert, setCopyAlert] = useState(false);

  const job = getJobById(id);

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
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

  const company = getCompanyById(job.companyId) || {
    name: job.companyName || 'Verified CA Firm',
    isVerified: true,
    city: job.city,
    description: 'Prominent financial services & accounting firm.',
    address: 'Mumbai, India',
    website: 'https://casetu.com',
  };

  const displayName = job.companyName || company.name;

  const isSaved = isJobSaved(job.id);
  const alreadyApplied = hasApplied(job.id, user?.id, user?.email);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-24 md:pb-12">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
        <Link to="/" className="hover:text-[#176FA8]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to={getCategoryLink()} className="hover:text-[#176FA8]">
          {job.categoryName || 'Opportunities'}
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

      {/* 2. Top Header Hero Card */}
      <div className="bg-white border border-[#DCE5ED] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-5">
            {/* Company Logo / Avatar */}
            <div className="w-16 h-16 rounded-xl bg-slate-100 border border-[#DCE5ED] flex items-center justify-center font-bold text-lg text-[#173B63] shrink-0 overflow-hidden shadow-2xs">
              {company.logo ? (
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              ) : null}
              <span className={company.logo && !job.companyName ? 'hidden' : 'block'}>
                {displayName.substring(0, 2).toUpperCase()}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center flex-wrap gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#176FA8] bg-[#EEF6FC] px-2.5 py-0.5 rounded-full border border-[#DCE5ED]">
                  {job.categoryName || 'Articleship'}
                </span>
                {company.isVerified && <VerifiedBadge size="sm" />}
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-[#152B45] leading-snug">
                {job.title}
              </h1>

              <div className="flex items-center flex-wrap gap-3 text-sm text-slate-600">
                <span className="font-bold text-slate-900">
                  {displayName}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {job.city} ({job.workMode})
                </span>
                <span>·</span>
                <span className="font-bold text-[#173B63]">
                  {formatStipend(job)}
                </span>
              </div>
            </div>
          </div>

          {/* Share & Save Buttons */}
          <div className="flex items-center gap-2 self-start">
            <button
              onClick={handleShare}
              title="Share Opportunity"
              className="p-2.5 rounded-xl border border-[#DCE5ED] text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {job.applicationLink && (
              <a
                href={job.applicationLink}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Apply on Official Portal</span>
              </a>
            )}
            {job.recruiterEmail && (
              <a
                href={`mailto:${job.recruiterEmail}?subject=Application for ${job.title}`}
                className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 truncate px-2"
                title={`Email CV to ${job.recruiterEmail}`}
              >
                <span className="truncate">Email CV: {job.recruiterEmail}</span>
              </a>
            )}

            <button
              onClick={() => toggleSaveJob(job.id)}
              title={isSaved ? 'Saved' : 'Save'}
              className="p-2.5 rounded-xl border border-[#DCE5ED] text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#176FA8] text-[#176FA8]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Domain</span>
            <span className="font-bold text-[#152B45] text-sm mt-0.5 block">{job.domain}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Eligibility</span>
            <span className="font-bold text-[#152B45] text-sm mt-0.5 block">{job.requiredGroups} Cleared</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Vacancies</span>
            <span className="font-bold text-[#152B45] text-sm mt-0.5 block">{job.openVacancies || 1} Openings</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Application Deadline</span>
            <span className="font-bold text-[#152B45] text-sm mt-0.5 block text-amber-700">{job.deadline || '15 days left'}</span>
          </div>
        </div>
      </div>

      {/* 3. Main Body: Description & Details + Right Action Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Full Job Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section: About the Role */}
          <div className="bg-white border border-[#DCE5ED] rounded-2xl p-6 sm:p-7 shadow-2xs space-y-4">
            <h2 className="text-lg font-bold text-[#173B63] flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#176FA8]" />
              About the Role
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Section: Key Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="bg-white border border-[#DCE5ED] rounded-2xl p-6 sm:p-7 shadow-2xs space-y-4">
              <h2 className="text-lg font-bold text-[#173B63]">
                Key Responsibilities
              </h2>
              <ul className="space-y-2.5">
                {job.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-[#16805C] shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Section: What You Will Learn */}
          {job.whatYouWillLearn && job.whatYouWillLearn.length > 0 && (
            <div className="bg-[#EEF6FC]/60 border border-[#176FA8]/20 rounded-2xl p-6 sm:p-7 shadow-2xs space-y-4">
              <h2 className="text-lg font-bold text-[#173B63]">
                What You Will Learn & Exposure
              </h2>
              <ul className="space-y-2.5">
                {job.whatYouWillLearn.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[#152B45]">
                    <span className="w-2 h-2 rounded-full bg-[#176FA8] shrink-0 mt-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Section: Required & Preferred Skills */}
          <div className="bg-white border border-[#DCE5ED] rounded-2xl p-6 sm:p-7 shadow-2xs space-y-5">
            <h2 className="text-lg font-bold text-[#173B63]">
              Required Skills & Competencies
            </h2>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Mandatory Prerequisites:
              </h4>
              <div className="flex flex-wrap gap-2">
                {(job.requiredSkills || ['Ind AS', 'MS Excel', 'Financial Accounting']).map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {job.preferredSkills && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Good-to-Have Skills:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {job.preferredSkills.map((ps, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-[#EEF6FC] text-[#176FA8] text-xs font-semibold rounded-lg border border-[#DCE5ED]"
                    >
                      {ps}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section: About the Company */}
          <div className="bg-white border border-[#DCE5ED] rounded-2xl p-6 sm:p-7 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#173B63]">
                About {company.name}
              </h2>
              {company.isVerified && <VerifiedBadge size="sm" />}
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {company.description}
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-500">
              <span><strong>FRN / CIN:</strong> {company.registrationNumber}</span>
              <span><strong>Headquarters:</strong> {company.city}</span>
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#176FA8] hover:underline"
                >
                  Visit Official Website &rarr;
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Desktop Application Sticky Box */}
        <div className="hidden lg:block sticky top-24 space-y-4">
          <div className="bg-white border border-[#DCE5ED] rounded-2xl p-6 shadow-sm space-y-6">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-medium">Offered Stipend / CTC</span>
              <div className="text-2xl font-extrabold text-[#173B63]">
                {formatStipend(job)}
              </div>
              <p className="text-xs text-slate-400">
                Posted {job.postedTime || 'recently'} · {job.applicantCount || 0} applicants so far
              </p>
            </div>

            {/* Apply Button */}
            {alreadyApplied ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-1">
                <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto" />
                <p className="text-sm font-bold text-emerald-800">Application Submitted</p>
                <p className="text-xs text-emerald-700">
                  Track in your student applications tab.
                </p>
              </div>
            ) : (
              <button
                onClick={() => setIsApplyModalOpen(true)}
                className="w-full py-3.5 bg-[#173B63] hover:bg-[#176FA8] text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Apply for Opportunity</span>
              </button>
            )}

            {job.applicationLink && (
              <a
                href={job.applicationLink}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Apply on Official Portal</span>
              </a>
            )}
            {job.recruiterEmail && (
              <a
                href={`mailto:${job.recruiterEmail}?subject=Application for ${job.title}`}
                className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 truncate px-2"
                title={`Email CV to ${job.recruiterEmail}`}
              >
                <span className="truncate">Email CV: {job.recruiterEmail}</span>
              </a>
            )}

            <button
              onClick={() => toggleSaveJob(job.id)}
              className="w-full py-2.5 border border-[#DCE5ED] text-[#152B45] text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#176FA8] text-[#176FA8]' : ''}`} />
              <span>{isSaved ? 'Saved in Bookmarks' : 'Save for Later'}</span>
            </button>

            <div className="pt-4 border-t border-slate-100 space-y-3 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified ICAI Firm credentials checked</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#176FA8] shrink-0" />
                <span>Strict anti-duplicate application rules enforced</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Mobile Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#DCE5ED] p-3 px-4 flex items-center justify-between gap-3 lg:hidden shadow-lg">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-[#173B63]">{formatStipend(job)}</span>
          <span className="text-[10px] text-slate-500 truncate max-w-[120px]">{company.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleSaveJob(job.id)}
            className="p-2.5 border border-[#DCE5ED] rounded-xl text-slate-600"
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#176FA8] text-[#176FA8]' : ''}`} />
          </button>

          {alreadyApplied ? (
            <span className="px-4 py-2.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200">
              Applied ✓
            </span>
          ) : (
            <button
              onClick={() => setIsApplyModalOpen(true)}
              className="px-5 py-2.5 bg-[#173B63] text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Apply Now
            </button>
          )}
        </div>
      </div>

      {/* Application Modal */}
      <ApplicationModal
        job={job}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />
    </div>
  );
}
