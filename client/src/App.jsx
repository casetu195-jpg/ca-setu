import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { JobProvider } from './context/JobContext';

// Layout Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Public Pages
import Home from './pages/Home';
import JobListings from './pages/JobListings';
import JobDetails from './pages/JobDetails';
import Companies from './pages/Companies';
import CompanyDetails from './pages/CompanyDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import StudentProfile from './pages/StudentProfile';
import StudentApplications from './pages/StudentApplications';
import StudentSavedJobs from './pages/StudentSavedJobs';

// Employer Pages
import EmployerDashboard from './pages/EmployerDashboard';
import EmployerCompany from './pages/EmployerCompany';
import EmployerPostJob from './pages/EmployerPostJob';
import EmployerJobs from './pages/EmployerJobs';
import EmployerApplicants from './pages/EmployerApplicants';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminCompanies from './pages/AdminCompanies';
import AdminJobs from './pages/AdminJobs';

// Route Guards
function ProtectedStudentRoute({ children }) {
  const { isAuthenticated, isStudent, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isStudent && !isAdmin) return <Navigate to="/" replace />;
  return children;
}

function ProtectedEmployerRoute({ children }) {
  const { isAuthenticated, isEmployer, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isEmployer && !isAdmin) return <Navigate to="/" replace />;
  return children;
}

function ProtectedAdminRoute({ children }) {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <JobProvider>
          <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#152B45]">
            <Header />
            <main className="flex-1">
              <Routes>
                {/* 1. Public Pages */}
                <Route path="/" element={<Home />} />
                <Route path="/articleship" element={<JobListings />} />
                <Route path="/industrial-training" element={<JobListings />} />
                <Route path="/ca-jobs" element={<JobListings />} />
                <Route path="/jobs/:id" element={<JobDetails />} />
                <Route path="/companies" element={<Companies />} />
                <Route path="/companies/:id" element={<CompanyDetails />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* 2. Student Portal Routes */}
                <Route
                  path="/student/dashboard"
                  element={
                    <ProtectedStudentRoute>
                      <StudentDashboard />
                    </ProtectedStudentRoute>
                  }
                />
                <Route
                  path="/student/profile"
                  element={
                    <ProtectedStudentRoute>
                      <StudentProfile />
                    </ProtectedStudentRoute>
                  }
                />
                <Route
                  path="/student/applications"
                  element={
                    <ProtectedStudentRoute>
                      <StudentApplications />
                    </ProtectedStudentRoute>
                  }
                />
                <Route
                  path="/student/saved-jobs"
                  element={
                    <ProtectedStudentRoute>
                      <StudentSavedJobs />
                    </ProtectedStudentRoute>
                  }
                />
                <Route
                  path="/student/settings"
                  element={
                    <ProtectedStudentRoute>
                      <StudentProfile />
                    </ProtectedStudentRoute>
                  }
                />

                {/* 3. Employer Portal Routes */}
                <Route
                  path="/employer/dashboard"
                  element={
                    <ProtectedEmployerRoute>
                      <EmployerDashboard />
                    </ProtectedEmployerRoute>
                  }
                />
                <Route
                  path="/employer/company"
                  element={
                    <ProtectedEmployerRoute>
                      <EmployerCompany />
                    </ProtectedEmployerRoute>
                  }
                />
                <Route
                  path="/employer/post-job"
                  element={
                    <ProtectedEmployerRoute>
                      <EmployerPostJob />
                    </ProtectedEmployerRoute>
                  }
                />
                <Route
                  path="/employer/jobs"
                  element={
                    <ProtectedEmployerRoute>
                      <EmployerJobs />
                    </ProtectedEmployerRoute>
                  }
                />
                <Route
                  path="/employer/applicants"
                  element={
                    <ProtectedEmployerRoute>
                      <EmployerApplicants />
                    </ProtectedEmployerRoute>
                  }
                />

                {/* 4. Admin Portal Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedAdminRoute>
                      <AdminDashboard />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/admin/companies"
                  element={
                    <ProtectedAdminRoute>
                      <AdminCompanies />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/admin/jobs"
                  element={
                    <ProtectedAdminRoute>
                      <AdminJobs />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedAdminRoute>
                      <AdminDashboard />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/admin/applications"
                  element={
                    <ProtectedAdminRoute>
                      <AdminDashboard />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/admin/reports"
                  element={
                    <ProtectedAdminRoute>
                      <AdminDashboard />
                    </ProtectedAdminRoute>
                  }
                />

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </JobProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
