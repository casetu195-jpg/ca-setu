import React, { useState } from 'react';
import { useSearchParams, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobContext';
import { getStatusBadgeClass, formatDate } from '../utils/helpers';
import {
  Users,
  FileText,
  Mail,
  Phone,
  CheckCircle2,
  ChevronDown,
  Filter,
  ExternalLink,
  Download,
} from 'lucide-react';

export default function EmployerApplicants() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filterJobId = searchParams.get('jobId') || 'all';

  const { user } = useAuth();
  const { applications, jobs, companies, updateApplicationStatus, getJobById } = useJobs();

  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const company =
    companies.find((c) => c.id === user?.companyId || c._id === user?.companyId || c.userId === user?.id) ||
    (companies.length > 0 ? companies[0] : { id: '', name: user?.companyName || 'Employer' });

  const employerJobs = jobs.filter((j) => {
    const compId = j.companyId?._id || j.companyId?.id || j.companyId;
    return compId === company.id || compId === company._id;
  });

  // Filter applications belonging to employer's jobs
  const relevantApps = applications.filter((a) => {
    const appJobId = a.jobId?._id || a.jobId?.id || a.jobId;
    if (filterJobId !== 'all' && appJobId !== filterJobId) return false;
    return true;
  });

  const [statusFilter, setStatusFilter] = useState('all');

  const filteredApps = relevantApps.filter((a) => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    return true;
  });

  const handleStatusChange = (appId, newStatus) => {
    updateApplicationStatus(appId, newStatus);
  };

  const statusOptions = [
    'Applied',
    'Under Review',
    'Shortlisted',
    'Interview',
    'Selected',
    'Rejected',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#DCE5ED]">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#176FA8]">
            <Users className="w-4 h-4" />
            <span>Recruitment Pipeline</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#173B63] mt-1">
            Applicant Screening & Review
          </h1>
          <p className="text-sm text-slate-600">
            Review CA student profiles, inspect resumes, and advance candidates through interview rounds.
          </p>
        </div>

        {/* Filter by Job Vacancy */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Job Filter:</span>
          <select
            value={filterJobId}
            onChange={(e) => {
              const newParams = new URLSearchParams(searchParams);
              if (e.target.value === 'all') newParams.delete('jobId');
              else newParams.set('jobId', e.target.value);
              setSearchParams(newParams);
            }}
            className="text-xs font-semibold text-[#152B45] bg-white border border-[#DCE5ED] rounded-xl px-3 py-2 focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Vacancies ({employerJobs.length})</option>
            {employerJobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pipeline Status Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            statusFilter === 'all'
              ? 'bg-[#173B63] text-white shadow-2xs'
              : 'bg-white border border-[#DCE5ED] text-slate-600 hover:bg-slate-50'
          }`}
        >
          All Candidates ({relevantApps.length})
        </button>
        {statusOptions.map((st) => {
          const count = relevantApps.filter((a) => a.status === st).length;
          return (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                statusFilter === st
                  ? 'bg-[#176FA8] text-white shadow-2xs'
                  : 'bg-white border border-[#DCE5ED] text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{st}</span>
              <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded-full">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Candidate Pipeline Cards / Table */}
      {filteredApps.length === 0 ? (
        <div className="bg-white border border-[#DCE5ED] rounded-2xl p-12 text-center space-y-4">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-[#173B63]">No candidates found</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            No applicants match the current filter selection. Share your job link to attract candidates.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApps.map((app) => {
            const job = getJobById(app.jobId);
            return (
              <div
                key={app.id}
                className="bg-white border border-[#DCE5ED] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4 hover:border-[#176FA8] transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Candidate Info */}
                  <div className="space-y-1.5">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="font-extrabold text-base text-[#152B45]">
                        {app.studentName}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#176FA8] text-xs font-bold border border-blue-200">
                        CA {app.caStage} · {app.groupsCleared}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                        {app.attemptsCount === 1 ? '1st Attempt' : `${app.attemptsCount} Attempts`}
                      </span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-500 font-medium">
                        {app.city}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">
                      Applied for: <strong className="text-[#173B63]">{job?.title}</strong> · {formatDate(app.appliedDate)}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {app.studentEmail}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {app.studentPhone}
                      </span>
                    </div>
                  </div>

                  {/* Actions: Status Dropdown & Resume */}
                  <div className="flex flex-wrap items-center gap-3 self-start lg:self-center">
                    {/* Resume Download / View */}
                    {app.resumeUrl ? (
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#176FA8]" />
                        <span>View Resume</span>
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic px-2">No resume attached</span>
                    )}

                    {/* Stage Status Selector */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-slate-400 font-medium">Stage:</span>
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className={`text-xs font-bold px-3 py-2 rounded-xl border focus:outline-hidden cursor-pointer ${getStatusBadgeClass(
                          app.status
                        )}`}
                      >
                        {statusOptions.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Cover Note */}
                {app.coverNote && (
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600">
                    <strong className="text-slate-800">Candidate's Pitch:</strong> "{app.coverNote}"
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
