import React, { useState } from 'react';
import { useJobs } from '../context/JobContext';
import VerifiedBadge from '../components/common/VerifiedBadge';
import { Building2, ShieldCheck, CheckCircle2, XCircle, Search, ExternalLink } from 'lucide-react';

export default function AdminCompanies() {
  const { companies, adminVerifyCompany } = useJobs();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, verified, pending

  const filtered = companies.filter((c) => {
    if (filter === 'verified' && !c.isVerified) return false;
    if (filter === 'pending' && c.isVerified) return false;
    if (query) {
      const q = query.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.registrationNumber.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#DCE5ED]">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#176FA8]">
            <Building2 className="w-4 h-4" />
            <span>Admin Control Panel</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#173B63] mt-1">
            CA Firm & Corporate KYC Verification
          </h1>
          <p className="text-sm text-slate-600">
            Grant or revoke the official "✓ CA Dwar Verified" badge by cross-verifying ICAI Firm Registration Numbers.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#DCE5ED] shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search firm by name, FRN / CIN, or city..."
            className="w-full pl-9 pr-3 py-2 text-xs text-[#152B45] rounded-xl border border-slate-200 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
              filter === 'all'
                ? 'bg-[#173B63] text-white'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            All ({companies.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
              filter === 'pending'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            Pending Verification
          </button>
          <button
            onClick={() => setFilter('verified')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
              filter === 'verified'
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            Verified Only
          </button>
        </div>
      </div>

      {/* Table of Companies */}
      <div className="bg-white border border-[#DCE5ED] rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-[#F8FAFC] border-b border-[#DCE5ED] text-slate-700 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Firm / Company</th>
                <th className="px-4 py-3.5">Type & HQ</th>
                <th className="px-4 py-3.5">FRN / CIN</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Admin Verification Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-bold text-sm text-[#152B45] flex items-center gap-2">
                      <span>{c.name}</span>
                      {c.isVerified && <VerifiedBadge size="sm" showText={false} />}
                    </div>
                    <span className="text-[11px] text-slate-400 line-clamp-1">{c.address}</span>
                  </td>

                  <td className="px-4 py-4">
                    <span className="font-semibold text-slate-700 block">{c.firmType}</span>
                    <span className="text-slate-500">{c.city}</span>
                  </td>

                  <td className="px-4 py-4 font-mono font-semibold text-[#173B63]">
                    {c.registrationNumber}
                  </td>

                  <td className="px-4 py-4">
                    {c.isVerified ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                        Verified ✓
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                        Pending Check
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4 text-right">
                    {c.isVerified ? (
                      <button
                        onClick={() => adminVerifyCompany(c.id, false)}
                        className="px-3 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold"
                      >
                        Revoke Verification
                      </button>
                    ) : (
                      <button
                        onClick={() => adminVerifyCompany(c.id, true)}
                        className="px-3.5 py-1.5 bg-[#16805C] hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-2xs flex items-center gap-1 ml-auto"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verify Firm</span>
                      </button>
                    )}
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
