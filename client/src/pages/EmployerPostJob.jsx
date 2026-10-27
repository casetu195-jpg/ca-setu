import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobContext';
import { initialCities, initialDomains } from '../services/mockData';
import { parseLinkedInPost } from '../utils/linkedInParser';
import {
  PlusCircle,
  Save,
  Send,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Link as LinkIcon,
  RotateCcw,
  Edit3,
} from 'lucide-react';

export default function EmployerPostJob() {
  const { user } = useAuth();
  const { postNewJob, editJob, jobs, companies } = useJobs();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const isAdmin = user?.role === 'admin';
  const defaultCompany =
    companies.find((c) => c.id === user?.companyId) || (!isAdmin ? companies[0] : null);

  const [customDomain, setCustomDomain] = useState('');

  const [formData, setFormData] = useState({
    companyName: isAdmin ? '' : (defaultCompany?.name || ''),
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
    applicationLink: '',
    recruiterEmail: '',
    isFeatured: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // LinkedIn Quick Import State (Admin Only)
  const [linkedInText, setLinkedInText] = useState('');
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [linkedInNotice, setLinkedInNotice] = useState(null);

  // If in edit mode, populate existing job data
  useEffect(() => {
    if (editId && jobs && jobs.length > 0) {
      const existing = jobs.find((j) => j.id === editId || j._id === editId);
      if (existing) {
        setIsEditing(true);
        const comp = companies.find((c) => c.id === existing.companyId);
        const cat = existing.category || 'articleship';
        const targetDomains =
          cat === 'articleship'
            ? initialDomains.articleship
            : cat === 'industrial-training'
            ? initialDomains.industrial
            : initialDomains.jobs;
        const isCustom = existing.domain && !targetDomains.includes(existing.domain);

        setFormData({
          companyName: existing.companyName || comp?.name || '',
          title: existing.title || '',
          category: cat,
          domain: isCustom ? 'Other' : existing.domain || targetDomains[0],
          city: existing.city || 'Mumbai',
          workMode: existing.workMode || 'On-site',
          stipendMin: existing.stipendMin || 15000,
          stipendMax: existing.stipendMax || 25000,
          stipendPeriod: existing.stipendPeriod || 'Monthly',
          openVacancies: existing.openVacancies || 1,
          requiredGroups: existing.requiredGroups || 'Both Groups',
          attempts: existing.attempts || 'Any',
          eligibility: existing.eligibility || '',
          deadline: existing.deadline || '15 days left',
          description: existing.description || '',
          responsibilitiesText: Array.isArray(existing.responsibilities)
            ? existing.responsibilities.join('\n')
            : '',
          skillsText: Array.isArray(existing.requiredSkills)
            ? existing.requiredSkills.join(', ')
            : '',
          applicationLink: existing.applicationLink || '',
          recruiterEmail: existing.recruiterEmail || '',
          isFeatured: existing.isFeatured || false,
        });

        if (isCustom) {
          setCustomDomain(existing.domain);
        }
      }
    }
  }, [editId, jobs, companies]);

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

    setCustomDomain('');
    setFormData((prev) => ({
      ...prev,
      category: newCat,
      domain: newDomains[0],
      stipendPeriod: newCat === 'ca-jobs' ? 'Per Annum' : 'Monthly',
      stipendMin: newCat === 'ca-jobs' ? 900000 : 15000,
      stipendMax: newCat === 'ca-jobs' ? 1200000 : 25000,
      eligibility:
        newCat === 'industrial-training'
          ? 'CA Finalist with min 12 months of completed articleship'
          : newCat === 'ca-jobs'
          ? 'Qualified Chartered Accountant (ICAI Member)'
          : 'CA Intermediate cleared (Both Groups preferred)',
    }));
  };

  // LinkedIn Auto-Fill Action (Admin Only)
  const handleLinkedInAutoFill = () => {
    setError('');
    setLinkedInNotice(null);

    const result = parseLinkedInPost(linkedInText, linkedInUrl);
    if (!result.success) {
      setError(result.error);
      return;
    }

    const { extracted, isCaRelated } = result;

    const targetDomains =
      extracted.category === 'articleship'
        ? initialDomains.articleship
        : extracted.category === 'industrial-training'
        ? initialDomains.industrial
        : initialDomains.jobs;

    const isDomainKnown = targetDomains.includes(extracted.domain);

    setFormData((prev) => ({
      ...prev,
      ...extracted,
      domain: isDomainKnown ? extracted.domain : (extracted.domain ? 'Other' : targetDomains[0]),
      companyName: extracted.companyName || prev.companyName,
    }));

    if (!isDomainKnown && extracted.domain) {
      setCustomDomain(extracted.domain);
    } else {
      setCustomDomain('');
    }

    if (!isCaRelated) {
      setLinkedInNotice({
        type: 'warning',
        message:
          'Warning: This post does not appear to mention CA Articleship, Industrial Training, or Qualified CA keywords. Please review the category and fields carefully.',
      });
    } else {
      setLinkedInNotice({
        type: 'success',
        message:
          'LinkedIn post parsed successfully! Fields have been auto-filled below. Please review before publishing.',
      });
    }
  };

  const handleClearImport = () => {
    setLinkedInText('');
    setLinkedInUrl('');
    setLinkedInNotice(null);
  };

  const handleSubmit = async (e, asDraft = false) => {
    e.preventDefault();
    setError('');

    if (!formData.companyName || !formData.companyName.trim()) {
      setError('Please provide a Company / Firm Name.');
      return;
    }

    if (!formData.title || !formData.description) {
      setError('Please provide an opportunity title and detailed role description.');
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

    const categoryName =
      formData.category === 'articleship'
        ? 'Articleship'
        : formData.category === 'industrial-training'
        ? 'Industrial Training'
        : 'CA Jobs';

    if (formData.domain === 'Other' && !customDomain.trim()) {
      setError('Please specify the custom domain name.');
      return;
    }

    const finalDomain =
      formData.domain === 'Other' ? customDomain.trim() : formData.domain;

    const finalEligibility =
      formData.eligibility?.trim() ||
      (formData.category === 'industrial-training'
        ? 'CA Finalist with min 12 months of completed articleship'
        : formData.category === 'ca-jobs'
        ? 'Qualified Chartered Accountant (ICAI Member)'
        : 'CA Intermediate cleared (Both Groups preferred)');

    const payload = {
      ...formData,
      eligibility: finalEligibility,
      domain: finalDomain,
      companyName: formData.companyName.trim(),
      categoryName,
      responsibilities,
      requiredSkills,
      status: asDraft
        ? 'Draft'
        : isAdmin
        ? 'Published'
        : defaultCompany?.isVerified
        ? 'Published'
        : 'Pending Review',
    };

    try {
      if (isEditing && editId) {
        await editJob(editId, payload);
        setSuccessMsg('Opportunity updated successfully in database!');
        setTimeout(() => {
          navigate(isAdmin ? '/admin/jobs' : '/employer/jobs');
        }, 1000);
        return;
      }

      await postNewJob(payload);

      setSuccessMsg(
        asDraft
          ? 'Job saved as draft successfully!'
          : isAdmin
          ? 'Opportunity published live on CA Dwar!'
          : defaultCompany?.isVerified
          ? 'Opportunity published live on CA Dwar!'
          : 'Job submitted for Admin review!'
      );

      setTimeout(() => {
        navigate(isAdmin ? '/admin/jobs' : '/employer/jobs');
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to save opportunity to database. Please check all fields.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="pb-6 border-b border-[#DCE5ED] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#176FA8]">
            {isEditing ? <Edit3 className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
            <span>{isEditing ? 'Opportunity Editor' : 'Vacancy Creator'}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#173B63] mt-1">
            {isEditing ? 'Edit Opportunity Listing' : 'Post an Opportunity for CA Aspirants'}
          </h1>
          <p className="text-sm text-slate-600">
            {isEditing
              ? 'Update opportunity details, stipend, or requirements.'
              : 'Target students and finance professionals with structured CA fields.'}
          </p>
        </div>

        {isAdmin && (
          <span className="text-xs font-bold px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full self-start sm:self-center">
            Founder Admin Mode
          </span>
        )}
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

      {/* ADMIN-ONLY: LinkedIn Quick Import Section */}
      {isAdmin && !isEditing && (
        <div className="bg-gradient-to-r from-blue-50/70 to-indigo-50/70 border border-[#176FA8]/30 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#0077B5] text-white flex items-center justify-center font-bold text-xs">
                in
              </div>
              <h2 className="text-base font-bold text-[#173B63]">
                Quick Import – LinkedIn Job Post
              </h2>
            </div>
            <span className="text-[11px] font-semibold text-slate-500">
              Paste raw content below to auto-populate all CA fields
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Full LinkedIn Post Content *
              </label>
              <textarea
                rows={4}
                value={linkedInText}
                onChange={(e) => setLinkedInText(e.target.value)}
                placeholder="Paste the full text of the LinkedIn job post here (e.g. 'Deloitte is hiring CA Article Assistants in Statutory Audit...')..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-[#152B45] bg-white focus:border-[#176FA8] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                LinkedIn Post URL (Optional)
              </label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={linkedInUrl}
                  onChange={(e) => setLinkedInUrl(e.target.value)}
                  placeholder="https://www.linkedin.com/posts/..."
                  className="w-full pl-10 pr-3 py-2 text-xs text-[#152B45] bg-white rounded-xl border border-slate-300 focus:border-[#176FA8] focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleLinkedInAutoFill}
                disabled={!linkedInText.trim()}
                className="px-4 py-2 bg-[#0077B5] hover:bg-[#005f93] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto-Fill Job Details</span>
              </button>

              {linkedInText && (
                <button
                  type="button"
                  onClick={handleClearImport}
                  className="px-3 py-2 border border-slate-300 hover:bg-slate-100 text-slate-600 text-xs font-semibold rounded-xl flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {linkedInNotice && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
                  linkedInNotice.type === 'warning'
                    ? 'bg-amber-50 border-amber-200 text-amber-800'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800 font-medium'
                }`}
              >
                {linkedInNotice.type === 'warning' ? (
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                )}
                <span>{linkedInNotice.message}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Job Form */}
      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
        {/* Section 1: Company & Classification */}
        <div className="bg-white border border-[#DCE5ED] rounded-2xl p-6 sm:p-7 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-[#173B63]">
            1. Firm Name & Opportunity Classification
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Mandatory Company / Firm Name */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Company / Firm Name *
              </label>
              <input
                type="text"
                name="companyName"
                required
                value={formData.companyName}
                onChange={handleChange}
                placeholder={
                  isAdmin
                    ? "e.g. Tata 1mg / Hetero / Deloitte / Singhal & Associates CA"
                    : "e.g. BDO India LLP / Deloitte / Singhal & Associates CA"
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#176FA8] focus:outline-hidden font-semibold text-[#173B63]"
              />
            </div>

            {/* Opportunity Title */}
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

            {/* Strictly 3 Categories */}
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
                <option value="articleship">CA Articleship</option>
                <option value="industrial-training">CA Industrial Training</option>
                <option value="ca-jobs">CA Jobs</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Specialized Domain *
              </label>
              <select
                name="domain"
                value={formData.domain}
                onChange={(e) => {
                  handleChange(e);
                  if (e.target.value !== 'Other') setCustomDomain('');
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#176FA8] focus:outline-hidden"
              >
                {domainsList.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Specify Domain when 'Other' is selected */}
            {formData.domain === 'Other' && (
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Specify Domain *
                </label>
                <input
                  type="text"
                  name="customDomain"
                  required
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder="Enter custom domain (e.g. ESG Advisory, Forensic Audit, Crypto Taxation...)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#176FA8] focus:outline-hidden font-medium text-[#173B63]"
                />
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Location, Mode & Vacancies */}
        <div className="bg-white border border-[#DCE5ED] rounded-2xl p-6 sm:p-7 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-[#173B63]">
            2. Location, Work Mode & Vacancies
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
                  <option key={c} value={c}>
                    {c}
                  </option>
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
                min={1}
                name="openVacancies"
                value={formData.openVacancies}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#176FA8] focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Eligibility & Compensation */}
        <div className="bg-white border border-[#DCE5ED] rounded-2xl p-6 sm:p-7 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-[#173B63]">
            3. Candidate Eligibility & Compensation
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Groups Required
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
                <option value="Either Group">Either Group</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Attempt Criteria
              </label>
              <input
                type="text"
                name="attempts"
                value={formData.attempts}
                onChange={handleChange}
                placeholder="e.g. First Attempt Preferred / Max 2 Attempts"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#176FA8] focus:outline-hidden"
              />
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
                placeholder={
                  formData.category === 'industrial-training'
                    ? 'CA Finalist with min 12 months of completed articleship'
                    : formData.category === 'ca-jobs'
                    ? 'e.g. Qualified Chartered Accountant (ICAI Member)'
                    : 'e.g. CA Intermediate cleared (Both Groups preferred)'
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#176FA8] focus:outline-hidden"
              />
              {formData.category === 'industrial-training' && (
                <p className="text-[11px] text-slate-500 mt-1">
                  CA Dwar Platform Criterion: CA Finalist with min 12 months of completed articleship.
                </p>
              )}
            </div>

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

        {/* Section 4: Description, Responsibilities & Skills */}
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
          </div>
        </div>

        {/* Section 5: Application Channels & Spotlights */}
        <div className="bg-white border border-[#DCE5ED] rounded-2xl p-6 sm:p-7 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-[#173B63]">
            5. Application Channels & Featured Placement
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Official Application Portal / Link (Optional)
              </label>
              <input
                type="url"
                name="applicationLink"
                value={formData.applicationLink}
                onChange={handleChange}
                placeholder="https://company.com/careers/apply/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#176FA8] focus:outline-hidden"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Candidates can click to apply on external portal in addition to 1-click CV apply.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Recruiter / HR Email (Optional)
              </label>
              <input
                type="email"
                name="recruiterEmail"
                value={formData.recruiterEmail}
                onChange={handleChange}
                placeholder="careers@firm.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#176FA8] focus:outline-hidden"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Display direct email for candidates to send resumes directly.
              </p>
            </div>

            <div className="sm:col-span-2 pt-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="isFeatured"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="rounded border-slate-300 text-[#176FA8] focus:ring-[#176FA8]"
              />
              <label htmlFor="isFeatured" className="text-xs text-slate-700 font-medium">
                Mark as <strong>Featured Spotlight</strong> (highlighted with gold badge on homepage & categories)
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {!isEditing && (
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              className="px-5 py-2.5 border border-[#DCE5ED] text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save as Draft</span>
            </button>
          )}

          <button
            type="submit"
            className="px-6 py-2.5 bg-[#173B63] hover:bg-[#176FA8] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
            <span>{isEditing ? 'Save & Update Opportunity' : 'Publish Opportunity Live'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
