import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { Shield, Lock, FileText, UserCheck, AlertCircle, Mail, Phone, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  const effectiveDate = 'November 5, 2026';
  const version = '1.0';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-[#152B45]">
      <SEO
        title="Privacy Policy | CA Dwar"
        description="Learn how CA Dwar collects, uses, protects, and handles personal information, student profiles, and resume data in accordance with applicable data protection guidelines."
        canonicalPath="/privacy-policy"
      />

      {/* Breadcrumb / Back button */}
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
          <Shield className="w-3.5 h-3.5 text-[#176FA8]" />
          <span>Legal & Data Protection</span>
        </div>
        <h1 className="text-3xl font-black text-[#173B63] tracking-tight">
          CA Dwar Privacy Policy
        </h1>
        <p className="text-xs text-slate-500">
          Version {version} · Effective Date: {effectiveDate} · Standard Indian Data Protection Framework (DPDP Act, 2023)
        </p>
      </div>

      {/* Advisory Banner */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-1">
        <div className="flex items-center gap-2 font-bold text-amber-950">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Notice of Transparency</span>
        </div>
        <p className="leading-relaxed">
          CA Dwar is an independent recruitment discovery platform for the Chartered Accountancy community. We respect your personal privacy. This document outlines how your data is handled when you browse, register, post vacancies, or submit job applications on <strong>cadwar.in</strong>.
        </p>
      </div>

      {/* Policy Content */}
      <div className="bg-white border border-[#DCE5ED] rounded-2xl p-6 sm:p-8 space-y-8 text-sm leading-relaxed text-slate-700 shadow-2xs">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#173B63] flex items-center gap-2">
            <span>1. Introduction and Scope</span>
          </h2>
          <p>
            This Privacy Policy applies to the CA Dwar platform operated via <strong>https://cadwar.in</strong> ("Platform", "we", "us", or "our"). This policy governs the processing of personal information provided by students, articleship aspirants, qualified Chartered Accountants ("Candidates"), and CA firms, companies, and recruitment representatives ("Employers").
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#173B63]">
            2. Personal Information We Collect
          </h2>
          <p>We collect only the information necessary to provide specialized CA recruitment matching:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li>
              <strong>Account Registration:</strong> Full name, verified email address, contact telephone number, and hashed authentication credentials. For Google OAuth users, we receive verified basic profile details (name, email address, profile picture) from Google.
            </li>
            <li>
              <strong>Candidate Academic & Training Profile:</strong> CA curriculum milestone (CA Foundation, CA Intermediate, or CA Final), groups cleared, attempt history, preferred domain, and city.
            </li>
            <li>
              <strong>Resumes and CVs:</strong> Uploaded curriculum vitae, certificates, or linked resume documents (e.g. Google Drive URLs) submitted voluntarily by candidates for employer review.
            </li>
            <li>
              <strong>Employer & Recruiter Information:</strong> Firm or company name, ICAI Firm Registration Number (FRN) or Corporate Identification Number (CIN), registered address, recruiter name, and official hiring email addresses.
            </li>
            <li>
              <strong>Application Logs:</strong> Timestamps of vacancy submissions, job identifiers, and applicant statuses.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#173B63]">
            3. How Personal Information Is Used
          </h2>
          <p>We process your data for the following specific purposes:</p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li>To create and maintain your candidate or recruiter account.</li>
            <li>To match candidates with relevant CA Articleship, CA Industrial Training, and CA Qualified job vacancies.</li>
            <li>To transmit your application details and resume to the specific employer when you apply.</li>
            <li>To maintain candidate application history and status updates in your dashboard.</li>
            <li>To detect, prevent, and protect against duplicate submissions, fraudulent postings, or unauthorized access.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 p-4 bg-[#F0F7FF] border border-[#DCE5ED] rounded-xl">
          <h2 className="text-base font-bold text-[#173B63] flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#176FA8]" />
            <span>4. Sharing of Candidate Application Information with Employers</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
            <strong>Explicit Transparency Disclosure:</strong> When you click "Apply" or submit your profile for a vacancy on CA Dwar, your profile details, contact information, cover message, and attached CV/resume are directly transmitted to and made accessible to the verified employer or recruiter responsible for that listing.
          </p>
          <p className="text-xs text-slate-600">
            For listings that direct applicants to apply via employer email or external career portals, you interact directly with the destination employer or third-party portal under their independent privacy terms.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#173B63]">
            5. Third-Party Service Providers
          </h2>
          <p>
            CA Dwar relies on vetted infrastructure service providers to host and secure the platform:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li><strong>Cloud Hosting & CDN:</strong> Vercel Inc. (Application delivery and serverless API execution).</li>
            <li><strong>Database Storage:</strong> MongoDB Atlas (Cloud database storage with access control).</li>
            <li><strong>Authentication:</strong> Google Identity Services (Google OAuth 2.0 authentication verification).</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#173B63]">
            6. Data Retention and Account Deletion Requests
          </h2>
          <p>
            We retain your profile data and application records for as long as your account remains active or as needed to facilitate your recruitment cycle.
          </p>
          <p className="text-xs sm:text-sm">
            <strong>Right to Erasure / Deletion Process:</strong> You may request complete erasure of your account, profile data, and uploaded resumes at any time. To request deletion, send an email to the designated Privacy Contact address with the subject line <em>"Data Erasure Request - [Your Registered Email]"</em>. Your request will be fulfilled within thirty (30) business days.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#173B63]">
            7. User Rights under the Digital Personal Data Protection Act, 2023 (DPDP Act)
          </h2>
          <p>As a data principal under Indian data protection law, you have the right to:</p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li>Request a summary of personal data processed by CA Dwar.</li>
            <li>Request correction or updating of inaccurate or misleading profile information.</li>
            <li>Withdraw consent previously provided for voluntary processing.</li>
            <li>Nominate another individual in the event of death or incapacity.</li>
            <li>Access the platform's grievance redressal mechanism.</li>
          </ul>
        </section>

        {/* Section 8 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#173B63]">
            8. Data Security Practices
          </h2>
          <p>
            We implement administrative and technical safeguards including HTTPS TLS transmission encryption, parameterized database queries, password hashing using bcrypt, and strict role-based access controls to protect your data. While we take commercially reasonable measures, no internet transmission is 100% infallible.
          </p>
        </section>

        {/* Section 9 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#173B63]">
            9. Children's Privacy
          </h2>
          <p>
            CA Dwar is designed for individuals eligible to register for ICAI Chartered Accountancy examinations or commencement of practical training (typically 18 years of age or older). We do not knowingly collect personal data from minors.
          </p>
        </section>

        {/* Section 10 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#173B63]">
            10. Changes to This Privacy Policy
          </h2>
          <p>
            We may update this policy periodically to reflect platform enhancements or statutory updates. Material revisions will be reflected with a revised version number and notified upon your subsequent platform login.
          </p>
        </section>

        {/* Section 11 - Grievance Contact */}
        <section className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-lg font-bold text-[#173B63]">
            11. Grievance Redressal and Contact Details
          </h2>
          <p className="text-xs sm:text-sm">
            For questions regarding this policy, data rights inquiries, or grievance redressal, please contact:
          </p>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs text-slate-700">
            <div>
              <strong>Designated Entity / Platform:</strong> CA Dwar (cadwar.in)
            </div>
            <div>
              <strong>Founder / Data Representative:</strong> Mohit Pandey
            </div>
            <div>
              <strong>Official Privacy & Grievance Email:</strong>{' '}
              <span className="font-mono text-[#173B63]">[Official Contact Email - To be confirmed by Founder]</span>{' '}
              <span className="text-[11px] text-amber-700 font-semibold">[LEGAL REVIEW REQUIRED]</span>
            </div>
            <div>
              <strong>Grievance Officer Contact:</strong>{' '}
              <span className="font-mono text-[#173B63]">[Official Grievance Contact Number - To be confirmed by Founder]</span>{' '}
              <span className="text-[11px] text-amber-700 font-semibold">[LEGAL REVIEW REQUIRED]</span>
            </div>
            <div>
              <strong>Principal Operating Location:</strong> Mumbai, Maharashtra, India{' '}
              <span className="text-[11px] text-amber-700 font-semibold">[LEGAL REVIEW REQUIRED]</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
