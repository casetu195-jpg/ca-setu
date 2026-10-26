import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import {
  GraduationCap,
  Briefcase,
  Building2,
  ShieldCheck,
  Target,
  Compass,
  ArrowRight,
  ExternalLink,
  Phone,
  Mail,
} from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <SEO
        title="About CA Dwar | Vision, Mission & CA Career Bridge"
        description="Learn about CA Dwar, India's dedicated career opportunities platform connecting Chartered Accountancy students and professionals with Articleship, Industrial Training, and CA Jobs."
        canonicalPath="/about"
      />

      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-[#176FA8] bg-[#EEF6FC] px-3.5 py-1.5 rounded-full border border-[#DCE5ED]">
          About Our Platform
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#173B63] tracking-tight">
          India's Dedicated Career Platform for Chartered Accountants
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          CA Dwar is a career opportunities platform focused on Chartered Accountancy students and professionals in India. We bridge the gap between aspiring finance professionals and meaningful career opportunities across CA Articleship, CA Industrial Training, and Qualified CA Jobs.
        </p>
      </div>

      {/* Vision & Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company Vision */}
        <div className="bg-white border border-[#DCE5ED] rounded-2xl p-6 sm:p-8 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#176FA8] flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#173B63]">Our Vision</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            To become India's most trusted and accessible career opportunities platform for the Chartered Accountancy community, creating a bridge between aspiring CA professionals and meaningful career opportunities.
          </p>
        </div>

        {/* Company Mission */}
        <div className="bg-white border border-[#DCE5ED] rounded-2xl p-6 sm:p-8 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#173B63]">Our Mission</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            To simplify the discovery of CA Articleship, Industrial Training, and CA job opportunities by bringing relevant openings together on one accessible platform and helping recruiters connect with suitable CA talent.
          </p>
        </div>
      </div>

      {/* Three Core Opportunity Streams */}
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-[#173B63]">
            Our Core Focus Areas
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Every opportunity on CA Dwar aligns with standard Chartered Accountancy career stages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-[#DCE5ED] rounded-2xl p-6 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#EEF6FC] text-[#176FA8] flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#173B63]">1. CA Articleship</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Connecting CA Inter students (Both Groups or Single Group cleared) with reputable practicing CA firms for mandatory practical articleship training across Statutory Audit, Internal Audit, Direct Tax, GST, and Advisory.
            </p>
            <Link
              to="/articleship"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#176FA8] hover:underline pt-2"
            >
              <span>Explore Articleship</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white border border-[#DCE5ED] rounded-2xl p-6 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#173B63]">2. CA Industrial Training</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Curated openings for CA Finalists looking for high-exposure 9 to 12 months industrial training in Investment Banking, Private Equity, Corporate FP&amp;A, Treasury, and multinational financial institutions.
            </p>
            <Link
              to="/industrial-training"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#176FA8] hover:underline pt-2"
            >
              <span>Explore Industrial Training</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white border border-[#DCE5ED] rounded-2xl p-6 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#173B63]">3. Qualified CA Jobs</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Career opportunities for fresh and experienced Qualified Chartered Accountants with leading firms, corporate enterprises, and startups seeking finance, compliance, taxation, and controller talent.
            </p>
            <Link
              to="/ca-jobs"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#176FA8] hover:underline pt-2"
            >
              <span>Explore CA Jobs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Value to Stakeholders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8">
        <div className="space-y-3">
          <h3 className="text-base font-bold text-[#173B63]">
            For Students &amp; CA Professionals
          </h3>
          <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
            <li className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#176FA8] shrink-0 mt-0.5" />
              <span>Direct access to verified CA firms and corporate openings without unverified social forward chains.</span>
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#176FA8] shrink-0 mt-0.5" />
              <span>Search filters tailored to CA requirements: Attempts, Groups Cleared, Specialization Domains, and Locations.</span>
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#176FA8] shrink-0 mt-0.5" />
              <span>Transparent opportunity descriptions, stipends, and direct contact details.</span>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-bold text-[#173B63]">
            For CA Firms &amp; Recruiters
          </h3>
          <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
            <li className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Reach a dedicated talent pool of CA Inter students, CA Finalists, and qualified Chartered Accountants.</span>
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Publish detailed vacancy requirements with attempt criteria, group requirements, and domain specifics.</span>
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Maintain your firm's professional presence in the Chartered Accountancy community.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Founder & Official Links */}
      <div className="bg-white border border-[#DCE5ED] rounded-2xl p-6 sm:p-8 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCE5ED] pb-5">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#176FA8]">
              Founder &amp; Leadership
            </span>
            <h2 className="text-xl font-bold text-[#173B63] mt-0.5">Mohit Pandey</h2>
            <p className="text-xs text-slate-600">Founder, CA Dwar</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://www.linkedin.com/in/mohitpandey195"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0077B5] hover:bg-[#005E93] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.77v8.37H6.46v-8.37M7.85 6.46a1.61 1.61 0 1 0 0 3.22 1.61 1.61 0 0 0 0-3.22Z" />
              </svg>
              <span>Founder LinkedIn</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://www.linkedin.com/company/ca-dwar/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#EEF6FC] hover:bg-[#DCE5ED] text-[#173B63] text-xs font-semibold rounded-xl border border-[#DCE5ED] transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-[#0077B5] fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.77v8.37H6.46v-8.37M7.85 6.46a1.61 1.61 0 1 0 0 3.22 1.61 1.61 0 0 0 0-3.22Z" />
              </svg>
              <span>Company LinkedIn</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-[#176FA8]" />
            <span>Contact: </span>
            <a href="mailto:casetu195@gmail.com" className="text-[#176FA8] underline font-medium">
              casetu195@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-[#176FA8]" />
            <span>Phone: </span>
            <a href="tel:+919699426036" className="text-slate-800 font-medium hover:text-[#176FA8]">
              +91 9699426036
            </a>
          </div>
        </div>
      </div>

      {/* Regulatory Awareness Notice */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs text-slate-600 space-y-1.5">
        <strong className="text-slate-800 font-bold block">
          Regulatory Awareness Notice
        </strong>
        <p className="leading-relaxed text-[11px] sm:text-xs">
          CA Dwar is an independent private career marketplace built for the Chartered Accountancy fraternity. It is not affiliated, officially associated, or endorsed by The Institute of Chartered Accountants of India (ICAI). All institute trademarks and designated names belong to their respective owners.
        </p>
      </div>
    </div>
  );
}
