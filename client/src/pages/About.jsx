import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, Users, BookOpen, GraduationCap, CheckCircle2 } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-[#176FA8] bg-[#EEF6FC] px-3.5 py-1 rounded-full border border-[#DCE5ED]">
          Our Mission & Vision
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#173B63] tracking-tight">
          "Your Gateway to the Right CA Career."
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          CA Dwar was created to replace the chaos of unverified WhatsApp forwarding groups, unsolicited LinkedIn cold messages, and informal nepotism with a structured, verified career platform designed exclusively for the Indian CA fraternity.
        </p>
      </div>

      {/* The 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#DCE5ED] rounded-2xl p-6 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#176FA8] flex items-center justify-center font-bold">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#173B63]">CA-First Taxonomy</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every filter respects ICAI schemes: CA Inter/Final attempts, Groups Cleared, 2-year articleship tenures, and specialized finance/tax domains.
          </p>
        </div>

        <div className="bg-white border border-[#DCE5ED] rounded-2xl p-6 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#173B63]">Verified CA Firms</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Zero fake firms. Every employer account is verified against official ICAI Firm Registration Numbers (FRN) or Corporate CIN credentials.
          </p>
        </div>

        <div className="bg-white border border-[#DCE5ED] rounded-2xl p-6 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#173B63]">Candidate Dignity</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Transparent stipends conforming to ICAI guidelines, end-to-end status tracking, and strict protection of student contact information.
          </p>
        </div>
      </div>

      {/* ICAI Disclaimer */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-xs text-slate-600 space-y-2">
        <strong className="text-slate-800 font-bold block text-sm">
          Regulatory Awareness Notice
        </strong>
        <p>
          CA Dwar is an independent private career marketplace built by professionals for the Chartered Accountancy community. It is not affiliated, officially associated, or endorsed by The Institute of Chartered Accountants of India (ICAI). All trademarks and registered names belong to their respective owners.
        </p>
      </div>
    </div>
  );
}
