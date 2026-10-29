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
  Search,
} from 'lucide-react';

export default function Home() {
  const { jobs, companies, categoryStats, categoryStatsLoading } = useJobs();
  const navigate = useNavigate();

  const articleshipStats = categoryStats?.articleship || { activeOpenings: 0, applicationsSubmitted: 0 };
  const industrialStats = categoryStats?.['industrial-training'] || { activeOpenings: 0, applicationsSubmitted: 0 };
  const caJobsStats = categoryStats?.['ca-jobs'] || { activeOpenings: 0, applicationsSubmitted: 0 };

  // Featured jobs (up to 6)
  const featuredJobs = jobs
    .filter((j) => j.isFeatured && j.status === 'Published')
    .slice(0, 6);

  // Verified companies showcase
  const verifiedCompanies = companies.filter((c) => c.isVerified).slice(0, 6);

  return (
    <div className="space-y-16 pb-12">
      <SEO
        title="CA Dwar | CA Articleship, Industrial Training & Jobs"
        description="Explore CA Articleship, Industrial Training and CA job opportunities across India on CA Dwar. Discover openings and connect with recruiters."
        canonicalPath="/"
      />

      {/* 1. First Screen: Clean, Modern, Minimal Focus on 3 Core Categories */}
      <section className="relative pt-8 sm:pt-12 pb-6 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#EEF6FC]/70 via-white to-transparent">
        <div className="max-w-7xl mx-auto">
          {/* Minimal Branding & Short Headline */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF6FC] border border-[#176FA8]/20 text-[#176FA8] text-xs font-bold uppercase tracking-wider shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#176FA8]" />
              <span>CA Dwar · Verified CA Career Gateway</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-[#173B63] tracking-tight leading-tight">
              Chartered Accountancy <span className="text-[#176FA8]">Career Opportunities</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
              Find verified openings across top CA firms and leading corporate finance teams in India.
            </p>
          </div>

          {/* Three Prominent Category Cards with Dynamic Database Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {/* Category 1: CA Articleship */}
            <div
              onClick={() => navigate('/articleship')}
              className="group relative bg-white border-2 border-[#DCE5ED] rounded-2xl p-6 sm:p-7 hover:border-[#176FA8] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#176FA8] flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#176FA8] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                    CA Intermediate
                  </span>
                </div>

                <h2 className="text-2xl font-black text-[#173B63] group-hover:text-[#176FA8] transition-colors">
                  CA Articleship
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Mandatory practical training in Audit, Tax & Advisory.
                </p>

                {/* Live Statistics Block */}
                <div className="bg-[#F8FAFC] border border-[#DCE5ED] rounded-xl p-4 my-5 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-600">Active Openings:</span>
                    <span className="font-black text-base text-[#173B63]">
                      {categoryStatsLoading ? (
                        <span className="inline-block w-8 h-4 bg-slate-200 animate-pulse rounded" />
                      ) : (
                        articleshipStats.activeOpenings
                      )}
                    </span>
                  </div>
                  <div className="h-px bg-slate-200" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-600">Applications Submitted:</span>
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
                className="w-full py-3 bg-[#173B63] hover:bg-[#176FA8] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 group-hover:bg-[#176FA8]"
              >
                <span>Explore Articleship</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Category 2: CA Industrial Training */}
            <div
              onClick={() => navigate('/industrial-training')}
              className="group relative bg-white border-2 border-[#DCE5ED] rounded-2xl p-6 sm:p-7 hover:border-purple-600 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100">
                    CA Final Students
                  </span>
                </div>

                <h2 className="text-2xl font-black text-[#173B63] group-hover:text-purple-700 transition-colors">
                  CA Industrial Training
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Corporate training in IB, Private Equity, FP&A & Treasury.
                </p>

                {/* Live Statistics Block */}
                <div className="bg-[#F8FAFC] border border-[#DCE5ED] rounded-xl p-4 my-5 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-600">Active Openings:</span>
                    <span className="font-black text-base text-[#173B63]">
                      {categoryStatsLoading ? (
                        <span className="inline-block w-8 h-4 bg-slate-200 animate-pulse rounded" />
                      ) : (
                        industrialStats.activeOpenings
                      )}
                    </span>
                  </div>
                  <div className="h-px bg-slate-200" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-600">Applications Submitted:</span>
                    <span className="font-black text-base text-purple-700">
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
                className="w-full py-3 bg-[#173B63] hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 group-hover:bg-purple-700"
              >
                <span>Explore Industrial Training</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Category 3: CA Qualified Jobs */}
            <div
              onClick={() => navigate('/ca-jobs')}
              className="group relative bg-white border-2 border-[#DCE5ED] rounded-2xl p-6 sm:p-7 hover:border-emerald-600 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    Qualified CAs
                  </span>
                </div>

                <h2 className="text-2xl font-black text-[#173B63] group-hover:text-emerald-700 transition-colors">
                  CA Qualified Jobs
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Full-time careers in Assurance, Taxation, Advisory & CFO suite.
                </p>

                {/* Live Statistics Block */}
                <div className="bg-[#F8FAFC] border border-[#DCE5ED] rounded-xl p-4 my-5 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-600">Active Openings:</span>
                    <span className="font-black text-base text-[#173B63]">
                      {categoryStatsLoading ? (
                        <span className="inline-block w-8 h-4 bg-slate-200 animate-pulse rounded" />
                      ) : (
                        caJobsStats.activeOpenings
                      )}
                    </span>
                  </div>
                  <div className="h-px bg-slate-200" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-600">Applications Submitted:</span>
                    <span className="font-black text-base text-emerald-700">
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
                className="w-full py-3 bg-[#173B63] hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 group-hover:bg-emerald-700"
              >
                <span>Explore CA Jobs</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Compact Search & Popular Tags Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#DCE5ED] rounded-2xl p-5 shadow-2xs space-y-3">
          <SearchBar />
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
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
      </section>

      {/* 3. Featured Opportunities Section */}
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

      {/* 4. Value Proposition / Trust Features */}
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

      {/* 5. Verified CA Firms & Companies Showcase */}
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

      {/* 6. Bottom CTA for CA Firms & Employers */}
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
