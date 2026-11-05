import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, ExternalLink, Check, AlertCircle } from 'lucide-react';

export default function ConsentModal() {
  const { user, needsConsent, submitConsent, logout } = useAuth();
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!user || !needsConsent) return null;

  const handleConsentSubmit = async (e) => {
    e.preventDefault();
    if (!privacyAgreed || !termsAgreed) {
      setError('Please review and tick both checkboxes to continue.');
      return;
    }

    setSubmitting(true);
    setError('');

    const res = await submitConsent({
      privacyAccepted: true,
      termsAccepted: true,
    });

    setSubmitting(false);
    if (!res.success) {
      setError(res.message || 'Failed to record consent. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#DCE5ED] space-y-6">
        {/* Header Icon & Title */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#F0F7FF] border border-[#DCE5ED] text-[#173B63] flex items-center justify-center mx-auto shadow-2xs">
            <Shield className="w-6 h-6 text-[#173B63]" />
          </div>
          <h2 className="text-xl font-extrabold text-[#173B63]">
            Privacy Policy &amp; Terms Agreement
          </h2>
          <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
            Welcome back, <strong>{user.name}</strong>. In compliance with data protection transparency standards, please review and accept our updated policies to access your dashboard.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Separate Mandatory Consent Checkboxes */}
        <form onSubmit={handleConsentSubmit} className="space-y-4">
          <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700">
            {/* Checkbox 1: Privacy Policy */}
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={privacyAgreed}
                onChange={(e) => setPrivacyAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#173B63] focus:ring-[#176FA8] cursor-pointer"
              />
              <span className="leading-snug">
                I have read and agree to the{' '}
                <Link
                  to="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#176FA8] underline inline-flex items-center gap-0.5"
                >
                  <span>CA Dwar Privacy Policy</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
                , including the transparent sharing of my application details and CV with hiring employers.
              </span>
            </label>

            {/* Checkbox 2: Terms of Use */}
            <label className="flex items-start gap-3 cursor-pointer select-none pt-2 border-t border-slate-200">
              <input
                type="checkbox"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#173B63] focus:ring-[#176FA8] cursor-pointer"
              />
              <span className="leading-snug">
                I accept the{' '}
                <Link
                  to="/terms-of-use"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#176FA8] underline inline-flex items-center gap-0.5"
                >
                  <span>CA Dwar Terms of Use</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
                , confirming the truthfulness of my academic and practical training credentials.
              </span>
            </label>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5 justify-end">
            <button
              type="button"
              onClick={logout}
              className="w-full sm:w-auto px-4 py-2.5 text-xs text-slate-500 hover:text-slate-700 font-semibold rounded-xl transition-colors"
            >
              Sign Out
            </button>
            <button
              type="submit"
              disabled={submitting || !privacyAgreed || !termsAgreed}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#173B63] hover:bg-[#0F2642] disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{submitting ? 'Recording Consent...' : 'Accept & Continue'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
