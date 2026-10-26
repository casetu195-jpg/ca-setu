import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/common/SEO';
import { Mail, Lock, AlertCircle, ArrowRight, Shield } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        if (res.user.role === 'admin') navigate('/admin/dashboard');
        else if (res.user.role === 'employer') navigate('/employer/dashboard');
        else navigate(redirect === '/' ? '/student/dashboard' : redirect);
      } else {
        setError(res.message || 'Invalid email or password.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <SEO title="Sign In | CA Dwar" canonicalPath="/login" noindex={true} />
      <div className="max-w-md w-full space-y-6">
        {/* Top Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#173B63] flex items-center justify-center text-white font-bold text-xl">
              CD
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold text-[#173B63]">
            Welcome Back to CA Dwar
          </h1>
          <p className="text-sm text-slate-600">
            Sign in to manage your CA career applications or firm postings.
          </p>
        </div>

        {/* Secure Form */}
        <div className="bg-white border border-[#DCE5ED] rounded-2xl p-6 sm:p-8 shadow-xs">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. name@domain.com"
                  className="w-full pl-10 pr-3 py-2.5 text-sm text-[#152B45] rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#176FA8]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 text-sm text-[#152B45] rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#176FA8]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#173B63] hover:bg-[#176FA8] text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-6 border-t border-slate-100 text-center text-xs text-slate-500 mt-6">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-[#176FA8] hover:underline">
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
