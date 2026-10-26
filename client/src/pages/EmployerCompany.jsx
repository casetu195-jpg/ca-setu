import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobContext';
import VerifiedBadge from '../components/common/VerifiedBadge';
import { initialCities } from '../services/mockData';
import { Building2, ShieldCheck, CheckCircle2, Upload, AlertCircle, Save } from 'lucide-react';

export default function EmployerCompany() {
  const { user } = useAuth();
  const { companies } = useJobs();

  const company =
    companies.find((c) => c.id === user?.companyId) || companies[0];

  const [formData, setFormData] = useState({
    name: company?.name || 'Motilal Oswal Alternates',
    firmType: company?.firmType || 'Corporate / MNC',
    registrationNumber: company?.registrationNumber || 'U67190MH2006PTC160583',
    city: company?.city || 'Mumbai',
    address: company?.address || 'Motilal Oswal Tower, Gokhale Road, Prabhadevi, Mumbai 400025',
    website: company?.website || 'https://www.motilaloswalalternates.com',
    description: company?.description || 'Alternative asset management arm of Motilal Oswal Financial Services, managing over $2 Billion across Private Equity and Real Estate funds.',
  });

  const [docUploaded, setDocUploaded] = useState(true);
  const [msg, setMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMsg('Company profile submitted successfully for verification!');
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#DCE5ED]">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#176FA8]">
            <Building2 className="w-4 h-4" />
            <span>Employer Profile & KYC</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#173B63] mt-1">
            CA Firm / Company Verification
          </h1>
          <p className="text-sm text-slate-600">
            Submit your official ICAI Firm Registration Number (FRN) or Corporate CIN to receive the CA Dwar Verified badge.
          </p>
        </div>

        {company.isVerified ? (
          <VerifiedBadge size="md" />
        ) : (
          <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-200">
            Verification Pending
          </span>
        )}
      </div>

      {msg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{msg}</span>
        </div>
      )}

      {/* Compliance Notice */}
      <div className="p-4 bg-[#EEF6FC] border border-[#176FA8]/20 rounded-2xl flex items-start gap-3 text-xs text-[#152B45]">
        <ShieldCheck className="w-5 h-5 text-[#176FA8] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-[#173B63] block font-bold">
            CA Dwar Marketplace Trust Standard (Rule BR-01 & BR-02)
          </strong>
          <p className="text-slate-600 leading-relaxed">
            To protect CA students from fraudulent postings and unverified entities, only CA firms and registered corporate entities with a verified FRN or CIN can publish vacancies. Badges are granted solely by platform administrators.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-[#DCE5ED] rounded-2xl p-6 sm:p-7 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-[#173B63]">
            Firm Legal & Registration Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Official Registered Entity Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#176FA8] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Firm Classification
              </label>
              <select
                name="firmType"
                value={formData.firmType}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#176FA8] focus:outline-hidden"
              >
                <option value="Top 20 National Firm">Top 20 National Firm</option>
                <option value="Big 4 / Big 6">Big 4 / Big 6 Network Firm</option>
                <option value="Partnership / LLP">Partnership / LLP CA Firm</option>
                <option value="Sole Proprietorship">Sole Proprietorship CA Firm</option>
                <option value="Corporate / MNC">Corporate / MNC (Industrial Training)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                ICAI Firm Registration Number (FRN) or Corporate CIN
              </label>
              <input
                type="text"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#176FA8] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Headquarters City
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#176FA8] focus:outline-hidden"
              >
                {initialCities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Principal Office Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#176FA8] focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Official Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#176FA8] focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Firm Overview & Areas of Practice
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#176FA8] focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Verification Document Upload Box */}
        <div className="bg-white border border-[#DCE5ED] rounded-2xl p-6 sm:p-7 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-[#173B63]">
            Verification Document (ICAI Constitution Certificate or RoC Incorporation)
          </h2>
          <div className="border border-dashed border-[#176FA8]/40 bg-[#EEF6FC]/30 rounded-2xl p-6 text-center space-y-3">
            <ShieldCheck className="w-8 h-8 text-[#176FA8] mx-auto" />
            <div>
              <p className="text-sm font-bold text-[#152B45]">
                {docUploaded
                  ? 'ICAI_Firm_Constitution_Certificate_2026.pdf (Uploaded)'
                  : 'Upload Certificate of Constitution / MCA Incorporation Certificate'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                PDF or Scanned Copy · Inspected manually by CA Dwar operations
              </p>
            </div>
            <label className="inline-block px-4 py-2 bg-white border border-[#DCE5ED] hover:bg-slate-50 text-[#173B63] font-semibold rounded-xl text-xs cursor-pointer shadow-2xs transition-colors">
              <Upload className="w-3.5 h-3.5 text-[#176FA8] inline mr-1" />
              <span>Replace Verification Document</span>
              <input
                type="file"
                accept=".pdf,.jpg,.png"
                onChange={() => setDocUploaded(true)}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-[#173B63] hover:bg-[#176FA8] text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Update Company Profile & Submit</span>
          </button>
        </div>
      </form>
    </div>
  );
}
