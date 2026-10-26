import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { initialCities, initialDomains } from '../services/mockData';
import { User, FileText, CheckCircle2, Save, Upload, Link as LinkIcon, Award } from 'lucide-react';

export default function StudentProfile() {
  const { user, updateStudentProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || 'Aman Sharma',
    email: user?.email || 'aman.sharma@casetu.com',
    phone: user?.phone || '+91 98201 12345',
    caStage: user?.caStage || 'Final',
    groupsCleared: user?.groupsCleared || 'Both Groups',
    attemptsCount: user?.attemptsCount || 1,
    city: user?.city || 'Mumbai',
    preferredWorkMode: user?.preferredWorkMode || 'Hybrid',
    preferredCities: user?.preferredCities || ['Mumbai', 'Pune'],
    preferredDomains: user?.preferredDomains || ['Private Equity', 'Investment Banking', 'Statutory Audit'],
    resumeFileName: user?.resumeFileName || 'Aman_Sharma_CA_Final_Resume.pdf',
    linkedin: user?.linkedin || 'https://linkedin.com/in/amansharma-ca',
    bio:
      user?.bio ||
      'Cleared CA Intermediate in 1st attempt. Completed 18 months of statutory audit articleship at BDO India. Currently seeking high-impact Industrial Training in Growth Private Equity or Investment Banking.',
    skills: user?.skills || ['Financial Modeling', 'Ind AS', 'Advanced Excel', 'Valuation (DCF)', 'Tally Prime'],
  });

  const [newSkill, setNewSkill] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleResumeMockUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        resumeFileName: file.name,
        resumeUrl: 'https://casetu.com/resumes/' + file.name,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateStudentProfile(formData);
    setSuccessMsg('CA Student Profile & Resume updated successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#DCE5ED]">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#176FA8]">
            <User className="w-4 h-4" />
            <span>Profile Management</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#173B63]">
            My CA Profile & Career Record
          </h1>
          <p className="text-sm text-slate-600">
            Keep your ICAI stage, groups cleared, and resume up-to-date for hiring partners.
          </p>
        </div>

        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Card 1: Basic Info */}
        <div className="bg-white border border-[#DCE5ED] rounded-2xl p-6 sm:p-7 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-[#173B63] flex items-center gap-2">
            <User className="w-4 h-4 text-[#176FA8]" />
            Personal & Contact Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
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
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={formData.email}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#176FA8] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Current City
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
          </div>
        </div>

        {/* Card 2: CA Academic Record (Crucial for CA Dwar) */}
        <div className="bg-white border border-[#DCE5ED] rounded-2xl p-6 sm:p-7 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#173B63] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#176FA8]" />
              ICAI Academic & Articleship Credentials
            </h2>
            <span className="text-[11px] font-bold text-[#16805C] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Verified Fields
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Current CA Stage
              </label>
              <select
                name="caStage"
                value={formData.caStage}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#176FA8] focus:outline-hidden"
              >
                <option value="Inter">CA Intermediate Student</option>
                <option value="Final">CA Finalist / Trainee</option>
                <option value="Qualified">Qualified Chartered Accountant</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Groups Cleared
              </label>
              <select
                name="groupsCleared"
                value={formData.groupsCleared}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#176FA8] focus:outline-hidden"
              >
                <option value="Both Groups">Both Groups Cleared</option>
                <option value="Group 1 Only">Group 1 Cleared</option>
                <option value="Group 2 Only">Group 2 Cleared</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Exam Attempts Taken
              </label>
              <select
                name="attemptsCount"
                value={formData.attemptsCount}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#176FA8] focus:outline-hidden"
              >
                <option value="1">1st Attempt (Rank / First-Class)</option>
                <option value="2">2 Attempts</option>
                <option value="3">3+ Attempts</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card 3: Resume & Professional Bio */}
        <div className="bg-white border border-[#DCE5ED] rounded-2xl p-6 sm:p-7 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-[#173B63] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#176FA8]" />
            Resume Attachment & Summary
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Professional Bio / Pitch
              </label>
              <textarea
                name="bio"
                rows={3}
                value={formData.bio}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#176FA8] focus:outline-hidden"
              />
            </div>

            {/* Resume Upload Box */}
            <div className="border border-dashed border-[#176FA8]/40 bg-[#EEF6FC]/40 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#DCE5ED] text-[#176FA8] flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#152B45]">
                    {formData.resumeFileName}
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    PDF format · Uploaded and ready for one-click applications
                  </p>
                </div>
              </div>

              <label className="px-4 py-2 bg-white border border-[#DCE5ED] hover:bg-slate-50 text-[#173B63] font-semibold rounded-xl text-xs cursor-pointer shadow-2xs transition-colors flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-[#176FA8]" />
                <span>Replace Resume PDF</span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleResumeMockUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Skills Tags */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2">
                Technical Skills (Tools & Software)
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-slate-400 hover:text-rose-500 font-bold"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2 max-w-sm">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="e.g. SAP FICO, PowerBI, Zoho"
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-lg"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-[#173B63] hover:bg-[#176FA8] text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
