import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function FounderSetup() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const founderEmail = 'casetu195@gmail.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Missing security recovery token in URL.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('/api/auth/founder-setup', {
        token,
        email: founderEmail,
        newPassword: password,
      });

      if (res.data?.success) {
        // Save session credentials
        localStorage.setItem('ca_setu_token', res.data.token);
        localStorage.setItem('ca_setu_user', JSON.stringify(res.data.user));

        setSuccess(true);
        setTimeout(() => {
          navigate('/admin/dashboard');
          window.location.reload();
        }, 2000);
      } else {
        setError(res.data?.message || 'Password update failed.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to update admin password. The recovery link may be expired or already used.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#173B63] mx-auto flex items-center justify-center text-white font-bold text-2xl shadow-md">
            CD
          </div>
          <h1 className="text-2xl font-extrabold text-[#173B63]">
            Founder Admin Setup
          </h1>
          <p className="text-xs text-slate-600">
            Secure, private credential setup for CA Dwar Administration.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#DCE5ED] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          {!token ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-xs space-y-2 text-center">
              <AlertCircle className="w-6 h-6 text-amber-600 mx-auto" />
              <p className="font-bold">Missing Security Token</p>
              <p className="text-amber-700">
                Please open this page using the official 1-click launcher file created on your laptop.
              </p>
            </div>
          ) : success ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto animate-bounce" />
              <h3 className="text-lg font-extrabold text-emerald-900">
                Admin Password Updated!
              </h3>
              <p className="text-xs text-emerald-700">
                Your Admin account is now registered to{' '}
                <strong className="underline">{founderEmail}</strong>.
              </p>
              <div className="text-xs font-semibold text-emerald-800 pt-2 flex items-center justify-center gap-1.5">
                <span>Entering Admin Dashboard</span>
                <ArrowRight className="w-4 h-4 animate-pulse" />
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Target Email Confirmation */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Verified Founder Email
                </label>
                <div className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-[#173B63] flex items-center justify-between">
                  <span>{founderEmail}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    Target Admin
                  </span>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  New Admin Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter at least 6 characters"
                    className="w-full pl-10 pr-10 py-2.5 text-xs text-[#152B45] rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#176FA8]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type your password"
                    className="w-full pl-10 pr-3 py-2.5 text-xs text-[#152B45] rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#176FA8]"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#173B63] hover:bg-[#176FA8] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{loading ? 'Securing Account...' : 'Set Password & Enter Dashboard'}</span>
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400">
            CA Dwar Trust & Security Infrastructure · Single-Use Recovery
          </div>
        </div>
      </div>
    </div>
  );
}
