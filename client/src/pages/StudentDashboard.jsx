import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobContext';
import JobCard from '../components/common/JobCard';
import SEO from '../components/common/SEO';
import { getStatusBadgeClass, formatDate } from '../utils/helpers';
import {
  FileText,
  Bookmark,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  User,
  AlertCircle,
  Briefcase,
} from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { applications, savedJobIds, jobs, getJobById, getCompanyById } = useJobs();

  // Filter student's applications
  const studentApps = applications.filter(
    (a) => a.studentId === user?.id || a.studentEmail === user?.email
  );

  const shortlistedCount = studentApps.filter(
    (a) => a.status === 'Shortlisted' || a.status === 'Interview' || a.status === 'Selected'
  ).length;

  const savedJobsList = jobs.filter((j) => savedJobIds.includes(j.id)).slice(0, 3);
  const recommendedJobs = jobs.filter((j) => j.status === 'Published').slice(0, 3);

  // Profile completion estimate
  const completionPercentage = user?.resumeUrl ? 95 : 75;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEO title="Student Dashboard | CA Dwar" noindex={true} />
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#173B63] to-[#176FA8] rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
              Student Workspace
            </span>
            <span className="text-blue-200 text-xs">
              CA {user?.caStage || 'Final'} Candidate
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Aman'}!
          </h1>
          <p className="text-sm text-blue-100 max-w-xl">
            Track your articleship and industrial training applications, update your CA achievements, and review interview calls.
          </p>
        </div>

        <Link
          to="/student/profile"
          className="px-5 py-2.5 bg-white text-[#173B63] hover:bg-[#EEF6FC] font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-2"
        >
          <User className="w-4 h-4 text-[#176FA8]" />
          <span>Edit CA Profile & Resume</span>
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white border border-[#DCE5ED] rounded-2xl p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Applications
            </span>
            <FileText className="w-4 h-4 text-[#176FA8]" />
          </div>
          <div className="text-2xl font-extrabold text-[#173B63]">
            {studentApps.length}
          </div>
          <p className="text-[11px] text-slate-500">Submitted to verified firms</p>
        </div>

        <div className="bg-white border border-[#DCE5ED] rounded-2xl p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Shortlisted / Calls
            </span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-purple-700">
            {shortlistedCount}
          </div>
          <p className="text-[11px] text-purple-600 font-medium">Active hiring stages</p>
        </div>

        <div className="bg-white border border-[#DCE5ED] rounded-2xl p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Saved Bookmarks
            </span>
            <Bookmark className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-[#173B63]">
            {savedJobIds.length}
          </div>
          <p className="text-[11px] text-slate-500">Opportunities saved</p>
        </div>

        <div className="bg-white border border-[#DCE5ED] rounded-2xl p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Profile Score
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">
            {completionPercentage}%
          </div>
          <p className="text-[11px] text-emerald-600 font-medium">All CA data verified</p>
        </div>
      </div>

      {/* Main Grid: Recent Applications & Saved Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Applications */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#173B63] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#176FA8]" />
              My Active Applications
            </h2>
            <Link
              to="/student/applications"
              className="text-xs font-bold text-[#176FA8] hover:underline"
            >
              View All ({studentApps.length}) &rarr;
            </Link>
          </div>

          {studentApps.length === 0 ? (
            <div className="bg-white border border-[#DCE5ED] rounded-2xl p-8 text-center space-y-3">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-[#173B63]">No applications submitted yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore articleship or industrial training openings and apply with one click.
              </p>
              <Link
                to="/articleship"
                className="inline-block px-4 py-2 bg-[#176FA8] text-white text-xs font-bold rounded-lg"
              >
                Browse Openings
              </Link>
            </div>
          ) : (
            <div className="bg-white border border-[#DCE5ED] rounded-2xl divide-y divide-slate-100 overflow-hidden shadow-2xs">
              {studentApps.slice(0, 4).map((app) => {
                const job = getJobById(app.jobId);
                const company = job ? getCompanyById(job.companyId) : null;
                return (
                  <div
                    key={app.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-700">
                          {company?.name || 'Verified CA Firm'}
                        </span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-slate-500">
                          Applied {formatDate(app.appliedDate)}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#173B63]">
                        {job?.title || 'CA Trainee Role'}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {job?.city} · {job?.domain}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-start sm:self-center">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusBadgeClass(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </span>
                      {job && (
                        <Link
                          to={`/jobs/${job.id}`}
                          className="text-xs font-semibold text-[#176FA8] hover:underline"
                        >
                          View Job
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Bookmarked Jobs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#173B63] flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-amber-500" />
              Saved Bookmarks
            </h2>
            <Link
              to="/student/saved-jobs"
              className="text-xs font-bold text-[#176FA8] hover:underline"
            >
              All ({savedJobsList.length}) &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {savedJobsList.length === 0 ? (
              <div className="bg-white border border-[#DCE5ED] rounded-2xl p-6 text-center text-xs text-slate-500">
                You haven't bookmarked any vacancies yet.
              </div>
            ) : (
              savedJobsList.map((job) => {
                const comp = getCompanyById(job.companyId);
                return (
                  <Link
                    key={job.id}
                    to={`/jobs/${job.id}`}
                    className="block bg-white border border-[#DCE5ED] rounded-xl p-4 hover:border-[#176FA8] hover:shadow-2xs transition-all space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-[#152B45] line-clamp-1">
                        {job.title}
                      </h4>
                      <span className="text-[10px] font-semibold text-[#176FA8] bg-blue-50 px-2 py-0.5 rounded-full shrink-0">
                        {job.categoryName}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 flex justify-between items-center">
                      <span>{comp?.name}</span>
                      <span className="font-extrabold text-[#173B63]">
                        {job.city}
                      </span>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Recommended Opportunities */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#173B63]">
              Recommended for Your CA Stage
            </h2>
            <p className="text-xs text-slate-500">
              Matches based on your clearance of Both Groups and interest in high finance.
            </p>
          </div>
          <Link
            to="/industrial-training"
            className="text-xs font-bold text-[#176FA8] hover:underline"
          >
            Explore More &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recommendedJobs.map((j) => (
            <JobCard key={j.id} job={j} />
          ))}
        </div>
      </div>
    </div>
  );
}
