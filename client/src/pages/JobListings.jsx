import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import JobCard from '../components/common/JobCard';
import FilterSidebar from '../components/common/FilterSidebar';
import SEO from '../components/common/SEO';
import { Search, SlidersHorizontal, Briefcase, Sparkles, Inbox } from 'lucide-react';

export default function JobListings() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { jobs } = useJobs();

  // Determine category based on route
  const currentPath = location.pathname;
  const categoryParam = searchParams.get('category');
  const category =
    currentPath === '/industrial-training' || categoryParam === 'industrial-training'
      ? 'industrial-training'
      : currentPath === '/ca-jobs' || categoryParam === 'ca-jobs'
      ? 'ca-jobs'
      : currentPath === '/articleship' || categoryParam === 'articleship'
      ? 'articleship'
      : currentPath === '/jobs'
      ? 'all'
      : 'articleship';

  const categoryTitle =
    category === 'industrial-training'
      ? 'CA Industrial Training Opportunities'
      : category === 'ca-jobs'
      ? 'Qualified CA Jobs & Careers'
      : category === 'all'
      ? 'All CA Opportunities'
      : 'CA Articleship Vacancies';

  const categorySubtitle =
    category === 'industrial-training'
      ? 'High-impact 9–12 months training in PE, Investment Banking, FMCG, and MNC Banks for CA Finalists.'
      : category === 'ca-jobs'
      ? 'Full-time finance, assurance, tax, and CFO advisory roles for freshly qualified and experienced CAs.'
      : category === 'all'
      ? 'Explore verified Articleship, Industrial Training, and CA Jobs across top firms in India.'
      : 'Mandatory practical training under active ICAI Certificate of Practice holders in reputable CA firms.';

  const seoTitle =
    category === 'industrial-training'
      ? 'CA Industrial Training Opportunities | CA Dwar'
      : category === 'ca-jobs'
      ? 'Chartered Accountant Jobs & Careers | CA Dwar'
      : category === 'all'
      ? 'Explore CA Opportunities: Articleship, Training & Jobs | CA Dwar'
      : 'CA Articleship Vacancies & Opportunities | CA Dwar';

  const seoDescription =
    category === 'industrial-training'
      ? 'Explore premier CA Industrial Training openings in Investment Banking, Private Equity, FP&A, and corporate finance across India on CA Dwar.'
      : category === 'ca-jobs'
      ? 'Discover career opportunities for qualified Chartered Accountants and fresh CA graduates across leading firms and corporates in India on CA Dwar.'
      : category === 'all'
      ? 'Browse verified CA Articleship, Industrial Training, and CA Jobs across India on CA Dwar. Discover openings and connect with recruiters.'
      : 'Find verified CA Articleship vacancies across top CA firms in India. Apply for statutory audit, tax, and advisory articleship roles on CA Dwar.';

  const seoCanonical =
    category === 'industrial-training'
      ? '/industrial-training'
      : category === 'ca-jobs'
      ? '/ca-jobs'
      : category === 'all'
      ? '/jobs'
      : '/articleship';

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Parse filters from URL
  const selectedFilters = useMemo(() => {
    return {
      cities: searchParams.getAll('city'),
      domains: searchParams.getAll('domain'),
      workModes: searchParams.getAll('workMode'),
      groups: searchParams.getAll('group'),
      firmTypes: searchParams.getAll('firmType'),
    };
  }, [searchParams]);

  // Keep search input in sync if URL changes
  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleFilterChange = (group, values) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(group.slice(0, -1)); // singular form in query
    values.forEach((v) => newParams.append(group.slice(0, -1), v));
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    const newParams = new URLSearchParams();
    if (searchQuery) newParams.set('q', searchQuery);
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchQuery.trim()) {
      newParams.set('q', searchQuery.trim());
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams);
  };

  // Filter & Sort Logic
  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        // Category check
        if (category !== 'all' && job.category !== category) return false;
        // Status check
        if (job.status !== 'Published') return false;

        // Keyword query
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchTitle = job.title.toLowerCase().includes(q);
          const matchCompany = (job.companyName || '').toLowerCase().includes(q);
          const matchDomain = job.domain.toLowerCase().includes(q);
          const matchDesc = job.description.toLowerCase().includes(q);
          if (!matchTitle && !matchCompany && !matchDomain && !matchDesc) return false;
        }

        // City filter
        if (
          selectedFilters.cities.length > 0 &&
          !selectedFilters.cities.some((c) => c.toLowerCase() === job.city.toLowerCase())
        ) {
          return false;
        }

        // Domain filter
        if (
          selectedFilters.domains.length > 0 &&
          !selectedFilters.domains.some((d) => d.toLowerCase() === job.domain.toLowerCase())
        ) {
          return false;
        }

        // Work mode filter
        if (
          selectedFilters.workModes.length > 0 &&
          !selectedFilters.workModes.includes(job.workMode)
        ) {
          return false;
        }

        // Groups filter
        if (
          selectedFilters.groups.length > 0 &&
          !selectedFilters.groups.includes(job.requiredGroups)
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'stipend') {
          return (b.stipendMax || 0) - (a.stipendMax || 0);
        }
        // Default newest
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [jobs, category, searchQuery, selectedFilters, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEO
        title={seoTitle}
        description={seoDescription}
        canonicalPath={seoCanonical}
      />
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#176FA8]">
          <Briefcase className="w-3.5 h-3.5" />
          <span>CA Opportunity Marketplace</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173B63]">
          {categoryTitle}
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          {categorySubtitle}
        </p>
      </div>

      {/* Search Bar & Controls Bar */}
      <div className="bg-white border border-[#DCE5ED] rounded-2xl p-4 shadow-2xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role, domain, or skills (e.g. Audit, Ind AS, Private Equity)..."
              className="w-full pl-11 pr-4 py-2.5 text-sm text-[#152B45] rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#176FA8] bg-slate-50/50"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#173B63] hover:bg-[#176FA8] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors shrink-0"
          >
            Search
          </button>
        </form>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* Result Count */}
          <div className="text-slate-600 font-medium">
            Showing <strong className="text-[#173B63] font-bold">{filteredJobs.length}</strong> matching vacancies
          </div>

          {/* Sort & Mobile Filter Toggle */}
          <div className="flex items-center gap-3">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-3 py-1.5 border border-[#DCE5ED] rounded-lg text-[#152B45] font-semibold flex items-center gap-1.5 hover:bg-slate-50"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#176FA8]" />
              <span>Filters</span>
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="font-semibold text-[#152B45] bg-transparent border border-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-hidden cursor-pointer"
              >
                <option value="newest">Latest Posted</option>
                <option value="stipend">Highest Stipend / CTC</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area: Filter Sidebar + Job Results */}
      <div className="flex gap-8 items-start">
        {/* Left Filter Sidebar */}
        <FilterSidebar
          category={category}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          isOpenMobile={mobileFilterOpen}
          onCloseMobile={() => setMobileFilterOpen(false)}
        />

        {/* Job Results Grid */}
        <div className="flex-1 min-w-0">
          {filteredJobs.length === 0 ? (
            /* Empty State */
            <div className="bg-white border border-[#DCE5ED] rounded-2xl p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Inbox className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#173B63]">
                No matching opportunities found
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                We couldn't find any vacancies matching your active filter criteria. Try clearing some filters or searching with a broader keyword.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-[#176FA8] text-white text-xs font-semibold rounded-lg hover:bg-[#135d8d] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
