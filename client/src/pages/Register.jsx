import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Building2, Mail, Lock, Phone, AlertCircle, ArrowRight } from 'lucide-react';

export default function Register() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'employer' ? 'employer' : 'student';

  const [role, setRole] = useState(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [frn, setFrn] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await register({
        name,
        email,
        password,
        role,
        phone,
        companyName,
        frn,
      });

      if (res.success) {
        if (role === 'employer') {
          navigate('/employer/company');
        } else {
          navigate('/student/profile');
        }
      } else {
        setError(res.message || 'Registration failed.');
      }
    } catch {
      setError('Something went wrong during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full space-y-6">
        {/* Top Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#173B63] flex items-center justify-center text-white font-bold text-xl">
              CD
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold text-[#173B63]">
            Create Your CA Dwar Account
          </h1>
          <p className="text-sm text-slate-600">
            Join India's dedicated career network for the CA fraternity.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-[#DCE5ED] rounded-2xl p-6 sm:p-8 shadow-xs">
          {/* Role Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                role === 'student'
                  ? 'bg-white text-[#173B63] shadow-xs'
                  : 'text-slate-600 hover:text-[#173B63]'
              }`}
            >
              <User className="w-4 h-4 text-[#176FA8]" />
              <span>CA Student / Job Seeker</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('employer')}
              className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                role === 'employer'
                  ? 'bg-white text-[#173B63] shadow-xs'
                  : 'text-slate-600 hover:text-[#173B63]'
              }`}
            >
              <Building2 className="w-4 h-4 text-purple-600" />
              <span>CA Firm / Corporate Employer</span>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Full Legal Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === 'student' ? 'e.g. Aman Sharma' : 'e.g. CA Rajesh Mehta (Managing Partner)'}
                className="w-full px-3.5 py-2.5 text-sm text-[#152B45] rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#176FA8]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'student' ? 'student@gmail.com' : 'partner@cafirm.com'}
                className="w-full px-3.5 py-2.5 text-sm text-[#152B45] rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#176FA8]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Mobile Number (For WhatsApp / SMS updates)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 text-sm text-[#152B45] rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#176FA8]"
              />
            </div>

            {/* Extra fields if Employer */}
            {role === 'employer' && (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    CA Firm or Company Name
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. M/s K.S. & Associates, Chartered Accountants"
                    className="w-full px-3.5 py-2.5 text-sm text-[#152B45] rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#176FA8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    ICAI Firm Registration Number (FRN) or Corporate CIN
                  </label>
                  <input
                    type="text"
                    required
                    value={frn}
                    onChange={(e) => setFrn(e.target.value)}
                    placeholder="e.g. 104523W / U74140MH2010PTC..."
                    className="w-full px-3.5 py-2.5 text-sm text-[#152B45] rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#176FA8]"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full px-3.5 py-2.5 text-sm text-[#152B45] rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#176FA8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type password"
                  className="w-full px-3.5 py-2.5 text-sm text-[#152B45] rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#176FA8]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#173B63] hover:bg-[#176FA8] text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
            >
              <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-6 border-t border-slate-100 text-center text-xs text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#176FA8] hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
