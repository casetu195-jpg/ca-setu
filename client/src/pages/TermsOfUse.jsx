import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { FileText, AlertCircle, ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function TermsOfUse() {
  const effectiveDate = 'November 5, 2026';
  const version = '1.0';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-[#152B45]">
      <SEO
        title="Terms of Use | CA Dwar"
        description="Review the terms and conditions governing access, candidate applications, employer postings, and platform usage on CA Dwar."
        canonicalPath="/terms-of-use"
      />

      {/* Back button */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#176FA8] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Homepage</span>
        </Link>
      </div>

      {/* Header */}
      <div className="border-b border-[#DCE5ED] pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF6FC] border border-[#176FA8]/20 text-[#173B63] text-xs font-bold uppercase tracking-wider">
          <FileText className="w-3.5 h-3.5 text-[#176FA8]" />
          <span>Platform Agreement</span>
        </div>
        <h1 className="text-3xl font-black text-[#173B63] tracking-tight">
          CA Dwar Terms of Use
        </h1>
        <p className="text-xs text-slate-500">
          Version {version} · Effective Date: {effectiveDate} · Applicable to all Registered Users and Visitors
        </p>
      </div>

      {/* ICAI Non-Affiliation Disclaimer Banner */}
      <div className="p-4 bg-slate-50 border border-slate-300 rounded-2xl text-xs text-slate-700 space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <AlertCircle className="w-4 h-4 text-slate-600 shrink-0" />
          <span>Statutory & Non-Affiliation Disclaimer</span>
        </div>
        <p className="leading-relaxed">
          CA Dwar is an independent technology gateway operated to simplify career discoveries for Chartered Accountancy candidates. CA Dwar is <strong>not affiliated, endorsed, authorized, or associated with The Institute of Chartered Accountants of India (ICAI)</strong>. All training commenced remains subject to ICAI regulations and guidelines.
        </p>
      </div>

      {/* Content Body */}
      <div className="bg-white border border-[#DCE5ED] rounded-2xl p-6 sm:p-8 space-y-8 text-sm leading-relaxed text-slate-700 shadow-2xs">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#173B63]">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing, browsing, registering an account, posting vacancies, or applying for opportunities on <strong>https://cadwar.in</strong> ("Platform"), you acknowledge that you have read, understood, and agreed to be bound by these Terms of Use and our companion Privacy Policy.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#173B63]">
            2. Candidate User Obligations & Authenticity of Information
          </h2>
          <p>As a candidate using CA Dwar, you agree that:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li>All personal details, academic milestones (ICAI Registration, Inter/Final groups cleared, attempts count), and uploaded resume data submitted are authentic, current, and truthful.</li>
            <li>You will not misrepresent your eligibility, articleship status, or examination results.</li>
            <li>You will use the platform strictly for legitimate personal employment or training searches.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#173B63]">
            3. Employer & Recruiter Responsibilities
          </h2>
          <p>Employers and recruiters posting opportunities agree that:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li>All listings represent genuine, active vacancies for CA Articleship, CA Industrial Training, or qualified CA positions.</li>
            <li>Firm Registration Numbers (FRN) or Corporate CINs provided are accurate and valid.</li>
            <li>Candidate information and resumes obtained through the platform will be used strictly for evaluating applicants for the specified vacancy and will not be sold, redistributed, or repurposed.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 p-4 bg-[#F8FAFC] border border-[#DCE5ED] rounded-xl">
          <h2 className="text-base font-bold text-[#173B63]">
            4. Third-Party Links & External Application Processes
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Certain vacancies published on CA Dwar direct applicants to external career portals, Google Forms, or corporate applicant tracking systems. CA Dwar does not operate, control, or endorse third-party websites and bears no liability for their availability, content, or data practices.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#173B63]">
            5. Prohibited Conduct & Platform Security
          </h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li>Engage in automated scraping, data mining, or harvesting of applicant profiles or vacancy records.</li>
            <li>Submit unsolicited spam, fraudulent recruitment announcements, or commercial advertisements.</li>
            <li>Attempt to bypass security boundaries, spoof user identities, or manipulate platform verification badges.</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#173B63]">
            6. Intellectual Property
          </h2>
          <p>
            The CA Dwar name, logo, user interface designs, database schemas, and proprietary code are the exclusive intellectual property of CA Dwar. Third-party brand names, company logos, and trademarks appearing in vacancy announcements belong to their respective corporate owners.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#173B63]">
            7. Limitation of Liability <span className="text-xs text-amber-700 font-semibold">[LEGAL REVIEW REQUIRED]</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            To the maximum extent permitted by applicable Indian law, CA Dwar and its operators shall not be liable for any direct, indirect, incidental, or consequential damages resulting from your use or inability to use the platform, recruitment outcomes, hiring decisions made by employers, or communications between candidates and recruiters.
          </p>
        </section>

        {/* Section 8 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#173B63]">
            8. Governing Law & Dispute Resolution <span className="text-xs text-amber-700 font-semibold">[LEGAL REVIEW REQUIRED]</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            These Terms of Use shall be governed by and construed in accordance with the laws of India. Any legal dispute or claim arising in connection with the platform shall be subject to the exclusive jurisdiction of the competent courts in Mumbai, Maharashtra, India.
          </p>
        </section>

        {/* Section 9 */}
        <section className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-lg font-bold text-[#173B63]">
            9. Contact & Inquiries
          </h2>
          <p className="text-xs sm:text-sm">
            For questions regarding these Terms of Use, please reach out via:
          </p>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs text-slate-700">
            <div><strong>Platform:</strong> CA Dwar (cadwar.in)</div>
            <div><strong>Designated Contact:</strong> Mohit Pandey</div>
            <div>
              <strong>Official Email:</strong>{' '}
              <span className="font-mono text-[#173B63]">[Official Contact Email - To be confirmed by Founder]</span>{' '}
              <span className="text-[11px] text-amber-700 font-semibold">[LEGAL REVIEW REQUIRED]</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
