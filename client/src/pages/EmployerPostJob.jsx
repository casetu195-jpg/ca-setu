import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobContext';
import { initialCities, initialDomains } from '../services/mockData';
import { PlusCircle, Save, Send, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function EmployerPostJob() {
  const { user } = useAuth();
  const { postNewJob, companies } = useJobs();
  const navigate = useNavigate();

  const company =
    companies.find((c) => c.id === user?.companyId) || companies[0];

  const [formData, setFormData] = useState({
    title: '',
    category: 'articleship',
    domain: 'Statutory Audit & Assurance',
    city: 'Mumbai',
    workMode: 'On-site',
    stipendMin: 15000,
    stipendMax: 22000,
    stipendPeriod: 'Monthly',
    openVacancies: 2,
    requiredGroups: 'Both Groups',
    attempts: 'First / Second Attempt',
    eligibility: 'CA Intermediate cleared (Both Groups preferred)',
    deadline: '20 days left',
    description: '',
    responsibilitiesText: '',
    skillsText: '',
    isFeatured: false,
  });

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const domainsList =
    formData.category === 'articleship'
      ? initialDomains.articleship
      : formData.category === 'industrial-training'
      ? initialDomains.industrial
      : initialDomains.jobs;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCategoryChange = (e) => {
    const newCat = e.target.value;
    const newDomains =
      newCat === 'articleship'
        ? initialDomains.articleship
        : newCat === 'industrial-training'
        ? initialDomains.industrial
        : initialDomains.jobs;

    setFormData((prev) => ({
      ...prev,
      category: newCat,
      domain: newDomains[0],
      stipendPeriod: newCat === 'ca-jobs' ? 'Per Annum' : 'Monthly',
      stipendMin: newCat === 'ca-jobs' ? 900000 : 15000,
      stipendMax: newCat === 'ca-jobs' ? 1200000 : 25000,
    }));
  };

  const handleSubmit = (e, asDraft = false) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      setError('Please provide a job title and detailed role description.');
      return;
    }

    const responsibilities = formData.responsibilitiesText
      ? formData.responsibilitiesText
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean)
      : ['Perform analytical reviews and audit testing.', 'Ensure Ind AS compliance.'];

    const requiredSkills = formData.skillsText
      ? formData.skillsText
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : ['Accounting Principles', 'MS Excel', 'Ind AS'];

    const newJob = postNewJob(
      {
        ...formData,
        categoryName:
          formData.category === 'articleship'
            ? 'Articleship'
            : formData.category === 'industrial-training'
            ? 'Industrial Training'
            : 'CA Jobs',
        responsibilities,
        requiredSkills,
        status: asDraft ? 'Draft' : company.isVerified ? 'Published' : 'Pending Review',
      },
      company.id
    );

    setSuccessMsg(
      asDraft
        ? 'Job saved as draft successfully!'
        : company.isVerified
        ? 'Opportunity published live on CA Dwar!'
        : 'Job submitted for Admin review!'
    );

    setTimeout(() => {
      navigate('/employer/jobs');
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="pb-6 border-b border-[#DCE5ED]">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#176FA8]">
          <PlusCircle className="w-4 h-4" />
          <span>Vacancy Creator</span>
        </div>
        <h1 className="text-2xl font-extrabold text-[#173B63] mt-1">
          Post an Opportunity for CA Aspirants
        </h1>
        <p className="text-sm text-slate-600">
          Target students and finance professionals with structured CA fields.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
        {/* Basic Classification */}
        <div className="bg-white border border-[#DCE5ED] rounded-2xl p-6 sm:p-7 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-[#173B63]">
            1. Role Title & Core Category
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Opportunity Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. CA Article Trainee – Statutory Audit & Assurance"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#176FA8] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Target Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleCategoryChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#176FA8] focus:outline-hidden font-semibold text-[#173B63]"
              >
                <option value="articleship">CA Articleship (Intermediate)</option>
                <option value="industrial-training">CA Industrial Training (Final)</option>
                <option value="ca-jobs">CA Qualified Jobs (Full-Time)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Specialized Domain *
              </label>
              <select
                name="domain"
                value={formData.domain}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#176FA8] focus:outline-hidden"
              >
                {domainsList.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Location & Eligibility */}
        <div className="bg-white border border-[#DCE5ED] rounded-2xl p-6 sm:p-7 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-[#173B63]">
            2. Location, Work Mode & Candidate Eligibility
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                City / Location
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

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Work Mode
              </label>
              <select
                name="workMode"
                value={formData.workMode}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#176FA8] focus:outline-hidden"
              >
                <option value="On-site">On-site (Office / Client)</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Open Vacancies
              </label>
              <input
                type="number"
                name="openVacancies"
                min="1"
                value={formData.openVacancies}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#176FA8] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Groups Cleared Prerequisite
              </label>
              <select
                name="requiredGroups"
                value={formData.requiredGroups}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#176FA8] focus:outline-hidden"
              >
                <option value="Both Groups">Both Groups Cleared</option>
                <option value="Group 1">Group 1 Cleared</option>
                <option value="Group 2">Group 2 Cleared</option>
                <option value="Either Group">Either Group Cleared</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Attempts Filter
              </label>
              <select
                name="attempts"
                value={formData.attempts}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#176FA8] focus:outline-hidden"
              >
                <option value="First Attempt Preferred">First Attempt Preferred</option>
                <option value="Max 2 Attempts">Max 2 Attempts</option>
                <option value="Any">Any Number of Attempts</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Application Deadline
              </label>
              <input
                type="text"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                placeholder="e.g. 15 days left"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#176FA8] focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Eligibility Summary Line
              </label>
              <input
                type="text"
                name="eligibility"
                value={formData.eligibility}
                onChange={handleChange}
                placeholder="e.g. CA Final student eligible for min 12 months of Industrial Training"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#176FA8] focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Compensation (Stipend / CTC) */}
        <div className="bg-white border border-[#DCE5ED] rounded-2xl p-6 sm:p-7 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-[#173B63]">
            3. Compensation (Monthly Stipend or Annual CTC)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Minimum Amount (INR)
              </label>
              <input
                type="number"
                name="stipendMin"
                value={formData.stipendMin}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#176FA8] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Maximum Amount (INR)
              </label>
              <input
                type="number"
                name="stipendMax"
                value={formData.stipendMax}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#176FA8] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Period
              </label>
              <select
                name="stipendPeriod"
                value={formData.stipendPeriod}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#176FA8] focus:outline-hidden"
              >
                <option value="Monthly">Monthly (Stipend)</option>
                <option value="Per Annum">Per Annum (CTC for Jobs)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Detailed Description & Responsibilities */}
        <div className="bg-white border border-[#DCE5ED] rounded-2xl p-6 sm:p-7 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-[#173B63]">
            4. Role Overview, Responsibilities & Skills
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Role Description *
              </label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe team structure, client exposure, and what the candidate will work on..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#176FA8] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Key Responsibilities (One per line)
              </label>
              <textarea
                name="responsibilitiesText"
                rows={3}
                value={formData.responsibilitiesText}
                onChange={handleChange}
                placeholder="Conduct statutory testing of revenue and fixed assets&#10;Draft CARO 2020 compliance reports&#10;Interact directly with client controllers"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#176FA8] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Required Technical Skills (Comma-separated)
              </label>
              <input
                type="text"
                name="skillsText"
                value={formData.skillsText}
                onChange={handleChange}
                placeholder="e.g. Ind AS, Financial Modeling, Advanced Excel, Tally Prime"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#176FA8] focus:outline-hidden"
              />
            </div>

            <div className="pt-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="isFeatured"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="rounded border-slate-300 text-[#176FA8] focus:ring-[#176FA8]"
              />
              <label htmlFor="isFeatured" className="text-xs text-slate-700 font-medium">
                Request <strong>Featured Spotlight</strong> placement on homepage & top of search feeds
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            className="px-5 py-2.5 border border-[#DCE5ED] text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save as Draft</span>
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#173B63] hover:bg-[#176FA8] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
            <span>Publish Vacancy</span>
          </button>
        </div>
      </form>
    </div>
  );
}
