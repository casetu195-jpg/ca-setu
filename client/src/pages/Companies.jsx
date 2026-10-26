import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import VerifiedBadge from '../components/common/VerifiedBadge';
import SEO from '../components/common/SEO';
import { Building2, MapPin, Search, ExternalLink, Briefcase } from 'lucide-react';

export default function Companies() {
  const { companies, jobs } = useJobs();
  const [query, setQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const navigate = useNavigate();

  const filtered = companies.filter((c) => {
    if (cityFilter !== 'all' && c.city.toLowerCase() !== cityFilter.toLowerCase()) return false;
    if (query) {
      const q = query.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q) || c.firmType?.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEO
        title="Verified CA Firms & Corporate Employers | CA Dwar"
        description="Browse verified Chartered Accountancy firms and companies hiring CA Articles, Industrial Trainees, and qualified CAs across India on CA Dwar."
        canonicalPath="/companies"
      />
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#176FA8]">
          <Building2 className="w-4 h-4" />
          <span>Employer Directory</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173B63]">
          Verified CA Firms & Corporate Employers
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          Browse verified accounting networks, audit partnerships, and corporate hiring partners offering articleship and industrial training.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#DCE5ED] shadow-2xs">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search firms by name or specialization..."
            className="w-full pl-9 pr-3 py-2 text-xs text-[#152B45] rounded-xl border border-slate-200 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium">City:</span>
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="text-xs font-semibold text-[#152B45] bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden cursor-pointer"
          >
            <option value="all">Pan-India (All Cities)</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Kolkata">Kolkata</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Gurugram">Gurugram</option>
          </select>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((company) => {
          const compJobs = jobs.filter((j) => j.companyId === company.id && j.status === 'Published');
          return (
            <div
              key={company.id}
              onClick={() => navigate(`/companies/${company.id}`)}
              className="group bg-white border border-[#DCE5ED] rounded-2xl p-6 hover:border-[#176FA8] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-[#173B63] overflow-hidden text-base shadow-2xs">
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
                      {company.initials || company.name.slice(0, 2).toUpperCase()}
                    </span>
                  </div>

                  {company.isVerified ? (
                    <VerifiedBadge size="sm" />
                  ) : (
                    <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
                      Registered
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#152B45] group-hover:text-[#176FA8] transition-colors line-clamp-1">
                    {company.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{company.city}</span>
                    <span>·</span>
                    <span className="font-medium text-slate-700">{company.firmType}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {company.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-5 flex items-center justify-between text-xs">
                <span className="font-extrabold text-[#173B63] bg-[#EEF6FC] px-2.5 py-1 rounded-lg">
                  {compJobs.length} Active Openings
                </span>
                <span className="text-[#176FA8] font-bold group-hover:underline">
                  View Profile &rarr;
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
