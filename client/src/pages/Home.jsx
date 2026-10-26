import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import SearchBar from '../components/common/SearchBar';
import JobCard from '../components/common/JobCard';
import VerifiedBadge from '../components/common/VerifiedBadge';
import {
  GraduationCap,
  Briefcase,
  Building,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Users,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function Home() {
  const { jobs, companies } = useJobs();
  const navigate = useNavigate();

  // Dynamic counts for each category
  const articleshipCount = jobs.filter(
    (j) => j.category === 'articleship' && j.status === 'Published'
  ).length;
  const industrialCount = jobs.filter(
    (j) => j.category === 'industrial-training' && j.status === 'Published'
  ).length;
  const jobsCount = jobs.filter(
    (j) => j.category === 'ca-jobs' && j.status === 'Published'
  ).length;

  // Featured jobs (up to 6)
  const featuredJobs = jobs
    .filter((j) => j.isFeatured && j.status === 'Published')
    .slice(0, 6);

  // Verified companies showcase
  const verifiedCompanies = companies.filter((c) => c.isVerified).slice(0, 6);

  return (
    <div className="space-y-16 pb-12">
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#EEF6FC]/70 via-white to-transparent">
        <div className="max-w-5xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF6FC] border border-[#176FA8]/20 text-[#176FA8] text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#176FA8]" />
            <span>Exclusively Built for the Indian CA Ecosystem</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#173B63] tracking-tight leading-[1.15]">
            Find the Right Opportunity for Your <span className="text-[#176FA8]">CA Journey</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Discover Articleship, Industrial Training and Finance leadership roles built specifically for Chartered Accountancy students and finance professionals.
          </p>

          {/* Main Search Component */}
          <div className="pt-4">
            <SearchBar />
          </div>

          {/* Quick Filter Tag Pills */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Popular Searches:</span>
            <Link
              to="/industrial-training?domain=private-equity"
              className="px-2.5 py-1 rounded-full bg-white border border-[#DCE5ED] hover:border-[#176FA8] hover:text-[#176FA8] transition-colors"
            >
              Private Equity Industrial
            </Link>
            <Link
              to="/industrial-training?domain=investment-banking"
              className="px-2.5 py-1 rounded-full bg-white border border-[#DCE5ED] hover:border-[#176FA8] hover:text-[#176FA8] transition-colors"
            >
              Investment Banking
            </Link>
            <Link
              to="/articleship?domain=statutory-audit"
              className="px-2.5 py-1 rounded-full bg-white border border-[#DCE5ED] hover:border-[#176FA8] hover:text-[#176FA8] transition-colors"
            >
              Statutory Audit
            </Link>
            <Link
              to="/articleship?city=mumbai"
              className="px-2.5 py-1 rounded-full bg-white border border-[#DCE5ED] hover:border-[#176FA8] hover:text-[#176FA8] transition-colors"
            >
              Articleship Mumbai
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Three Core Category Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-[#173B63]">
            Explore by Your CA Milestone
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Tailored categories conforming strictly to ICAI regulations and corporate training windows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Articleship */}
          <div
            onClick={() => navigate('/articleship')}
            className="group relative bg-white border border-[#DCE5ED] rounded-2xl p-6 hover:border-[#176FA8] hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#176FA8] flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#176FA8]">
                For CA Intermediate Students
              </span>
              <h3 className="text-xl font-bold text-[#173B63] mt-1 group-hover:text-[#176FA8] transition-colors">
                Articleship Training
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                2-year mandatory practical training across Statutory Audit, Direct Tax, GST, and Risk Advisory in Top 20 & reputable CA firms.
              </p>
            </div>
            <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#173B63] bg-slate-100 px-3 py-1 rounded-full">
                {articleshipCount} Active Openings
              </span>
              <span className="text-sm font-semibold text-[#176FA8] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Browse Articleship <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Card 2: Industrial Training */}
          <div
            onClick={() => navigate('/industrial-training')}
            className="group relative bg-white border border-[#DCE5ED] rounded-2xl p-6 hover:border-[#176FA8] hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-105 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                For CA Final Students
              </span>
              <h3 className="text-xl font-bold text-[#173B63] mt-1 group-hover:text-[#176FA8] transition-colors">
                Industrial Training
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                High-exposure 9 to 12-month corporate training in Investment Banking, Growth Private Equity, Corporate Finance, and FP&A.
              </p>
            </div>
            <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#173B63] bg-purple-50 text-purple-800 px-3 py-1 rounded-full">
                {industrialCount} Active Openings
              </span>
              <span className="text-sm font-semibold text-[#176FA8] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Browse Industrial <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Card 3: CA Jobs */}
          <div
            onClick={() => navigate('/ca-jobs')}
            className="group relative bg-white border border-[#DCE5ED] rounded-2xl p-6 hover:border-[#176FA8] hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-105 transition-transform">
                <Briefcase className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                For Finalists & Qualified CAs
              </span>
              <h3 className="text-xl font-bold text-[#173B63] mt-1 group-hover:text-[#176FA8] transition-colors">
                CA Qualified Jobs
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Full-time finance roles for fresher and experienced Chartered Accountants across assurance, transaction advisory, and CFO offices.
              </p>
            </div>
            <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#173B63] bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full">
                {jobsCount} Active Openings
              </span>
              <span className="text-sm font-semibold text-[#176FA8] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Browse CA Jobs <ArrowRight className="w-4 h-4" />
              </span>
            </div>
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
              Hand-picked openings from CA Dwar Verified firms and leading corporations.
            </p>
          </div>

          <Link
            to="/articleship"
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
              Generic job boards don't understand attempts, groups cleared, or ICAI transfer guidelines. We built an intentional platform just for our fraternity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/10 rounded-2xl p-5 border border-white/10 space-y-2.5">
              <ShieldCheck className="w-7 h-7 text-emerald-400" />
              <h4 className="font-bold text-base text-white">100% Verified Firms</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Zero fake postings. Every CA firm is manually authenticated via their ICAI Firm Registration Number (FRN).
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-5 border border-white/10 space-y-2.5">
              <CheckCircle2 className="w-7 h-7 text-blue-300" />
              <h4 className="font-bold text-base text-white">Transparent Stipends</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                No misleading salary tags. Clearly published monthly stipends conforming to ICAI guidelines.
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-5 border border-white/10 space-y-2.5">
              <Users className="w-7 h-7 text-purple-300" />
              <h4 className="font-bold text-base text-white">Smart CA Filters</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Filter candidates by CA Inter / Final groups cleared, attempt counts, and specialized finance skills.
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-5 border border-white/10 space-y-2.5">
              <TrendingUp className="w-7 h-7 text-amber-300" />
              <h4 className="font-bold text-base text-white">Live Application Tracker</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Never wonder where your resume went. Real-time updates from 'Under Review' to 'Shortlisted' and 'Selected'.
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
              Leading national audit networks, corporate conglomerates, and investment banks.
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

      {/* 6. Bottom CTA for CA Firms */}
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
            to="/employer/dashboard"
            className="px-6 py-3 bg-[#173B63] hover:bg-[#176FA8] text-white text-sm font-bold rounded-xl shadow-xs transition-colors shrink-0"
          >
            Post an Opportunity for Free &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
