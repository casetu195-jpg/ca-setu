import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobContext';
import VerifiedBadge from '../components/common/VerifiedBadge';
import SEO from '../components/common/SEO';
import { getStatusBadgeClass, formatDate } from '../utils/helpers';
import {
  Building2,
  Briefcase,
  Users,
  UserCheck,
  PlusCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export default function EmployerDashboard() {
  const { user } = useAuth();
  const { jobs, companies, applications, getCompanyById } = useJobs();

  // If Admin accesses, redirect to dedicated Admin Dashboard
  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Find employer's company (matches registered company or user company name)
  const company =
    companies.find((c) => c.id === user?.companyId || c._id === user?.companyId || c.userId === user?.id) || {
      name: user?.companyName || 'Registered CA Employer',
      firmType: 'Partnership / LLP',
      isVerified: false,
      initials: (user?.companyName || 'CA').slice(0, 2).toUpperCase(),
    };

  // Employer's jobs
  const employerJobs = jobs.filter((j) => {
    const compId = j.companyId?._id || j.companyId?.id || j.companyId;
    return compId === company.id || compId === company._id;
  });
  const activeJobs = employerJobs.filter((j) => j.status === 'Published');

  // Employer's applicants (strictly scoped to this employer's jobs via backend)
  const employerApplicants = applications;

  const shortlistedCount = employerApplicants.filter(
    (a) => a.status === 'Shortlisted' || a.status === 'Interview'
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEO title="Employer Dashboard | CA Dwar" noindex={true} />
      {/* Top Banner with Company Verification Status */}
      <div className="bg-white border border-[#DCE5ED] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#EEF6FC] border border-[#DCE5ED] flex items-center justify-center font-extrabold text-[#173B63] text-xl shrink-0">
            {company.initials || 'MO'}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#173B63]">
                {company.name}
              </h1>
              {company.isVerified ? (
                <VerifiedBadge size="sm" />
              ) : (
                <span className="text-xs bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-full border border-amber-200">
                  Verification Pending
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500">
              FRN / CIN: <strong className="text-slate-700">{company.registrationNumber}</strong> · {company.city} · {company.firmType}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/employer/company"
            className="px-4 py-2 border border-[#DCE5ED] hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
          >
            Company Profile
          </Link>
          <Link
            to="/employer/post-job"
            className="px-5 py-2 bg-[#173B63] hover:bg-[#176FA8] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Vacancy</span>
          </Link>
        </div>
      </div>

      {/* Verification Advisory if pending */}
      {!company.isVerified && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-800">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Firm Credentials Under Review by CA Dwar Admin</p>
            <p className="text-amber-700">
              Your Firm Registration Certificate is currently in the verification queue. You can save job drafts, and listings will be published as soon as verification completes.
            </p>
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white border border-[#DCE5ED] rounded-2xl p-5 shadow-2xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Active Jobs
          </span>
          <div className="text-2xl font-extrabold text-[#173B63]">
            {activeJobs.length}
          </div>
          <p className="text-[11px] text-slate-500">Live & accepting candidates</p>
        </div>

        <div className="bg-white border border-[#DCE5ED] rounded-2xl p-5 shadow-2xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Applicants
          </span>
          <div className="text-2xl font-extrabold text-[#176FA8]">
            {employerApplicants.length}
          </div>
          <p className="text-[11px] text-slate-500">Pre-screened CA profiles</p>
        </div>

        <div className="bg-white border border-[#DCE5ED] rounded-2xl p-5 shadow-2xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Shortlisted / Calls
          </span>
          <div className="text-2xl font-extrabold text-purple-700">
            {shortlistedCount}
          </div>
          <p className="text-[11px] text-purple-600 font-medium">In interview pipeline</p>
        </div>

        <div className="bg-white border border-[#DCE5ED] rounded-2xl p-5 shadow-2xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Trust Badge
          </span>
          <div className="text-2xl font-extrabold text-emerald-700">
            {company.isVerified ? 'Active ✓' : 'Pending'}
          </div>
          <p className="text-[11px] text-emerald-600 font-medium">
            {company.isVerified ? 'CA Dwar Verified Partner' : 'Verification underway'}
          </p>
        </div>
      </div>

      {/* Two-Column Grid: Active Jobs & Recent Applicants */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Active Vacancies */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#173B63] flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#176FA8]" />
              Posted Opportunities ({employerJobs.length})
            </h2>
            <Link
              to="/employer/jobs"
              className="text-xs font-bold text-[#176FA8] hover:underline"
            >
              Manage Listings &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {employerJobs.length === 0 ? (
              <div className="bg-white border border-[#DCE5ED] rounded-2xl p-8 text-center text-xs text-slate-500">
                You haven't posted any vacancies yet.
              </div>
            ) : (
              employerJobs.map((j) => (
                <div
                  key={j.id}
                  className="bg-white border border-[#DCE5ED] rounded-xl p-4 flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-[#152B45]">{j.title}</h4>
                    <p className="text-xs text-slate-500">
                      {j.categoryName} · {j.city} · {j.applicantCount || 0} applicants
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                        j.status === 'Published'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {j.status}
                    </span>
                    <Link
                      to={`/jobs/${j.id}`}
                      className="text-xs text-[#176FA8] font-bold hover:underline"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Recent Applicants Pipeline */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#173B63] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#176FA8]" />
              Candidate Pipeline ({employerApplicants.length})
            </h2>
            <Link
              to="/employer/applicants"
              className="text-xs font-bold text-[#176FA8] hover:underline"
            >
              Open Pipeline Dashboard &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {employerApplicants.length === 0 ? (
              <div className="bg-white border border-[#DCE5ED] rounded-2xl p-8 text-center text-xs text-slate-500">
                No candidate applications received yet.
              </div>
            ) : (
              employerApplicants.slice(0, 4).map((app) => (
                <div
                  key={app.id}
                  className="bg-white border border-[#DCE5ED] rounded-xl p-4 flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-[#152B45]">
                      {app.studentName}
                    </h4>
                    <p className="text-xs text-slate-500">
                      CA {app.caStage} · {app.groupsCleared} · {app.city}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadgeClass(
                      app.status
                    )}`}
                  >
                    {app.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
