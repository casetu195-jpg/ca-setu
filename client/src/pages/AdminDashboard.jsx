import React from 'react';
import { Link } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import VerifiedBadge from '../components/common/VerifiedBadge';
import SEO from '../components/common/SEO';
import {
  ShieldCheck,
  Building2,
  Briefcase,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function AdminDashboard() {
  const { jobs, companies, applications, adminVerifyCompany, adminApproveJob, adminRejectJob } = useJobs();

  const pendingCompanies = companies.filter((c) => !c.isVerified);
  const verifiedCompanies = companies.filter((c) => c.isVerified);
  const pendingJobs = jobs.filter((j) => j.status === 'Pending Review');
  const publishedJobs = jobs.filter((j) => j.status === 'Published');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEO title="Admin Governance Dashboard | CA Dwar" noindex={true} />
      {/* Top Header */}
      <div className="bg-[#173B63] text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
              Governance & Trust Center
            </span>
            <span className="text-emerald-300 text-xs font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Platform Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            CA Dwar Administration Operations
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            Authenticate ICAI Firm Registration Numbers (FRN), approve job postings, and safeguard marketplace integrity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/companies"
            className="px-4 py-2 bg-white text-[#173B63] hover:bg-slate-100 font-bold text-xs rounded-xl transition-colors"
          >
            Verification Queue ({pendingCompanies.length})
          </Link>
          <Link
            to="/admin/jobs"
            className="px-4 py-2 bg-[#176FA8] hover:bg-[#135d8d] text-white font-bold text-xs rounded-xl transition-colors"
          >
            Job Moderation ({pendingJobs.length})
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white border border-[#DCE5ED] rounded-2xl p-5 shadow-2xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Pending Firm Verifications
          </span>
          <div className="text-2xl font-extrabold text-amber-600">
            {pendingCompanies.length}
          </div>
          <p className="text-[11px] text-amber-700 font-medium">Awaiting FRN check</p>
        </div>

        <div className="bg-white border border-[#DCE5ED] rounded-2xl p-5 shadow-2xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Verified CA Firms
          </span>
          <div className="text-2xl font-extrabold text-emerald-700">
            {verifiedCompanies.length}
          </div>
          <p className="text-[11px] text-emerald-600 font-medium">Authorized to publish</p>
        </div>

        <div className="bg-white border border-[#DCE5ED] rounded-2xl p-5 shadow-2xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Live Published Jobs
          </span>
          <div className="text-2xl font-extrabold text-[#173B63]">
            {publishedJobs.length}
          </div>
          <p className="text-[11px] text-slate-500">Active marketplace listings</p>
        </div>

        <div className="bg-white border border-[#DCE5ED] rounded-2xl p-5 shadow-2xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Applications
          </span>
          <div className="text-2xl font-extrabold text-[#176FA8]">
            {applications.length}
          </div>
          <p className="text-[11px] text-slate-500">Throughput submitted</p>
        </div>
      </div>

      {/* Two Column Queues: Firm KYC Queue & Job Approval Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Pending Firm Verifications */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#173B63] flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#176FA8]" />
              CA Firm Verification Queue ({pendingCompanies.length})
            </h2>
            <Link
              to="/admin/companies"
              className="text-xs font-bold text-[#176FA8] hover:underline"
            >
              All Companies &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {pendingCompanies.length === 0 ? (
              <div className="bg-white border border-[#DCE5ED] rounded-2xl p-8 text-center text-xs text-slate-500">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                All employer verification requests are currently clear!
              </div>
            ) : (
              pendingCompanies.map((c) => (
                <div
                  key={c.id}
                  className="bg-white border border-[#DCE5ED] rounded-2xl p-5 shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-base font-bold text-[#152B45]">{c.name}</h4>
                      <p className="text-xs text-slate-500">
                        {c.firmType} · {c.city}
                      </p>
                      <p className="text-xs font-semibold text-[#173B63] mt-1">
                        FRN / CIN: {c.registrationNumber}
                      </p>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                      Pending
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {c.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => adminVerifyCompany(c.id, false)}
                      className="px-3 py-1.5 border border-slate-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-lg"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => adminVerifyCompany(c.id, true)}
                      className="px-4 py-1.5 bg-[#16805C] hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-2xs flex items-center gap-1"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Approve & Verify</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Pending Job Listings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#173B63] flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#176FA8]" />
              Job Moderation Queue ({pendingJobs.length})
            </h2>
            <Link
              to="/admin/jobs"
              className="text-xs font-bold text-[#176FA8] hover:underline"
            >
              All Jobs &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {pendingJobs.length === 0 ? (
              <div className="bg-white border border-[#DCE5ED] rounded-2xl p-8 text-center text-xs text-slate-500">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                No job postings awaiting moderation review!
              </div>
            ) : (
              pendingJobs.map((j) => (
                <div
                  key={j.id}
                  className="bg-white border border-[#DCE5ED] rounded-2xl p-5 shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-base font-bold text-[#152B45]">{j.title}</h4>
                      <p className="text-xs text-slate-500">
                        {j.categoryName} · {j.city} · {j.domain}
                      </p>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                      Review Needed
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {j.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => adminRejectJob(j.id)}
                      className="px-3 py-1.5 border border-slate-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-lg"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => adminApproveJob(j.id)}
                      className="px-4 py-1.5 bg-[#173B63] hover:bg-[#176FA8] text-white text-xs font-bold rounded-lg shadow-2xs"
                    >
                      Approve & Publish Live
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
