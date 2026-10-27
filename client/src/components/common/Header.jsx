import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, Briefcase, User, LogOut, ChevronDown, PlusCircle, ShieldCheck } from 'lucide-react';

export default function Header() {
  const { user, isAuthenticated, logout, isStudent, isEmployer, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const getDashboardLink = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isEmployer) return '/employer/dashboard';
    return '/student/dashboard';
  };

  const navLinks = [
    { label: 'Articleship', path: '/articleship' },
    { label: 'Industrial Training', path: '/industrial-training' },
    { label: 'CA Jobs', path: '/ca-jobs' },
    { label: 'Companies', path: '/companies' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#DCE5ED] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Main Navigation */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-[#173B63] flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:bg-[#176FA8] transition-colors">
                CD
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-[#173B63] leading-none">
                  CA Dwar
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-[#176FA8] mt-0.5">
                  CA Career Marketplace
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-[#176FA8] bg-[#EEF6FC] font-semibold'
                        : 'text-[#152B45] hover:text-[#176FA8] hover:bg-slate-50'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Right Action buttons for Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {/* Post Job CTA button */}
            <Link
              to={isAdmin || isEmployer ? '/employer/post-job' : '/login'}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium rounded-lg text-[#176FA8] border border-[#176FA8]/30 hover:bg-[#EEF6FC] transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-[#176FA8]" />
              <span>Post a Vacancy</span>
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-[#DCE5ED] hover:bg-slate-50 text-sm font-medium text-[#152B45] transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-[#176FA8] text-white flex items-center justify-center font-semibold text-xs">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="max-w-[120px] truncate">{user?.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#DCE5ED] py-2 z-50 animate-in fade-in"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-[#DCE5ED]">
                      <p className="text-xs font-medium text-slate-500">Signed in as</p>
                      <p className="text-sm font-semibold text-[#152B45] truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full uppercase bg-[#EEF6FC] text-[#176FA8]">
                        {user.role} Account
                      </span>
                    </div>

                    <Link
                      to={getDashboardLink()}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#152B45] hover:bg-[#EEF6FC] hover:text-[#176FA8]"
                    >
                      <Briefcase className="w-4 h-4" />
                      <span>{user.role === 'admin' ? 'Admin Panel' : 'Dashboard'}</span>
                    </Link>

                    {isStudent && (
                      <Link
                        to="/student/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#152B45] hover:bg-[#EEF6FC] hover:text-[#176FA8]"
                      >
                        <User className="w-4 h-4" />
                        <span>My CA Profile & Resume</span>
                      </Link>
                    )}

                    {isEmployer && (
                      <Link
                        to="/employer/company"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#152B45] hover:bg-[#EEF6FC] hover:text-[#176FA8]"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Company Verification</span>
                      </Link>
                    )}

                    <div className="border-t border-[#DCE5ED] mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-sm font-medium text-[#152B45] hover:text-[#176FA8] transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-sm font-semibold text-white bg-[#173B63] hover:bg-[#176FA8] rounded-lg shadow-xs transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-[#173B63] hover:bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#DCE5ED] bg-white px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-lg text-base font-medium ${
                    isActive ? 'text-[#176FA8] bg-[#EEF6FC] font-semibold' : 'text-[#152B45] hover:bg-slate-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="pt-3 border-t border-[#DCE5ED] flex flex-col gap-2">
            <Link
              to={isAdmin || isEmployer ? '/employer/post-job' : '/login'}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-[#176FA8] bg-[#EEF6FC] rounded-lg"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post a Vacancy</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#173B63] rounded-lg"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Go to {user.role === 'admin' ? 'Admin Panel' : 'Dashboard'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full py-2 text-sm text-rose-600 font-medium hover:bg-rose-50 rounded-lg"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2 text-sm font-medium border border-[#DCE5ED] text-[#152B45] rounded-lg"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2 text-sm font-semibold text-white bg-[#173B63] rounded-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
