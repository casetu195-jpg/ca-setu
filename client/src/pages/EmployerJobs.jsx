import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobContext';
import { formatStipend, getStatusBadgeClass } from '../utils/helpers';
import {
  Briefcase,
  PlusCircle,
  Users,
  PauseCircle,
  PlayCircle,
  XCircle,
  ExternalLink,
  Edit3,
  Trash2,
} from 'lucide-react';

export default function EmployerJobs() {
  const { user } = useAuth();
  const { jobs, companies, updateJobStatus, deleteJob } = useJobs();

  const company =
    companies.find((c) => c.id === user?.companyId) || companies[0];

  const employerJobs = jobs.filter((j) => j.companyId === company.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#DCE5ED]">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#176FA8]">
            <Briefcase className="w-4 h-4" />
            <span>Job Inventory</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#173B63] mt-1">
            Manage Posted Vacancies
          </h1>
          <p className="text-sm text-slate-600">
            Control the visibility, pause applications, or review applicants for {company.name}.
          </p>
        </div>

        <Link
          to="/employer/post-job"
          className="px-5 py-2.5 bg-[#173B63] hover:bg-[#176FA8] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-center"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Opportunity</span>
        </Link>
      </div>

      {employerJobs.length === 0 ? (
        <div className="bg-white border border-[#DCE5ED] rounded-2xl p-12 text-center space-y-4">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-[#173B63]">No job postings found</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            You haven't posted any articleship or job openings yet. Create your first listing now.
          </p>
          <Link
            to="/employer/post-job"
            className="inline-block px-5 py-2.5 bg-[#173B63] text-white text-xs font-bold rounded-xl"
          >
            Create Opportunity
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-[#DCE5ED] rounded-2xl overflow-hidden shadow-2xs divide-y divide-slate-100">
          {employerJobs.map((job) => (
            <div
              key={job.id}
              className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
            >
              <div className="space-y-1.5">
                <div className="flex items-center flex-wrap gap-2">
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadgeClass(
                      job.status
                    )}`}
                  >
                    {job.status}
                  </span>
                  <span className="text-xs font-semibold text-[#176FA8] bg-[#EEF6FC] px-2 py-0.5 rounded-full">
                    {job.categoryName}
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-600 font-medium">
                    {job.city} ({job.workMode})
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#152B45]">
                  {job.title}
                </h3>

                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="font-extrabold text-[#173B63]">{formatStipend(job)}</span>
                  <span>·</span>
                  <span>{job.domain}</span>
                  <span>·</span>
                  <span className="text-amber-700 font-semibold">{job.deadline || '15 days left'}</span>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center flex-wrap gap-2.5 self-start lg:self-center">
                <Link
                  to={`/employer/applicants?jobId=${job.id}`}
                  className="px-3.5 py-2 bg-[#EEF6FC] text-[#176FA8] hover:bg-[#176FA8] hover:text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{job.applicantCount || 0} Candidates</span>
                </Link>

                {job.status === 'Published' && (
                  <button
                    onClick={() => updateJobStatus(job.id, 'Paused')}
                    title="Pause incoming applications"
                    className="px-3 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1"
                  >
                    <PauseCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Pause</span>
                  </button>
                )}

                {job.status === 'Paused' && (
                  <button
                    onClick={() => updateJobStatus(job.id, 'Published')}
                    title="Resume publishing"
                    className="px-3 py-2 border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-1"
                  >
                    <PlayCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Publish</span>
                  </button>
                )}

                {job.status !== 'Closed' && (
                  <button
                    onClick={() => updateJobStatus(job.id, 'Closed')}
                    title="Close position permanently"
                    className="px-3 py-2 border border-slate-200 hover:bg-rose-50 text-rose-600 text-xs font-semibold rounded-xl flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Close</span>
                  </button>
                )}

                <Link
                  to={`/employer/post-job?edit=${job.id}`}
                  className="p-2 text-slate-500 hover:text-[#176FA8]"
                  title="Edit Opportunity"
                >
                  <Edit3 className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => {
                    if (window.confirm(`Permanently delete vacancy "${job.title}"?`)) {
                      deleteJob(job.id);
                    }
                  }}
                  className="p-2 text-slate-500 hover:text-rose-600"
                  title="Delete Opportunity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <Link
                  to={`/jobs/${job.id}`}
                  className="p-2 text-slate-400 hover:text-[#176FA8]"
                  title="View Public Page"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
