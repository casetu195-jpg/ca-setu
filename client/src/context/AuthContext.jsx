import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ca_setu_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // Verify session on mount with backend if token exists
  useEffect(() => {
    const token = localStorage.getItem('ca_setu_token');
    if (token) {
      authAPI
        .getMe()
        .then((res) => {
          if (res.data?.success && res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('ca_setu_user', JSON.stringify(res.data.user));
          }
        })
        .catch(() => {
          // If token expired on server, clear
          // But retain user if server is unreachable
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();

    try {
      const res = await authAPI.login(normalizedEmail, password);
      if (res.data?.success && res.data?.token) {
        const { token, user: userData } = res.data;
        localStorage.setItem('ca_setu_token', token);
        localStorage.setItem('ca_setu_user', JSON.stringify(userData));
        setUser(userData);
        return { success: true, user: userData };
      }
    } catch (apiError) {
      // If server error response received from API
      if (apiError.response?.data?.message) {
        return {
          success: false,
          message: apiError.response.data.message,
        };
      }
      
      // Graceful offline fallback during transition/seeding
      const savedUsersDb = JSON.parse(localStorage.getItem('ca_setu_users_db') || '[]');
      const matched = savedUsersDb.find((u) => u.email.toLowerCase() === normalizedEmail);
      if (matched && matched.password === password) {
        localStorage.setItem('ca_setu_token', 'offline-token-' + matched.id);
        localStorage.setItem('ca_setu_user', JSON.stringify(matched));
        setUser(matched);
        return { success: true, user: matched };
      }

      return {
        success: false,
        message: apiError.message || 'Unable to connect to authentication server.',
      };
    }
  };

  const register = async ({
    name,
    email,
    password,
    role,
    phone,
    companyName,
    frn,
    privacyAccepted,
    termsAccepted,
  }) => {
    const normalizedEmail = email.trim().toLowerCase();

    // Guard: Prevent admin registration on client
    if (role === 'admin') {
      return { success: false, message: 'Admin accounts cannot be registered publicly.' };
    }

    if (!privacyAccepted) {
      return { success: false, message: 'You must read and agree to the CA Dwar Privacy Policy to register.' };
    }
    if (!termsAccepted) {
      return { success: false, message: 'You must accept the CA Dwar Terms of Use to register.' };
    }

    try {
      const res = await authAPI.register({
        name,
        email: normalizedEmail,
        password,
        role: role || 'student',
        phone,
        companyName,
        frn,
        privacyAccepted: true,
        termsAccepted: true,
      });

      if (res.data?.success && res.data?.token) {
        const { token, user: userData } = res.data;
        localStorage.setItem('ca_setu_token', token);
        localStorage.setItem('ca_setu_user', JSON.stringify(userData));
        setUser(userData);
        return { success: true, user: userData };
      }
    } catch (apiError) {
      if (apiError.response?.data?.message) {
        return {
          success: false,
          message: apiError.response.data.message,
        };
      }

      // Offline fallback
      const newUser = {
        id: 'usr-' + Date.now(),
        name,
        email: normalizedEmail,
        password, // saved only in offline fallback
        role: role || 'student',
        phone: phone || '',
        caStage: role === 'student' ? 'Inter' : undefined,
        groupsCleared: role === 'student' ? 'Both Groups' : undefined,
        companyName: role === 'employer' ? companyName : undefined,
        privacyConsent: { accepted: true, version: '1.0', consentedAt: new Date().toISOString() },
        termsConsent: { accepted: true, version: '1.0', consentedAt: new Date().toISOString() },
      };

      const savedUsersDb = JSON.parse(localStorage.getItem('ca_setu_users_db') || '[]');
      savedUsersDb.push(newUser);
      localStorage.setItem('ca_setu_users_db', JSON.stringify(savedUsersDb));
      localStorage.setItem('ca_setu_token', 'offline-token-' + newUser.id);
      localStorage.setItem('ca_setu_user', JSON.stringify(newUser));
      setUser(newUser);
      return { success: true, user: newUser };
    }
  };

  const loginWithGoogle = async (credential) => {
    try {
      const res = await authAPI.googleAuth(credential);
      if (res.data?.success && res.data?.token) {
        const { token, user: userData, isNewUser } = res.data;
        localStorage.setItem('ca_setu_token', token);
        localStorage.setItem('ca_setu_user', JSON.stringify(userData));
        setUser(userData);
        return { success: true, user: userData, isNewUser };
      }
      return { success: false, message: 'Google sign-in could not be completed.' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to authenticate with Google.',
      };
    }
  };

  const submitConsent = async ({ privacyAccepted, termsAccepted }) => {
    try {
      const res = await authAPI.recordConsent({
        privacyAccepted: !!privacyAccepted,
        termsAccepted: !!termsAccepted,
        privacyVersion: '1.0',
        termsVersion: '1.0',
      });
      if (res.data?.success) {
        const updatedUser = {
          ...user,
          privacyConsent: res.data.privacyConsent,
          termsConsent: res.data.termsConsent,
        };
        setUser(updatedUser);
        localStorage.setItem('ca_setu_user', JSON.stringify(updatedUser));
        return { success: true, user: updatedUser };
      }
      return { success: false, message: res.data?.message || 'Failed to save consent.' };
    } catch (err) {
      // Local fallback state update
      const updatedUser = {
        ...user,
        privacyConsent: { accepted: !!privacyAccepted, version: '1.0', consentedAt: new Date().toISOString() },
        termsConsent: { accepted: !!termsAccepted, version: '1.0', consentedAt: new Date().toISOString() },
      };
      setUser(updatedUser);
      localStorage.setItem('ca_setu_user', JSON.stringify(updatedUser));
      return { success: true, user: updatedUser };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ca_setu_token');
    localStorage.removeItem('ca_setu_user');
  };

  const updateStudentProfile = (profileData) => {
    if (!user) return;
    const updated = { ...user, ...profileData };
    setUser(updated);
    localStorage.setItem('ca_setu_user', JSON.stringify(updated));
    return { success: true, user: updated };
  };

  const hasAcceptedPrivacy = user?.privacyConsent?.accepted === true;
  const hasAcceptedTerms = user?.termsConsent?.accepted === true;
  const needsConsent = !!user && (!hasAcceptedPrivacy || !hasAcceptedTerms);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isStudent: user?.role === 'student',
        isEmployer: user?.role === 'employer',
        isAdmin: user?.role === 'admin',
        needsConsent,
        hasAcceptedPrivacy,
        hasAcceptedTerms,
        login,
        loginWithGoogle,
        submitConsent,
        register,
        logout,
        updateStudentProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
