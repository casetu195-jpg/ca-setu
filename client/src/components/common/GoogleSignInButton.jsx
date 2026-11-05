import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle } from 'lucide-react';

export default function GoogleSignInButton({ isSignUp = false, redirect = '/' }) {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const buttonRef = useRef(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isGsiLoaded, setIsGsiLoaded] = useState(false);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // Handle Google Token Response
  const handleCredentialResponse = async (response) => {
    if (!response?.credential) {
      setError('Google sign-in did not return valid credentials.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await loginWithGoogle(response.credential);
      if (result.success) {
        const u = result.user;
        if (u.role === 'admin') navigate('/admin/dashboard');
        else if (u.role === 'employer') navigate('/employer/dashboard');
        else navigate(redirect === '/' ? '/student/dashboard' : redirect);
      } else {
        setError(result.message || 'Google sign-in failed on the server.');
      }
    } catch (err) {
      setError(err?.message || 'Authentication error with Google.');
    } finally {
      setLoading(false);
    }
  };

  // Load Google Identity Services script
  useEffect(() => {
    if (window.google?.accounts?.id) {
      setIsGsiLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setIsGsiLoaded(true);
    script.onerror = () => setError('Failed to load Google Identity Services.');
    document.body.appendChild(script);

    return () => {
      // Keep script cached
    };
  }, []);

  // Initialize and render Google button when script and Client ID are available
  useEffect(() => {
    if (!isGsiLoaded || !googleClientId || !window.google?.accounts?.id || !buttonRef.current) {
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Render official Google button
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        text: isSignUp ? 'signup_with' : 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width: buttonRef.current.offsetWidth || 340,
      });
    } catch (e) {
      console.warn('Google Identity initialization error:', e);
    }
  }, [isGsiLoaded, googleClientId, isSignUp]);

  const handleFallbackClick = () => {
    if (!googleClientId) {
      setError(
        'Google OAuth Client ID is not configured yet. Add VITE_GOOGLE_CLIENT_ID to your environment variables to activate one-click Google Sign-In.'
      );
    }
  };

  return (
    <div className="w-full space-y-2">
      {error && (
        <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="p-2.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs rounded-xl text-center font-medium animate-pulse">
          Verifying Google credential with CA Dwar...
        </div>
      )}

      {googleClientId ? (
        <div ref={buttonRef} className="w-full flex justify-center min-h-[44px]" />
      ) : (
        /* Standalone branded button when Client ID is awaiting configuration */
        <button
          type="button"
          onClick={handleFallbackClick}
          className="w-full py-2.5 px-4 bg-white border border-[#DCE5ED] hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-2.5"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>
      )}
    </div>
  );
}
