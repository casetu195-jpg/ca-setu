import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import {
  Shield,
  Lock,
  UserCheck,
  AlertCircle,
  Mail,
  Phone,
  ArrowLeft,
  Server,
} from 'lucide-react';

export default function PrivacyPolicy() {
  const effectiveDate = 'November 18, 2026';
  const version = '1.1';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-[#152B45]">
      <SEO
        title="Privacy Policy | CA Dwar"
        description="Learn how CA Dwar collects, processes, protects, and stores user information, candidate profiles, and job application data in accordance with applicable Indian data protection frameworks."
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
          <span>Legal &amp; Data Protection</span>
        </div>
        <h1 className="text-3xl font-black text-[#173B63] tracking-tight">
          CA Dwar Privacy Policy
        </h1>
        <p className="text-xs text-slate-500">
          Version {version} · Effective Date: {effectiveDate} · Applicable to all Visitors, Candidates &amp; Employers
        </p>
      </div>

      {/* Advisory Banner */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-1">
        <div className="flex items-center gap-2 font-bold text-amber-950">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Notice of Transparency</span>
        </div>
        <p className="leading-relaxed">
          CA Dwar (operated at <strong>https://cadwar.in</strong>) is an independent career opportunities discovery platform built specifically for the Chartered Accountancy community. We value your privacy and believe in complete operational transparency. This Privacy Policy accurately describes the personal information we collect, how it is processed and secured, how candidate applications are shared with prospective employers, and how you can exercise your data rights.
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
            This Privacy Policy applies to the CA Dwar website and platform accessible at <strong>https://cadwar.in</strong> ("Platform", "we", "us", or "our"). This policy governs the processing of personal data provided by:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li>
              <strong>Candidates:</strong> Chartered Accountancy students seeking CA Articleship, CA Finalists seeking CA Industrial Training, and qualified Chartered Accountants seeking full-time professional positions.
            </li>
            <li>
              <strong>Employers &amp; Recruiters:</strong> Chartered Accountancy partnership firms, sole proprietorships, corporate enterprises, multinational corporations (MNCs), and authorized hiring representatives posting vacancies or receiving applications.
            </li>
            <li>
              <strong>Visitors:</strong> Individuals browsing publicly accessible vacancy listings and career resources on the platform.
            </li>
          </ul>
          <p className="text-xs text-slate-500">
            By creating an account, browsing listings, submitting a profile, or applying for vacancies on CA Dwar, you acknowledge the data handling practices described in this policy.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-[#173B63]">
            2. Personal Information We Actually Collect and Process
          </h2>
          <p>
            CA Dwar collects only the specific data necessary to deliver specialized Chartered Accountancy career matching. We do not collect unnecessary personal details, biometrics, or sensitive financial data. The information collected depends on how you interact with the platform:
          </p>

          {/* Sub-block A */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <h3 className="font-bold text-[#173B63] text-xs uppercase tracking-wider">
              A. Candidate Account Registration &amp; Authentication
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>
                <strong>Email/Password Registration:</strong> Full legal name, email address, password (cryptographically hashed using bcrypt before storage; plaintext passwords are never stored or accessible), and an optional mobile contact number (used for WhatsApp/SMS recruitment updates if provided).
              </li>
              <li>
                <strong>Google Sign-In / OAuth:</strong> If you choose one-click Google Sign-In, we authenticate your identity via Google Identity Services. We receive and store your verified email address, Google account name, Google subject identifier (sub), and your Google profile picture URL (avatar). No password is created, collected, or stored for Google-authenticated accounts.
              </li>
              <li>
                <strong>Consent Records:</strong> Separate affirmative records confirming acceptance of this Privacy Policy and the Terms of Use, along with policy version and timestamp.
              </li>
            </ul>
          </div>

          {/* Sub-block B */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <h3 className="font-bold text-[#173B63] text-xs uppercase tracking-wider">
              B. Candidate Profile &amp; Career Record (Voluntary)
            </h3>
            <p className="text-xs text-slate-600">
              To enable 1-click vacancy applications, registered candidates may populate their professional profile:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li><strong>Current CA Stage:</strong> CA Intermediate student, CA Finalist / Trainee, or Qualified Chartered Accountant.</li>
              <li><strong>Examination Milestones:</strong> Groups cleared (Both Groups, Group 1 Only, or Group 2 Only) and exam attempts count (1st attempt, 2 attempts, or 3+ attempts).</li>
              <li><strong>Location &amp; Work Preferences:</strong> Current residential city, preferred hiring cities, and preferred work mode (On-site, Hybrid, or Remote).</li>
              <li><strong>Functional Domain Interests:</strong> Areas of interest (e.g., Statutory Audit &amp; Assurance, Direct Tax, Indirect Tax / GST, Internal Audit &amp; Risk Advisory, Transfer Pricing, Valuation, Corporate Finance, Investment Banking).</li>
              <li><strong>Professional Summary &amp; Skills:</strong> A short personal summary/bio, selected technical software skills (e.g., Tally, SAP, Excel, PowerBI), and an optional LinkedIn profile link.</li>
              <li><strong>Resume Details:</strong> Resume document file name and resume URL (e.g. hosted link or file reference) submitted by the candidate.</li>
              <li><strong>Optional Reference Field:</strong> An optional ICAI Student Registration Number field exists in the profile model, but is not verified against ICAI databases or mandated for platform access.</li>
            </ul>
          </div>

          {/* Sub-block C */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <h3 className="font-bold text-[#173B63] text-xs uppercase tracking-wider">
              C. Employer &amp; Recruiter Registration
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li><strong>Account Credentials:</strong> Recruiter/partner full name, official hiring email address, password (hashed), and optional contact number.</li>
              <li><strong>Firm &amp; Organization Details:</strong> Firm/Company name, firm category (e.g., Partnership/LLP, Sole Proprietorship, Top 20 National Firm, Big 4 / Big 6, Corporate / MNC, Boutique Advisory), office city, physical address, firm website URL, and organization description.</li>
              <li><strong>Statutory Reference:</strong> ICAI Firm Registration Number (FRN) or Corporate Identification Number (CIN) provided by the employer for identity clarity.</li>
            </ul>
          </div>

          {/* Sub-block D */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <h3 className="font-bold text-[#173B63] text-xs uppercase tracking-wider">
              D. Vacancy Publishing &amp; Application Records
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>
                <strong>Vacancy Records:</strong> Role title, category (Articleship, Industrial Training, CA Jobs), domain, location, work mode, stipend range, eligibility requirements, attempt criteria, job description, deadline, application method, and application destination.
              </li>
              <li>
                <strong>Internal Application Submissions:</strong> When a candidate applies internally, the application record stores: candidate ID, job ID, candidate name, candidate email, phone number, CA stage, groups cleared, attempts count, city, custom cover note, resume URL, application timestamp, and recruitment status (Applied, Under Review, Shortlisted, Interview, Selected, Rejected).
              </li>
            </ul>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
            <strong>What We Do Not Collect:</strong> CA Dwar does not collect Aadhaar numbers, PAN cards, passport copies, biometric identifiers, bank account or credit card numbers, or physical academic marksheets. We never request payment details from students.
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#173B63]">
            3. Purpose of Data Processing
          </h2>
          <p>We process personal data strictly for legitimate operational purposes:</p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li><strong>Account Administration:</strong> Creating and securing user accounts, authenticating logins via password or Google OAuth, and maintaining user sessions.</li>
            <li><strong>Profile &amp; Career Matching:</strong> Allowing candidates to manage their professional profile and discover relevant CA Articleship, Industrial Training, or qualified job opportunities.</li>
            <li><strong>Application Facilitation:</strong> Enabling candidates to submit applications to prospective employers and tracking their application status.</li>
            <li><strong>Employer Recruitment Management:</strong> Providing hiring employers with applicant information for vacancies they have published.</li>
            <li><strong>Platform Security &amp; Integrity:</strong> Preventing duplicate submissions through compound database indexing, safeguarding against unauthorized account access, and screening out abusive or fraudulent listings.</li>
            <li><strong>User Communication &amp; Support:</strong> Responding to inquiries sent to our official support and grievance channels.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-4 p-5 bg-[#F0F7FF] border border-[#DCE5ED] rounded-2xl">
          <h2 className="text-base font-bold text-[#173B63] flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#176FA8]" />
            <span>4. Application Information Sharing Workflows</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
            CA Dwar operates two distinct vacancy workflows. It is essential to understand how your information is handled in each case:
          </p>

          <div className="space-y-3 text-xs">
            {/* Workflow A */}
            <div className="p-4 bg-white border border-[#DCE5ED] rounded-xl space-y-1.5">
              <span className="font-bold text-[#173B63] block text-sm">
                A. Employer-Posted Vacancies (Internal Platform Applications)
              </span>
              <p className="text-slate-600 leading-relaxed">
                When an employer posts a vacancy directly on CA Dwar and you click "Apply Now", your profile details (Full Name, Email, Mobile Number, CA Stage, Groups Cleared, Attempts Count, City), custom cover note, and attached resume PDF URL are directly transmitted to and made accessible to the verified employer within their secure Employer Dashboard.
              </p>
              <p className="text-slate-600 leading-relaxed">
                The hiring employer acts as an independent data controller regarding their hiring evaluations. They may review your qualifications, contact you for interviews, update your application status, or download your resume. Employers contractually agree to use applicant information strictly for evaluating candidates for the specified opening.
              </p>
            </div>

            {/* Workflow B */}
            <div className="p-4 bg-white border border-[#DCE5ED] rounded-xl space-y-1.5">
              <span className="font-bold text-[#173B63] block text-sm">
                B. Admin-Published &amp; Curated External Vacancies
              </span>
              <p className="text-slate-600 leading-relaxed">
                To assist students in discovering opportunities across the CA ecosystem, CA Dwar administrators may publish curated opportunities collected from verified public sources, company career portals, LinkedIn, firm announcements, or recruitment notices.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Depending on the vacancy, the application button on CA Dwar operates in one of the following ways:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>
                  <strong>Direct Recruiter Email:</strong> Clicking "Apply via Email" opens a pre-composed message in your personal email client addressed directly to the hiring firm's recruiter email. CA Dwar does <em>not</em> intercept, read, or store the contents or attachments of emails you send directly to recruiters.
                </li>
                <li>
                  <strong>External Application URL:</strong> Clicking "Apply on Company Site" directs you to an external destination, such as the employer's official career portal, Google Form, Microsoft Form, or corporate Applicant Tracking System (ATS).
                </li>
              </ul>
              <p className="text-slate-600 leading-relaxed font-medium pt-1">
                <strong>Third-Party Site Interaction:</strong> When you follow an external link, you leave CA Dwar. Any personal data, marks, or resumes you submit on external forms or company websites are governed entirely by the third party's privacy policy and terms. CA Dwar does not receive, process, or store data submitted on third-party websites.
              </p>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
              <strong>Verification Clarification:</strong> Opportunities on CA Dwar carry distinct indicators. While admin-curated vacancies undergo administrative source review, a listing does not imply that every external employer has undergone on-site or statutory audit by CA Dwar unless explicitly marked with the verified badge.
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#173B63] flex items-center gap-2">
            <Server className="w-4 h-4 text-[#176FA8]" />
            <span>5. Third-Party Service Providers</span>
          </h2>
          <p>
            CA Dwar relies on reputable cloud infrastructure and authentication providers to operate securely. We share personal data only to the minimum extent required for hosting and operating the platform:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li>
              <strong>Hosting &amp; Serverless Execution:</strong> Vercel Inc. hosts the web application delivery and serverless API functions, providing high availability, SSL/TLS certificates, and DDoS mitigation.
            </li>
            <li>
              <strong>Cloud Database Infrastructure:</strong> MongoDB Atlas (MongoDB Inc.) provides managed cloud database storage with network firewall isolation, automated backups, and encryption at rest.
            </li>
            <li>
              <strong>Authentication Services:</strong> Google Identity Services (Google LLC) is used to verify credentials when users choose Google OAuth Sign-In.
            </li>
            <li>
              <strong>Resume Storage &amp; Document Links:</strong> Resumes submitted by candidates are stored as URL document links (such as cloud-hosted URLs or candidate-provided references) recorded in MongoDB Atlas. CA Dwar does not employ undisclosed third-party document processing vendors.
            </li>
          </ul>
          <p className="text-xs text-slate-500">
            We do not sell, rent, lease, or trade personal data to third-party commercial brokers, advertising aggregators, or unauthorized third parties.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#173B63]">
            6. Cookies, Local Storage &amp; Tracking Technologies
          </h2>
          <p>
            CA Dwar is committed to a clean, tracking-free experience for students and recruiters:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li>
              <strong>No Third-Party Advertising Trackers:</strong> CA Dwar does not use third-party behavioral advertising cookies, cross-site tracking pixels (such as Meta Pixel), or invasive ad-targeting scripts.
            </li>
            <li>
              <strong>Browser Local Storage:</strong> We utilize modern browser local storage (<code>localStorage</code>) strictly for essential platform functionality: maintaining your authenticated session token (<code>ca_setu_token</code>) and caching user display information (<code>ca_setu_user</code>) so you remain logged in across page refreshes.
            </li>
            <li>
              <strong>Google Identity Cookies:</strong> When you initiate Google Sign-In, Google may set authentication and security cookies governed by Google's independent privacy policy.
            </li>
          </ul>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#173B63]">
            7. Data Retention and Account Deletion Requests
          </h2>
          <p>
            We retain your account credentials, profile details, and vacancy records for as long as your account remains active on CA Dwar, or as needed to maintain your active recruitment cycle and application records.
          </p>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <h3 className="font-bold text-[#173B63] text-sm">How to Request Account &amp; Personal Data Deletion</h3>
            <p className="text-slate-600 leading-relaxed">
              You have the right to request the permanent deletion of your CA Dwar account, profile record, and platform application history at any time. To submit a deletion request:
            </p>
            <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1 font-mono text-slate-800">
              <div>To: <a href="mailto:hellocadwar@gmail.com" className="text-[#176FA8] underline font-bold">hellocadwar@gmail.com</a></div>
              <div>Subject: Data Deletion Request - [Your Registered Email]</div>
            </div>
            <p className="text-slate-600 leading-relaxed pt-1">
              Upon verifying account ownership, our administrative team will delete your account and personal profile from our active database. Please note:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-500">
              <li>Application details, contact summaries, or CVs that were already transmitted to or downloaded by prospective employers prior to your deletion request remain in the possession of those employers under their independent recruitment records.</li>
              <li>Basic transaction logs, security event logs, or records required for legal, fraud prevention, or regulatory compliance under applicable Indian laws may be retained for the minimum period mandated by law.</li>
            </ul>
          </div>
        </section>

        {/* Section 8 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#173B63]">
            8. User Privacy Rights under Indian Law
          </h2>
          <p>
            CA Dwar respects the rights of data principals under the Digital Personal Data Protection Act, 2023 (DPDP Act, 2023) and applicable Indian information technology regulations:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li><strong>Right to Access:</strong> You may request an intelligible summary of the personal information processed by CA Dwar and details of sharing.</li>
            <li><strong>Right to Correction &amp; Updating:</strong> You may edit, update, or correct your profile data, contact details, CA stage, or resume at any time via your Student Profile settings.</li>
            <li><strong>Right to Erasure:</strong> You may request the deletion of personal data that is no longer necessary for the purpose for which it was collected.</li>
            <li><strong>Right to Grievance Redressal:</strong> You have the right to access readily available grievance redressal through our designated contact.</li>
            <li><strong>Right to Nominate:</strong> You have the right to nominate another individual to exercise your data rights in the event of death or incapacity, in accordance with applicable rules under the DPDP Act.</li>
            <li><strong>Right to Withdraw Consent:</strong> Where processing is based on voluntary consent, you may withdraw your consent at any time, subject to legal obligations.</li>
          </ul>
        </section>

        {/* Section 9 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#173B63] flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#176FA8]" />
            <span>9. Data Security Implementation</span>
          </h2>
          <p>
            CA Dwar implements technical and administrative security measures appropriate to the nature of the data processed:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li><strong>Encryption in Transit:</strong> All web traffic and API communications are transmitted exclusively over HTTPS utilizing modern TLS 1.2 and TLS 1.3 encryption protocols.</li>
            <li><strong>Password Protection:</strong> Account passwords are encrypted using bcrypt password hashing with cryptographic salt rounds. Plaintext passwords are never stored in databases, logs, or system backups.</li>
            <li><strong>Cryptographic Session Tokens:</strong> Authenticated sessions use industry-standard JSON Web Tokens (JWT) signed with secret keys.</li>
            <li><strong>Role-Based Access Control (RBAC):</strong> Strict authorization middleware prevents cross-role data access; public user accounts cannot elevate privileges to administrative roles.</li>
            <li><strong>Database Protections:</strong> MongoDB Atlas infrastructure enforces firewall IP restrictions, role-based database authentication, and parameterized query construction to protect against injection attacks.</li>
            <li><strong>Application Destination Filtering:</strong> Outbound links undergo strict safety screening to prevent redirection to known job aggregators, spam domains, or masking shorteners.</li>
          </ul>
          <p className="text-xs text-slate-500">
            While we apply commercially reasonable safeguards, no internet-based platform or electronic transmission can guarantee 100% invulnerability. Users are advised to safeguard their account passwords and exercise due care.
          </p>
        </section>

        {/* Section 10 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#173B63]">
            10. Children's Privacy
          </h2>
          <p>
            CA Dwar is an educational and career gateway designed for students and professionals pursuing the Chartered Accountancy course (CA Foundation, CA Intermediate, CA Final, or qualified CAs). Candidates pursuing practical training (Articleship or Industrial Training) are typically 18 years of age or older.
          </p>
          <p className="text-xs sm:text-sm">
            The platform does not knowingly collect personal information from minors without parental or guardian guidance where required by applicable law. If a parent or legal guardian becomes aware that a minor has submitted personal information without required authorization, they may contact us at <a href="mailto:hellocadwar@gmail.com" className="text-[#176FA8] underline font-medium">hellocadwar@gmail.com</a> to request immediate review and deletion.
          </p>
        </section>

        {/* Section 11 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#173B63]">
            11. Amendments to This Privacy Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time to reflect platform enhancements, operational changes, or statutory developments under Indian data protection law. When revisions are made, the revised version number and effective date at the top of this document will be updated. Continued use of the platform following the publication of an updated policy signifies your acknowledgment of the changes.
          </p>
        </section>

        {/* Section 12 - Grievance Redressal and Contact Details */}
        <section className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-lg font-bold text-[#173B63]">
            12. Grievance Redressal and Official Contact Details
          </h2>
          <p className="text-xs sm:text-sm">
            For questions regarding this Privacy Policy, personal data handling, account deletion requests, or privacy grievances, please contact our designated representative:
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
                  <strong className="block text-slate-900 font-bold mb-0.5">Official Privacy &amp; Support Email:</strong>
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
