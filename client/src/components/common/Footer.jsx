import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, ExternalLink, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-[#DCE5ED] mt-20 pt-12 pb-8 text-[#152B45]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-[#DCE5ED]">
          {/* SECTION A & B: About CA Dwar & Our Vision (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Section A - About CA Dwar */}
            <div>
              <Link to="/" className="inline-flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-xl bg-[#173B63] flex items-center justify-center text-white font-extrabold text-base shadow-2xs">
                  CD
                </div>
                <span className="font-extrabold text-2xl tracking-tight text-[#173B63]">
                  CA Dwar
                </span>
              </Link>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md">
                CA Dwar is a career opportunities platform connecting Chartered Accountancy students and professionals with Articleship, Industrial Training, and CA job opportunities across India.
              </p>
            </div>

            {/* Section B - Our Vision */}
            <div className="bg-[#EEF6FC]/60 border border-[#DCE5ED] rounded-xl p-4 max-w-md space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#176FA8] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#176FA8]" />
                Our Vision
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                To become India's most trusted and accessible career opportunities platform for the Chartered Accountancy community, connecting aspiring professionals with meaningful career opportunities.
              </p>
            </div>
          </div>

          {/* SECTION C: Quick Links (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#173B63]">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
              <li>
                <Link to="/" className="hover:text-[#176FA8] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="hover:text-[#176FA8] transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/articleship" className="hover:text-[#176FA8] transition-colors">
                  Articleship
                </Link>
              </li>
              <li>
                <Link to="/industrial-training" className="hover:text-[#176FA8] transition-colors">
                  Industrial Training
                </Link>
              </li>
              <li>
                <Link to="/ca-jobs" className="hover:text-[#176FA8] transition-colors">
                  CA Jobs
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#176FA8] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#176FA8] transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* SECTION D & E: Company Contact, Social & Founder (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Section D - Company Contact & Social */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#173B63]">
                Company Contact &amp; Social
              </h4>
              <div className="space-y-2 text-xs sm:text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700">Company:</span>
                  <span>CA Dwar</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#176FA8] shrink-0" />
                  <a
                    href="mailto:casetu195@gmail.com"
                    className="hover:text-[#176FA8] underline underline-offset-2 transition-colors"
                  >
                    casetu195@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#0077B5] shrink-0 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.77v8.37H6.46v-8.37M7.85 6.46a1.61 1.61 0 1 0 0 3.22 1.61 1.61 0 0 0 0-3.22Z" />
                  </svg>
                  <a
                    href="https://www.linkedin.com/company/ca-dwar/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#176FA8] font-medium inline-flex items-center gap-1 transition-colors"
                  >
                    <span>CA Dwar on LinkedIn</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              </div>
            </div>

            {/* Section E - Founder */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                Founder
              </span>
              <div className="text-xs sm:text-sm text-slate-700 space-y-1">
                <div className="font-bold text-[#173B63]">Mohit Pandey</div>
                <div className="text-[11px] text-slate-500 font-medium">Founder, CA Dwar</div>
              </div>
              <div className="pt-1 flex flex-col sm:flex-row sm:items-center gap-2.5 text-xs">
                <a
                  href="https://www.linkedin.com/in/mohitpandey195"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#0077B5] hover:underline font-semibold"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.77v8.37H6.46v-8.37M7.85 6.46a1.61 1.61 0 1 0 0 3.22 1.61 1.61 0 0 0 0-3.22Z" />
                  </svg>
                  <span>Mohit Pandey on LinkedIn</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                </a>
                <span className="hidden sm:inline text-slate-300">|</span>
                <a
                  href="tel:+919699426036"
                  className="inline-flex items-center gap-1.5 text-slate-700 hover:text-[#176FA8] font-medium"
                >
                  <Phone className="w-3 h-3 text-[#176FA8]" />
                  <span>+91 9699426036</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION F: Copyright, Note & Disclaimer */}
        <div className="pt-2 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
            <p className="font-semibold text-slate-700">
              &copy; {currentYear} CA Dwar. All Rights Reserved.
            </p>
            <span className="hidden sm:inline text-slate-300">•</span>
            <p className="text-slate-500">
              Built to connect CA talent with opportunities.
            </p>
          </div>
          <p className="text-center md:text-right max-w-xl text-[11px] text-slate-400">
            <strong>Disclaimer:</strong> CA Dwar is an independent career opportunities platform and is not affiliated, associated, authorized, or endorsed by The Institute of Chartered Accountants of India (ICAI).
          </p>
        </div>
      </div>
    </footer>
  );
}
