import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, MapPin, Mail, Award, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#DCE5ED] mt-20 pt-12 pb-8 text-[#152B45]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-[#DCE5ED]">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#173B63] flex items-center justify-center text-white font-bold text-lg">
                CD
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-[#173B63]">
                CA Dwar
              </span>
            </Link>
            <p className="text-sm text-slate-600 max-w-sm leading-relaxed">
              <strong>"Your Gateway to the Right CA Career."</strong><br />
              India's specialized career marketplace built exclusively for CA students and finance professionals. Connecting talent with verified firms across Articleship, Industrial Training, and CA Jobs.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EEF6FC] text-[#176FA8] text-xs font-semibold rounded-full border border-[#DCE5ED]">
                <Shield className="w-3.5 h-3.5 text-[#176FA8]" />
                100% Verified Firms & Companies
              </span>
            </div>
          </div>

          {/* Core Categories */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#173B63] mb-3">
              Opportunities
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/articleship" className="hover:text-[#176FA8] transition-colors">
                  CA Articleship
                </Link>
              </li>
              <li>
                <Link to="/industrial-training" className="hover:text-[#176FA8] transition-colors">
                  CA Industrial Training
                </Link>
              </li>
              <li>
                <Link to="/ca-jobs" className="hover:text-[#176FA8] transition-colors">
                  Qualified CA Jobs
                </Link>
              </li>
              <li>
                <Link to="/companies" className="hover:text-[#176FA8] transition-colors">
                  Verified CA Firms
                </Link>
              </li>
            </ul>
          </div>

          {/* High-Finance & Audit Domains */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#173B63] mb-3">
              Top Domains
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/industrial-training?domain=private-equity" className="hover:text-[#176FA8]">
                  Private Equity
                </Link>
              </li>
              <li>
                <Link to="/industrial-training?domain=investment-banking" className="hover:text-[#176FA8]">
                  Investment Banking
                </Link>
              </li>
              <li>
                <Link to="/articleship?domain=statutory-audit" className="hover:text-[#176FA8]">
                  Statutory Audit
                </Link>
              </li>
              <li>
                <Link to="/articleship?domain=direct-tax" className="hover:text-[#176FA8]">
                  Direct Tax Advisory
                </Link>
              </li>
              <li>
                <Link to="/ca-jobs?domain=fpa" className="hover:text-[#176FA8]">
                  Corporate FP&A
                </Link>
              </li>
            </ul>
          </div>

          {/* Portals & Support */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#173B63] mb-3">
              Portals
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/student/dashboard" className="hover:text-[#176FA8]">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/employer/dashboard" className="hover:text-[#176FA8]">
                  Employer Portal
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#176FA8]">
                  About CA Dwar
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#176FA8]">
                  Support & Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ICAI Disclaimer & Legal */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} CA Dwar Technologies. All rights reserved.
          </p>
          <p className="text-center md:text-right max-w-xl">
            <strong>Disclaimer:</strong> CA Dwar is an independent career platform and is not affiliated, associated, authorized, or endorsed by The Institute of Chartered Accountants of India (ICAI).
          </p>
        </div>
      </div>
    </footer>
  );
}
