import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useJobs } from '../../context/JobContext';
import { X, FileText, CheckCircle2, AlertCircle, Send, ArrowRight } from 'lucide-react';

export default function ApplicationModal({ job, isOpen, onClose }) {
  const { user, isAuthenticated } = useAuth();
  const { applyToJob, hasApplied } = useJobs();
  const navigate = useNavigate();

  const [coverNote, setCoverNote] = useState('');
  const [resumeUrl, setResumeUrl] = useState(user?.resumeUrl || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !job) return null;

  const alreadyApplied = isAuthenticated && hasApplied(job.id, user?.id, user?.email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login?redirect=/jobs/' + (job.id || job._id));
      return;
    }

    if (alreadyApplied) {
      setError('You have already applied to this opportunity.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await applyToJob({
        jobId: job.id || job._id,
        student: user,
        coverNote,
        resumeUrl,
      });

      setSubmitting(false);
      if (res && res.success) {
        setIsSuccess(true);
      } else {
        setError(res?.message || 'Failed to submit application to database.');
      }
    } catch (err) {
      setSubmitting(false);
      setError(err?.message || 'Network error occurred while submitting application.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#DCE5ED] z-10 animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {!isAuthenticated ? (
          /* Not Logged In State */
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-[#EEF6FC] text-[#176FA8] flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#173B63] mb-1">
              Sign in to Apply
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Create a free student profile or log in with your credentials to submit your application for <strong>{job.title}</strong>.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => navigate('/login?redirect=/jobs/' + job.id)}
                className="px-5 py-2.5 bg-[#173B63] hover:bg-[#176FA8] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors"
              >
                Log in to Account
              </button>
              <button
                onClick={() => navigate('/register?role=student')}
                className="px-5 py-2.5 border border-[#DCE5ED] text-[#152B45] text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Register as Student
              </button>
            </div>
          </div>
        ) : isSuccess ? (
          /* Success State */
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#173B63] mb-1">
              Application Submitted!
            </h3>
            <p className="text-sm text-slate-600 mb-6 max-w-sm mx-auto">
              Your profile and application have been recorded successfully in the CA Dwar database. You can track status updates in your student dashboard.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  navigate('/student/applications');
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#176FA8] text-white text-sm font-semibold rounded-xl shadow-xs flex items-center justify-center gap-2"
              >
                <span>View My Applications</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 border border-[#DCE5ED] text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Application Form */
          <div>
            <h3 className="text-lg font-bold text-[#173B63] mb-1">
              Submit Application
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Applying for <strong className="text-slate-800">{job.title}</strong>
            </p>

            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {alreadyApplied ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center my-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                <p className="text-sm font-bold text-emerald-800">You have already applied</p>
                <p className="text-xs text-emerald-700 mt-1">
                  Track progress in your student applications dashboard.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Candidate Summary Card */}
                <div className="bg-[#F8FAFC] border border-[#DCE5ED] rounded-xl p-3.5 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="font-semibold text-slate-800">Applicant:</span>
                    <span>{user.name} ({user.email})</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="font-semibold text-slate-800">CA Milestone:</span>
                    <span>{user.caStage || 'Final'} · {user.groupsCleared || 'Both Groups'}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="font-semibold text-slate-800">Resume Status:</span>
                    {resumeUrl || user.resumeUrl ? (
                      <span className="text-emerald-700 font-medium flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Profile Resume Attached ✓</span>
                      </span>
                    ) : (
                      <span className="text-slate-500 italic">No resume on file</span>
                    )}
                  </div>
                </div>

                {!resumeUrl && !user.resumeUrl && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Resume Link (Google Drive / PDF URL - Optional)
                    </label>
                    <input
                      type="url"
                      value={resumeUrl}
                      onChange={(e) => setResumeUrl(e.target.value)}
                      placeholder="https://drive.google.com/file/d/..."
                      className="w-full text-xs text-[#152B45] p-2.5 rounded-xl border border-[#DCE5ED] focus:border-[#176FA8] focus:outline-hidden"
                    />
                  </div>
                )}

                {/* Cover Note Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Introduction / Note to Hiring Partner (Optional)
                  </label>
                  <textarea
                    rows={4}
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    placeholder="Briefly state your relevant exposure, attempts, or why you are interested in this specific domain..."
                    className="w-full text-xs text-[#152B45] p-3 rounded-xl border border-[#DCE5ED] focus:border-[#176FA8] focus:outline-hidden"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-[#DCE5ED] text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-[#173B63] hover:bg-[#176FA8] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Submitting...' : 'Confirm & Submit'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
