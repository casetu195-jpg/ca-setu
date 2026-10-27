import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useJobs } from '../../context/JobContext';
import { useAuth } from '../../context/AuthContext';
import VerifiedBadge from './VerifiedBadge';
import { formatStipend } from '../../utils/helpers';
import { Bookmark, MapPin, Building2, Clock, Calendar, Sparkles, Briefcase } from 'lucide-react';

export default function JobCard({ job, onApplyClick }) {
  const { isJobSaved, toggleSaveJob, getCompanyById, hasApplied } = useJobs();
  const { user } = useAuth();
  const navigate = useNavigate();

  const company = getCompanyById(job.companyId) || {
    name: 'Premier CA Firm',
    isVerified: true,
    city: job.city,
    initials: 'CA',
  };

  const isSaved = isJobSaved(job.id);
  const alreadyApplied = hasApplied(job.id, user?.id, user?.email);

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaveJob(job.id);
  };

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'articleship':
        return 'bg-blue-50 text-[#176FA8] border-blue-200';
      case 'industrial-training':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'ca-jobs':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div
      onClick={() => navigate(`/jobs/${job.id}`)}
      className="group relative bg-white border border-[#DCE5ED] rounded-xl p-5 hover:border-[#176FA8] hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Top Badges & Bookmark */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center flex-wrap gap-2">
            {job.isFeatured && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                <Sparkles className="w-3 h-3 text-amber-600" />
                Featured
              </span>
            )}
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getCategoryBadgeClass(
                job.category
              )}`}
            >
              {job.categoryName || (job.category === 'articleship' ? 'Articleship' : job.category === 'industrial-training' ? 'Industrial Training' : 'CA Job')}
            </span>
          </div>

          <button
            onClick={handleBookmark}
            title={isSaved ? 'Remove from saved' : 'Save opportunity'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#176FA8] hover:bg-[#EEF6FC] transition-colors"
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#176FA8] text-[#176FA8]' : ''}`} />
          </button>
        </div>

        {/* Company Avatar & Role Title */}
        <div className="flex items-start gap-3.5 mb-3">
          <div className="w-12 h-12 rounded-lg bg-slate-100 border border-[#DCE5ED] flex items-center justify-center font-bold text-sm text-[#173B63] shrink-0 overflow-hidden shadow-2xs">
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
            <span className={company.logo ? 'hidden' : 'block'}>
              {job.companyName ? job.companyName.substring(0, 2).toUpperCase() : (company.initials || company.name?.substring(0, 2).toUpperCase() || 'CA')}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-[#152B45] group-hover:text-[#176FA8] transition-colors leading-snug line-clamp-2">
              {job.title}
            </h3>
            <div className="flex items-center flex-wrap gap-1.5 mt-1">
              <span className="text-sm font-semibold text-slate-800 truncate">
                {job.companyName || company.name}
              </span>
              {company.isVerified && <VerifiedBadge size="sm" showText={false} />}
            </div>
          </div>
        </div>

        {/* Tags: City, Work Mode, Domain, Stipend */}
        <div className="flex flex-wrap items-center gap-y-1.5 gap-x-3 text-xs text-slate-600 mb-3.5">
          <span className="flex items-center gap-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {job.city} · {job.workMode}
          </span>
          <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
            <Briefcase className="w-3 h-3 text-slate-500" />
            {job.domain}
          </span>
        </div>

        {/* Eligibility line */}
        <p className="text-xs text-slate-500 line-clamp-1 mb-3">
          <strong className="text-slate-700 font-medium">Eligibility:</strong>{' '}
          {job.category === 'industrial-training'
            ? 'CA Finalist with min 12 months of completed articleship'
            : (job.eligibility || 'Eligible CA Candidate')}
        </p>
      </div>

      {/* Footer Info: Stipend, Posted time, Application state */}
      <div className="pt-3 border-t border-[#DCE5ED] flex items-center justify-between gap-2 mt-auto">
        <div className="flex flex-col">
          <span className="text-sm font-extrabold text-[#173B63]">
            {formatStipend(job)}
          </span>
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3" /> {job.postedTime || 'Recently'} · {job.deadline || '15 days left'}
          </span>
        </div>

        {alreadyApplied ? (
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200">
            Applied ✓
          </span>
        ) : (
          <span className="text-xs font-semibold text-[#176FA8] group-hover:underline">
            View Details &rarr;
          </span>
        )}
      </div>
    </div>
  );
}
