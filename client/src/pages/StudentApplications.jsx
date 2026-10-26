import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobContext';
import { getStatusBadgeClass, formatDate } from '../utils/helpers';
import { FileText, ArrowRight, Clock, Building2, MapPin, CheckCircle2 } from 'lucide-react';

export default function StudentApplications() {
  const { user } = useAuth();
  const { applications, getJobById, getCompanyById } = useJobs();

  const myApps = applications.filter(
    (a) => a.studentId === user?.id || a.studentEmail === user?.email
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="pb-6 border-b border-[#DCE5ED]">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#176FA8]">
          <FileText className="w-4 h-4" />
          <span>Application Tracker</span>
        </div>
        <h1 className="text-2xl font-extrabold text-[#173B63] mt-1">
          My CA Dwar Applications
        </h1>
        <p className="text-sm text-slate-600">
          Real-time visibility into hiring statuses across all your submitted articleship and industrial training applications.
        </p>
      </div>

      {myApps.length === 0 ? (
        <div className="bg-white border border-[#DCE5ED] rounded-2xl p-12 text-center space-y-4">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-[#173B63]">No applications submitted yet</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Browse our verified openings and apply directly using your stored CA profile and resume.
          </p>
          <Link
            to="/articleship"
            className="inline-block px-5 py-2.5 bg-[#173B63] text-white text-xs font-bold rounded-xl"
          >
            Explore Opportunities
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {myApps.map((app) => {
            const job = getJobById(app.jobId);
            const comp = job ? getCompanyById(job.companyId) : null;
            return (
              <div
                key={app.id}
                className="bg-white border border-[#DCE5ED] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4 hover:border-[#176FA8] transition-colors"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">
                        {comp?.name || 'Verified CA Firm'}
                      </span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-500">
                        {job?.city} ({job?.workMode})
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#173B63]">
                      {job?.title || 'CA Trainee Vacancy'}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
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
                        className="text-xs font-bold text-[#176FA8] hover:underline flex items-center gap-1"
                      >
                        <span>View Job</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>

                {/* Cover note snapshot if provided */}
                {app.coverNote && (
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600">
                    <strong className="text-slate-800">Note Submitted:</strong> "{app.coverNote}"
                  </div>
                )}

                {/* Audit Trail / Timeline */}
                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Application History:
                  </span>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                    {(app.statusHistory || [
                      { status: app.status, date: app.appliedDate, note: 'Status recorded' },
                    ]).map((h, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#16805C]" />
                        <span className="font-semibold text-slate-800">{h.status}</span>
                        <span className="text-slate-400">({formatDate(h.date)})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
