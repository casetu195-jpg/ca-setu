import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import {
  FileText,
  AlertCircle,
  ArrowLeft,
  ShieldAlert,
  Building2,
  Mail,
  Phone,
  Scale,
  Ban,
} from 'lucide-react';

export default function TermsOfUse() {
  const effectiveDate = 'November 18, 2026';
  const version = '1.1';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-[#152B45]">
      <SEO
        title="Terms of Use | CA Dwar"
        description="Review the terms and conditions governing platform access, candidate applications, employer vacancy postings, and platform usage on CA Dwar."
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
          <span>Statutory &amp; ICAI Non-Affiliation Disclaimer</span>
        </div>
        <p className="leading-relaxed">
          CA Dwar (<strong>https://cadwar.in</strong>) is an independent private technology gateway operated to simplify career and training discoveries for the Chartered Accountancy community. CA Dwar is <strong>not affiliated, endorsed, authorized, or associated with The Institute of Chartered Accountants of India (ICAI)</strong>. All training commenced (including Articleship registrations, industrial training deeds, and examination eligibility) remains governed strictly by ICAI regulations, guidelines, and applicable statutory frameworks.
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
            By accessing, browsing, registering an account, publishing vacancies, or submitting applications on <strong>https://cadwar.in</strong> ("Platform", "we", "us", or "our"), you ("User", "Candidate", or "Employer") acknowledge that you have read, understood, and agreed to be legally bound by these Terms of Use and our companion <Link to="/privacy-policy" className="text-[#176FA8] underline font-medium">Privacy Policy</Link>. If you do not agree to these terms, you must discontinue using the platform immediately.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#173B63]">
            2. Platform Purpose &amp; Scope of Service
          </h2>
          <p>
            CA Dwar operates an online career opportunities marketplace connecting Chartered Accountancy students, articleship aspirants, and qualified professionals with CA firms, corporate employers, and recruitment representatives.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li><strong>Discovery Medium:</strong> CA Dwar provides discovery and connection infrastructure. CA Dwar is not a staffing agency, employment broker, employer, or placement consultancy.</li>
            <li><strong>No Employment Relationship:</strong> Browsing opportunities or submitting an application through CA Dwar does not establish an employment contract or articleship arrangement between CA Dwar and any user.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#173B63]">
            3. Candidate User Obligations &amp; Authenticity of Information
          </h2>
          <p>Candidates using CA Dwar agree to the following obligations:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li><strong>Truthful Credentials:</strong> All profile information, including examination milestones (CA Intermediate or CA Final groups cleared), attempts count, past articleship experience, and resume content, must be truthful, authentic, and accurate.</li>
            <li><strong>Personal Use:</strong> Account credentials and profiles are strictly for individual personal career searches. You may not impersonate any other individual or submit applications on behalf of third parties without explicit authorization.</li>
            <li><strong>Independent Verification:</strong> Candidates are independently responsible for verifying employer credentials, job descriptions, stipend arrangements, working hours, and articleship registration terms before accepting any offer or signing training contracts.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#173B63]">
            4. Employer &amp; Recruiter Responsibilities
          </h2>
          <p>CA firms, corporations, and recruitment representatives posting opportunities agree that:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li><strong>Authentic Vacancies:</strong> All listings must represent genuine, active, and lawful opportunities for CA Articleship, CA Industrial Training, or qualified CA roles.</li>
            <li><strong>Accurate Firm Credentials:</strong> Firm names, ICAI Firm Registration Numbers (FRN), Corporate Identification Numbers (CIN), and contact details provided must be authentic.</li>
            <li><strong>Confidentiality of Candidate Data:</strong> Candidate resumes, profiles, and contact details received through CA Dwar must be used solely for evaluating applicants for the specific vacancy posted. Resumes and personal data may not be harvested, sold, redistributed, or repurposed for unauthorized marketing.</li>
            <li><strong>Compliance with ICAI &amp; Labor Standards:</strong> Employers are solely responsible for ensuring that training agreements, working conditions, and stipend payments comply with ICAI regulations and applicable Indian labor laws.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-4 p-5 bg-[#F8FAFC] border border-[#DCE5ED] rounded-2xl">
          <h2 className="text-base font-bold text-[#173B63] flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#176FA8]" />
            <span>5. Vacancy Listings &amp; Application Workflows</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            CA Dwar publishes two categories of vacancy announcements to give candidates wide access to opportunities:
          </p>

          <div className="space-y-3 text-xs">
            <div className="p-4 bg-white border border-[#DCE5ED] rounded-xl space-y-1.5">
              <strong className="text-slate-900 block text-sm">A. Employer-Published Vacancies (Direct Platform Listings)</strong>
              <p className="text-slate-600 leading-relaxed">
                Vacancies posted directly by registered employers allow candidates to apply via CA Dwar's 1-click application system. When you apply, your profile data and attached resume are transmitted to the hiring employer's dashboard for review.
              </p>
            </div>

            <div className="p-4 bg-white border border-[#DCE5ED] rounded-xl space-y-1.5">
              <strong className="text-slate-900 block text-sm">B. Admin-Published &amp; Curated External Vacancies</strong>
              <p className="text-slate-600 leading-relaxed">
                To maximize opportunity awareness, platform administrators curate vacancies from public corporate career portals, LinkedIn notices, firm announcements, and reputable hiring sources. Depending on the listing:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Candidates may be directed to email the hiring recruiter directly from their own email address.</li>
                <li>Candidates may be directed to external application destinations, such as an employer's official career page, Google Form, Microsoft Form, or corporate Applicant Tracking System (ATS).</li>
              </ul>
              <p className="text-slate-600 leading-relaxed font-medium pt-1">
                <strong>External Destinations Notice:</strong> External application websites are operated independently by third parties under their own terms and privacy practices. CA Dwar has no control over third-party websites and bears no liability for their availability, content, or data practices.
              </p>
            </div>
          </div>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#173B63] flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>6. No Guarantee of Recruitment Outcomes</span>
          </h2>
          <p>
            CA Dwar provides technological infrastructure to facilitate career discovery, but makes no warranties regarding recruitment outcomes:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li>We do not guarantee that an employer will review, shortlist, or respond to an application.</li>
            <li>We do not guarantee the scheduling of interviews, offers of articleship, or selection for any role.</li>
            <li>All hiring, interviewing, and selection decisions rest exclusively with the respective employers.</li>
            <li>While administrative reviews are conducted to filter listings, CA Dwar does not guarantee the absolute authenticity, accuracy, or continuous availability of every external opportunity unless explicitly verified.</li>
          </ul>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#173B63] flex items-center gap-2">
            <Ban className="w-4 h-4 text-rose-600" />
            <span>7. Prohibited Conduct &amp; Platform Security</span>
          </h2>
          <p>Users agree not to engage in any of the following prohibited activities:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li><strong>Automated Scraping:</strong> Using bots, crawlers, spiders, automated scripts, or data-mining tools to extract candidate profiles, recruiter contact information, or vacancy records.</li>
            <li><strong>Misleading or Spam Listings:</strong> Publishing non-existent, duplicate, deceptive, or commercial advertisements disguised as recruitment opportunities.</li>
            <li><strong>Fee Demands:</strong> Charging candidates any monetary fee or consideration for applying to, interviewing for, or securing a vacancy listed on CA Dwar.</li>
            <li><strong>Security Circumvention:</strong> Probing vulnerabilities, attempting unauthorized access to administrative features, spoofing identities, or tampering with verification indicators.</li>
          </ul>
        </section>

        {/* Section 8 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#173B63]">
            8. Intellectual Property
          </h2>
          <p>
            The CA Dwar platform, brand name, logo, graphic designs, user interface layouts, software code, database structures, and documentation are the proprietary intellectual property of CA Dwar. Users are granted a limited, non-exclusive, non-transferable license to access the platform for legitimate career and recruitment purposes.
          </p>
          <p className="text-xs text-slate-500">
            Third-party firm names, trademarks, corporate logos, and brand emblems appearing in vacancy listings belong to their respective corporate owners. Their display on CA Dwar is strictly descriptive and does not imply endorsement by or affiliation with CA Dwar.
          </p>
        </section>

        {/* Section 9 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#173B63]">
            9. Account Suspension &amp; Termination
          </h2>
          <p>
            CA Dwar reserves the right to suspend, restrict, or terminate user accounts, with or without notice, in the event of:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li>Breach of these Terms of Use or the Privacy Policy.</li>
            <li>Submission of fraudulent, fabricated, or deceptive credentials or vacancies.</li>
            <li>Harassment, spamming, or misuse of candidate or recruiter contact information.</li>
            <li>Legal or regulatory directives requiring account restriction.</li>
          </ul>
          <p className="text-xs text-slate-500">
            Users may terminate their account at any time by submitting an account deletion request to <a href="mailto:hellocadwar@gmail.com" className="text-[#176FA8] underline font-medium">hellocadwar@gmail.com</a>.
          </p>
        </section>

        {/* Section 10 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#173B63] flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#176FA8]" />
            <span>10. Limitation of Liability</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            To the maximum extent permitted under applicable Indian law (including the Information Technology Act, 2000 and associated intermediary guidelines):
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
            <li>
              CA Dwar, its founder, representatives, and operators shall not be liable for any indirect, incidental, consequential, special, or punitive damages arising from the use of, or inability to use, the platform or any vacancy listings.
            </li>
            <li>
              CA Dwar bears no liability for hiring decisions, employment disputes, workplace disputes, articleship registration disagreements, or stipend payment issues arising between candidates and employers.
            </li>
            <li>
              CA Dwar operates as an online platform and does not warrant that the website will be entirely uninterrupted, error-free, or free from server downtimes.
            </li>
            <li>
              Nothing in these terms limits or excludes liability that cannot be lawfully limited or excluded under applicable Indian statutory law.
            </li>
          </ul>
        </section>

        {/* Section 11 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#173B63]">
            11. Governing Law &amp; Dispute Resolution
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            These Terms of Use and any dispute, claim, or controversy arising out of or in connection with the platform shall be governed by, interpreted, and construed in accordance with the substantive laws of India.
          </p>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Any legal suit, action, or proceeding arising out of or relating to these Terms or platform access shall be subject to the exclusive jurisdiction of the competent courts located in <strong>Mumbai, Maharashtra, India</strong>.
          </p>
        </section>

        {/* Section 12 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#173B63]">
            12. Modifications to Terms of Use
          </h2>
          <p>
            CA Dwar reserves the right to revise these Terms of Use periodically to reflect changes in our platform features, operational practices, or legal and statutory obligations. Any revisions will be published on this page with an updated version number and effective date. Continued access or use of the platform after revised terms are published constitutes your acceptance of the updated terms.
          </p>
        </section>

        {/* Section 13 - Contact & Inquiries */}
        <section className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-lg font-bold text-[#173B63]">
            13. Official Contact Details
          </h2>
          <p className="text-xs sm:text-sm">
            For questions, clarifications, or concerns regarding these Terms of Use, please reach out to our designated representative:
          </p>
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs text-slate-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <strong className="block text-slate-900 font-bold mb-0.5">Platform Name:</strong>
                <span>CA Dwar (cadwar.in)</span>
              </div>
              <div>
                <strong className="block text-slate-900 font-bold mb-0.5">Founder / Designated Representative:</strong>
                <span className="font-semibold text-[#173B63]">Mohit Pandey</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-[#176FA8] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 font-bold mb-0.5">Official Inquiries Email:</strong>
                  <a
                    href="mailto:hellocadwar@gmail.com"
                    className="text-[#176FA8] hover:text-[#173B63] underline font-medium break-all"
                  >
                    hellocadwar@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#176FA8] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 font-bold mb-0.5">Official Company Contact Number:</strong>
                  <a
                    href="tel:+917263004376"
                    className="text-slate-800 hover:text-[#176FA8] font-medium"
                  >
                    +91 7263004376
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <strong className="block text-slate-900 font-bold mb-0.5">Operating Location:</strong>
              <span>Mumbai, Maharashtra, India</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
