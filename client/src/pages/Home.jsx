import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import SearchBar from '../components/common/SearchBar';
import JobCard from '../components/common/JobCard';
import VerifiedBadge from '../components/common/VerifiedBadge';
import SEO from '../components/common/SEO';
import {
  GraduationCap,
  Briefcase,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Users,
  ArrowRight,
  Sparkles,
  Send,
  Building2,
} from 'lucide-react';

export default function Home() {
  const { jobs, companies, categoryStats, categoryStatsLoading } = useJobs();
  const navigate = useNavigate();

  const articleshipStats = categoryStats?.articleship || { activeOpenings: 0, applicationsSubmitted: 0 };
  const industrialStats = categoryStats?.['industrial-training'] || { activeOpenings: 0, applicationsSubmitted: 0 };
  const caJobsStats = categoryStats?.['ca-jobs'] || { activeOpenings: 0, applicationsSubmitted: 0 };

  // Dynamically calculate total active openings from database category stats
  const totalLiveOpenings =
    (articleshipStats.activeOpenings || 0) +
    (industrialStats.activeOpenings || 0) +
    (caJobsStats.activeOpenings || 0);

  // Featured jobs (up to 6)
  const featuredJobs = jobs
    .filter((j) => j.isFeatured && j.status === 'Published')
    .slice(0, 6);

  // Verified companies showcase
  const verifiedCompanies = companies.filter((c) => c.isVerified).slice(0, 6);

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      <SEO
        title="CA Dwar | CA Articleship, Industrial Training & Jobs"
        description="Explore CA Articleship, Industrial Training and CA job opportunities across India on CA Dwar. Discover openings and connect with recruiters."
        canonicalPath="/"
      />

      {/* 1. Hero & Search Section (Headline, Description & Prominent SearchBar ABOVE categories) */}
      <section className="relative pt-8 sm:pt-12 pb-4 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#EEF6FC]/70 via-white to-transparent">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          {/* Main Headline & Short Description */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF6FC] border border-[#176FA8]/20 text-[#176FA8] text-xs font-bold uppercase tracking-wider shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#176FA8]" />
              <span>CA Dwar · Verified CA Career Gateway</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-[#173B63] tracking-tight leading-tight">
              Chartered Accountancy <span className="text-[#176FA8]">Career Opportunities</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
              Search opportunities across India, filter by what matters to a CA student, and apply with confidence.
            </p>
          </div>

          {/* Search Bar and City Selection - Prominently Placed Above Categories */}
          <div className="max-w-4xl mx-auto">
            <SearchBar />

            {/* Quick Searches Tags */}
            <div className="pt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Quick Searches:</span>
              <Link
                to="/industrial-training?domain=private-equity"
                className="px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 hover:border-[#176FA8] hover:text-[#176FA8] transition-colors"
              >
                Private Equity Industrial
              </Link>
              <Link
                to="/industrial-training?domain=investment-banking"
                className="px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 hover:border-[#176FA8] hover:text-[#176FA8] transition-colors"
              >
                Investment Banking
              </Link>
              <Link
                to="/articleship?domain=statutory-audit"
                className="px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 hover:border-[#176FA8] hover:text-[#176FA8] transition-colors"
              >
                Statutory Audit
              </Link>
              <Link
                to="/articleship?city=mumbai"
                className="px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 hover:border-[#176FA8] hover:text-[#176FA8] transition-colors"
              >
                Articleship Mumbai
              </Link>
            </div>
          </div>

          {/* Trust and Platform Statistics Section */}
          <div className="max-w-4xl mx-auto bg-white border border-[#DCE5ED] rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-3.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-[#173B63] tracking-wide uppercase">
                Trusted by CA students across India
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {/* Stat 1: 1,000+ CA Students Joined */}
              <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-xl p-3 sm:p-4 text-center flex flex-col items-center justify-center">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#176FA8] flex items-center justify-center mb-1.5">
                  <Users className="w-4 h-4" />
                </div>
                <div className="text-lg sm:text-2xl font-black text-[#173B63] tracking-tight">
                  1,000+
                </div>
                <div className="text-[11px] sm:text-xs text-slate-600 font-medium leading-tight mt-0.5">
                  CA students joined
                </div>
              </div>

              {/* Stat 2: 2,500+ Applications Submitted */}
              <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-xl p-3 sm:p-4 text-center flex flex-col items-center justify-center">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#6366F1] flex items-center justify-center mb-1.5">
                  <Send className="w-4 h-4" />
                </div>
                <div className="text-lg sm:text-2xl font-black text-[#173B63] tracking-tight">
                  2,500+
                </div>
                <div className="text-[11px] sm:text-xs text-slate-600 font-medium leading-tight mt-0.5">
                  Applications submitted
                </div>
              </div>

              {/* Stat 3: Live Openings (Dynamic from Database) */}
              <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-xl p-3 sm:p-4 text-center flex flex-col items-center justify-center">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div className="text-lg sm:text-2xl font-black text-emerald-700 tracking-tight">
                  {categoryStatsLoading ? (
                    <span className="inline-block w-10 h-6 bg-slate-200 animate-pulse rounded" />
                  ) : (
                    totalLiveOpenings
                  )}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-600 font-medium leading-tight mt-0.5">
                  Live openings verified
                </div>
              </div>
            </div>
          </div>

          {/* Three Opportunity Category Cards with Distinct Pastel Backgrounds */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 pt-2">
            {/* Card 1: CA Articleship (Light Blue Pastel) */}
            <div
              onClick={() => navigate('/articleship')}
              className="group relative bg-[#F0F7FF] border border-[#BAE6FD] rounded-2xl p-6 hover:border-[#176FA8] hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white text-[#173B63] border border-[#BAE6FD] flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform shadow-2xs">
                    <GraduationCap className="w-6 h-6 text-[#176FA8]" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#0369A1] bg-[#E0F2FE] px-2.5 py-1 rounded-full border border-[#BAE6FD]">
                    For CA Intermediate Students
                  </span>
                </div>

                <h2 className="text-2xl font-black text-[#173B63] group-hover:text-[#176FA8] transition-colors">
                  CA Articleship
                </h2>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Mandatory ICAI practical training in Audit, Taxation & Advisory.
                </p>

                {/* Live Statistics Block */}
                <div className="bg-white/90 backdrop-blur-xs border border-[#BAE6FD] rounded-xl p-4 my-5 space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                      <Briefcase className="w-3.5 h-3.5 text-[#176FA8]" />
                      <span>Active Openings:</span>
                    </div>
                    <span className="font-black text-base text-[#173B63]">
                      {categoryStatsLoading ? (
                        <span className="inline-block w-8 h-4 bg-slate-200 animate-pulse rounded" />
                      ) : (
                        articleshipStats.activeOpenings
                      )}
                    </span>
                  </div>
                  <div className="h-px bg-slate-200/80" />
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      <span>Applications Submitted:</span>
                    </div>
                    <span className="font-black text-base text-[#176FA8]">
                      {categoryStatsLoading ? (
                        <span className="inline-block w-8 h-4 bg-slate-200 animate-pulse rounded" />
                      ) : (
                        articleshipStats.applicationsSubmitted
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/articleship');
                }}
                className="w-full py-3 bg-[#173B63] hover:bg-[#176FA8] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Explore Articleship</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Card 2: CA Industrial Training (Light Lavender Pastel) */}
            <div
              onClick={() => navigate('/industrial-training')}
              className="group relative bg-[#F5F3FF] border border-[#DDD6FE] rounded-2xl p-6 hover:border-[#7C3AED] hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white text-[#7C3AED] border border-[#DDD6FE] flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform shadow-2xs">
                    <TrendingUp className="w-6 h-6 text-[#7C3AED]" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6D28D9] bg-[#EDE9FE] px-2.5 py-1 rounded-full border border-[#DDD6FE]">
                    For Eligible CA Final Students
                  </span>
                </div>

                <h2 className="text-2xl font-black text-[#173B63] group-hover:text-[#7C3AED] transition-colors">
                  CA Industrial Training
                </h2>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Corporate training in Treasury, FP&A, Investment Banking & Advisory.
                </p>

                {/* Live Statistics Block */}
                <div className="bg-white/90 backdrop-blur-xs border border-[#DDD6FE] rounded-xl p-4 my-5 space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                      <Briefcase className="w-3.5 h-3.5 text-[#7C3AED]" />
                      <span>Active Openings:</span>
                    </div>
                    <span className="font-black text-base text-[#173B63]">
                      {categoryStatsLoading ? (
                        <span className="inline-block w-8 h-4 bg-slate-200 animate-pulse rounded" />
                      ) : (
                        industrialStats.activeOpenings
                      )}
                    </span>
                  </div>
                  <div className="h-px bg-slate-200/80" />
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      <span>Applications Submitted:</span>
                    </div>
                    <span className="font-black text-base text-[#7C3AED]">
                      {categoryStatsLoading ? (
                        <span className="inline-block w-8 h-4 bg-slate-200 animate-pulse rounded" />
                      ) : (
                        industrialStats.applicationsSubmitted
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/industrial-training');
                }}
                className="w-full py-3 bg-[#173B63] hover:bg-[#7C3AED] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Explore Industrial Training</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Card 3: CA Qualified Jobs (Light Cream/Yellow Pastel) */}
            <div
              onClick={() => navigate('/ca-jobs')}
              className="group relative bg-[#FEFCE8] border border-[#FEF08A] rounded-2xl p-6 hover:border-[#CA8A04] hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white text-[#CA8A04] border border-[#FEF08A] flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform shadow-2xs">
                    <Briefcase className="w-6 h-6 text-[#CA8A04]" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#854D0E] bg-[#FEF9C3] px-2.5 py-1 rounded-full border border-[#FEF08A]">
                    For Qualified Chartered Accountants
                  </span>
                </div>

                <h2 className="text-2xl font-black text-[#173B63] group-hover:text-[#CA8A04] transition-colors">
                  CA Qualified Jobs
                </h2>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Full-time professional careers in Assurance, Taxation, Advisory & CFO office.
                </p>

                {/* Live Statistics Block */}
                <div className="bg-white/90 backdrop-blur-xs border border-[#FEF08A] rounded-xl p-4 my-5 space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                      <Briefcase className="w-3.5 h-3.5 text-[#CA8A04]" />
                      <span>Active Openings:</span>
                    </div>
                    <span className="font-black text-base text-[#173B63]">
                      {categoryStatsLoading ? (
                        <span className="inline-block w-8 h-4 bg-slate-200 animate-pulse rounded" />
                      ) : (
                        caJobsStats.activeOpenings
                      )}
                    </span>
                  </div>
                  <div className="h-px bg-slate-200/80" />
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      <span>Applications Submitted:</span>
                    </div>
                    <span className="font-black text-base text-[#CA8A04]">
                      {categoryStatsLoading ? (
                        <span className="inline-block w-8 h-4 bg-slate-200 animate-pulse rounded" />
                      ) : (
                        caJobsStats.applicationsSubmitted
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/ca-jobs');
                }}
                className="w-full py-3 bg-[#173B63] hover:bg-[#CA8A04] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Explore CA Jobs</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Opportunities Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h2 className="text-2xl font-bold text-[#173B63]">
                Featured Opportunities
              </h2>
            </div>
            <p className="text-sm text-slate-600 mt-0.5">
              Verified openings from CA Dwar partner firms and leading organizations.
            </p>
          </div>

          <Link
            to="/jobs"
            className="text-sm font-bold text-[#176FA8] hover:underline flex items-center gap-1"
          >
            View All Openings &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      {/* 3. Value Proposition / Trust Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#173B63] rounded-3xl p-8 sm:p-12 text-white">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#EEF6FC] bg-white/10 px-3 py-1 rounded-full">
              The CA Dwar Advantage
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Why CA Aspirants & Firms Choose CA Dwar
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Generic job boards don't understand attempts, groups cleared, or ICAI training regulations. We built a dedicated gateway for the CA fraternity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/10 rounded-2xl p-5 border border-white/10 space-y-2.5">
              <ShieldCheck className="w-7 h-7 text-emerald-400" />
              <h4 className="font-bold text-base text-white">100% Verified Firms</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Zero spam postings. Every CA firm is authenticated via their ICAI Firm Registration Number (FRN).
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-5 border border-white/10 space-y-2.5">
              <CheckCircle2 className="w-7 h-7 text-blue-300" />
              <h4 className="font-bold text-base text-white">Transparent Stipends</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                No misleading salary tags. Clearly published stipends conforming to ICAI guidelines.
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-5 border border-white/10 space-y-2.5">
              <Users className="w-7 h-7 text-purple-300" />
              <h4 className="font-bold text-base text-white">Dedicated CA Criteria</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Filter vacancies by CA Inter / Final groups cleared, attempts, and specialized finance domains.
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-5 border border-white/10 space-y-2.5">
              <TrendingUp className="w-7 h-7 text-amber-300" />
              <h4 className="font-bold text-base text-white">Direct Application Channels</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect directly through official application forms, direct recruiter emails, or 1-click profiles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Verified CA Firms & Companies Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#173B63]">
              Hiring Partners on CA Dwar
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Audit networks, corporate conglomerates, and investment banks.
            </p>
          </div>

          <Link
            to="/companies"
            className="text-sm font-bold text-[#176FA8] hover:underline"
          >
            View All Companies &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {verifiedCompanies.map((c) => (
            <div
              key={c.id}
              onClick={() => navigate(`/companies/${c.id}`)}
              className="bg-white border border-[#DCE5ED] rounded-xl p-4 text-center hover:border-[#176FA8] hover:shadow-xs transition-all cursor-pointer flex flex-col items-center justify-center space-y-2.5"
            >
              <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-sm font-extrabold text-[#173B63] overflow-hidden border border-slate-200">
                {c.logo ? (
                  <img
                    src={c.logo}
                    alt={c.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                ) : null}
                <span className={c.logo ? 'hidden' : 'block'}>
                  {c.initials || c.name.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="w-full">
                <h4 className="text-xs font-bold text-[#152B45] truncate">{c.name}</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">{c.city}</p>
              </div>
              <VerifiedBadge size="sm" showText={false} />
            </div>
          ))}
        </div>
      </section>

      {/* 5. Bottom CTA for CA Firms & Employers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#EEF6FC] border border-[#176FA8]/20 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-[#173B63]">
              Are you a CA Firm Partner or Corporate Recruiter?
            </h3>
            <p className="text-sm text-slate-600 max-w-xl">
              Post your articleship and industrial training vacancies directly to thousands of screened CA students across India.
            </p>
          </div>
          <Link
            to="/employer/post-job"
            className="px-6 py-3 bg-[#173B63] hover:bg-[#176FA8] text-white text-sm font-bold rounded-xl shadow-xs transition-colors shrink-0"
          >
            Post an Opportunity &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
