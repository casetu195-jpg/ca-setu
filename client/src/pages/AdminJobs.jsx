import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import { formatStipend, getStatusBadgeClass } from '../utils/helpers';
import {
  Briefcase,
  CheckCircle,
  XCircle,
  Sparkles,
  Search,
  PauseCircle,
  PlayCircle,
  PlusCircle,
  Edit3,
  Trash2,
} from 'lucide-react';

export default function AdminJobs() {
  const {
    jobs,
    companies,
    adminApproveJob,
    adminRejectJob,
    adminToggleFeature,
    updateJobStatus,
    deleteJob,
  } = useJobs();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredJobs = jobs.filter((j) => {
    if (filter === 'pending' && j.status !== 'Pending Review') return false;
    if (filter === 'published' && j.status !== 'Published') return false;
    if (filter === 'featured' && !j.isFeatured) return false;
    if (query) {
      const q = query.toLowerCase();
      return (
        j.title.toLowerCase().includes(q) ||
        (j.companyName || '').toLowerCase().includes(q) ||
        j.domain.toLowerCase().includes(q) ||
        j.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#DCE5ED]">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#176FA8]">
            <Briefcase className="w-4 h-4" />
            <span>Listing Governance</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#173B63] mt-1">
            Job Posting Moderation Center
          </h1>
          <p className="text-sm text-slate-600">
            Ensure all articleship and CA vacancies comply with ICAI minimum stipend norms and anti-spam rules.
          </p>
        </div>

        <Link
          to="/employer/post-job"
          className="px-4 py-2.5 bg-[#173B63] hover:bg-[#176FA8] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-center"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Opportunity</span>
        </Link>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#DCE5ED] shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, domain, or location..."
            className="w-full pl-9 pr-3 py-2 text-xs text-[#152B45] rounded-xl border border-slate-200 focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
              filter === 'all' ? 'bg-[#173B63] text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            All ({jobs.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
              filter === 'pending' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Pending Review
          </button>
          <button
            onClick={() => setFilter('published')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
              filter === 'published' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Published
          </button>
          <button
            onClick={() => setFilter('featured')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
              filter === 'featured' ? 'bg-purple-700 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Featured Spots
          </button>
        </div>
      </div>

      {/* Jobs Moderation Table */}
      <div className="bg-white border border-[#DCE5ED] rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-[#F8FAFC] border-b border-[#DCE5ED] text-slate-700 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Opportunity Title</th>
                <th className="px-4 py-3.5">Category & Domain</th>
                <th className="px-4 py-3.5">City & Stipend</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Moderation Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredJobs.map((j) => (
                <tr key={j.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-bold text-sm text-[#152B45] flex items-center gap-2">
                      <span>{j.title}</span>
                      {j.isFeatured && (
                        <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-1.5 py-0.2 rounded-full border border-amber-200">
                          Featured
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-[#173B63] block mt-0.5">
                      {j.companyName || (companies.find((c) => c.id === j.companyId)?.name) || 'CA Firm'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Eligibility: {j.eligibility}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span className="font-semibold text-[#176FA8] block">{j.categoryName}</span>
                    <span className="text-slate-500">{j.domain}</span>
                  </td>

                  <td className="px-4 py-4">
                    <span className="font-bold text-[#173B63] block">{formatStipend(j)}</span>
                    <span className="text-slate-500">{j.city} ({j.workMode})</span>
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadgeClass(
                        j.status
                      )}`}
                    >
                      {j.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right space-x-1.5 whitespace-nowrap">
                    {/* Approve / Pause */}
                    {j.status !== 'Published' ? (
                      <button
                        onClick={() => adminApproveJob(j.id)}
                        className="px-2.5 py-1 bg-[#173B63] hover:bg-[#176FA8] text-white rounded-lg text-xs font-bold shadow-2xs"
                        title="Approve & Publish live"
                      >
                        Approve
                      </button>
                    ) : (
                      <button
                        onClick={() => updateJobStatus(j.id, 'Paused')}
                        className="px-2.5 py-1 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold"
                        title="Pause applications"
                      >
                        Pause
                      </button>
                    )}

                    {/* Edit Posting */}
                    <Link
                      to={`/employer/post-job?edit=${j.id}`}
                      className="px-2 py-1 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold inline-flex items-center gap-1"
                      title="Edit Opportunity Details"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                      <span>Edit</span>
                    </Link>

                    {/* Feature Placement Toggle */}
                    <button
                      onClick={() => adminToggleFeature(j.id)}
                      title="Toggle Featured placement"
                      className={`px-2 py-1 rounded-lg text-xs font-bold border ${
                        j.isFeatured
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 inline" />
                    </button>

                    {/* Reject */}
                    {j.status !== 'Rejected' && (
                      <button
                        onClick={() => adminRejectJob(j.id)}
                        className="px-2 py-1 border border-amber-200 text-amber-700 hover:bg-amber-50 rounded-lg text-xs font-semibold"
                        title="Reject Opportunity"
                      >
                        Reject
                      </button>
                    )}

                    {/* Permanent Delete */}
                    <button
                      onClick={() => {
                        if (window.confirm(`Permanently delete vacancy "${j.title}"?`)) {
                          deleteJob(j.id);
                        }
                      }}
                      className="px-2 py-1 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold inline-flex items-center"
                      title="Delete Posting Permanently"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
