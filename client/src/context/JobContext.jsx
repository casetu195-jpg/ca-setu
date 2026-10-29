import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialJobs,
  initialCompanies,
  initialCategories,
  initialCities,
  initialDomains,
  initialApplications,
} from '../services/mockData';
import { jobsAPI, applicationsAPI, adminAPI } from '../services/api';

const JobContext = createContext(null);

export function JobProvider({ children }) {
  const [jobs, setJobs] = useState(() => {
    try {
      const saved = localStorage.getItem('ca_setu_jobs');
      return saved ? JSON.parse(saved) : initialJobs;
    } catch {
      return initialJobs;
    }
  });

  const [companies, setCompanies] = useState(() => {
    try {
      const saved = localStorage.getItem('ca_setu_companies');
      return saved ? JSON.parse(saved) : initialCompanies;
    } catch {
      return initialCompanies;
    }
  });

  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem('ca_setu_applications');
      return saved ? JSON.parse(saved) : initialApplications;
    } catch {
      return initialApplications;
    }
  });

  const [savedJobIds, setSavedJobIds] = useState(() => {
    try {
      const saved = localStorage.getItem('ca_setu_saved_jobs');
      return saved ? JSON.parse(saved) : ['job-1', 'job-3'];
    } catch {
      return ['job-1', 'job-3'];
    }
  });

  // Dynamic live statistics from MongoDB Atlas
  const [categoryStats, setCategoryStats] = useState({
    articleship: { activeOpenings: 0, applicationsSubmitted: 0 },
    'industrial-training': { activeOpenings: 0, applicationsSubmitted: 0 },
    'ca-jobs': { activeOpenings: 0, applicationsSubmitted: 0 },
  });
  const [categoryStatsLoading, setCategoryStatsLoading] = useState(true);

  const refreshCategoryStats = async () => {
    try {
      const res = await jobsAPI.getCategoryStats();
      if (res.data?.success && res.data.stats) {
        setCategoryStats(res.data.stats);
        return res.data.stats;
      }
    } catch {
      // Fallback: Calculate from current jobs and applications in state
      const now = new Date();
      const fallback = {
        articleship: {
          activeOpenings: jobs.filter(
            (j) => j.category === 'articleship' && j.status === 'Published' && (!j.expiresAt || new Date(j.expiresAt) > now)
          ).length,
          applicationsSubmitted: applications.filter((a) => {
            const j = jobs.find((job) => job.id === a.jobId || job._id === a.jobId);
            return j?.category === 'articleship';
          }).length,
        },
        'industrial-training': {
          activeOpenings: jobs.filter(
            (j) => j.category === 'industrial-training' && j.status === 'Published' && (!j.expiresAt || new Date(j.expiresAt) > now)
          ).length,
          applicationsSubmitted: applications.filter((a) => {
            const j = jobs.find((job) => job.id === a.jobId || job._id === a.jobId);
            return j?.category === 'industrial-training';
          }).length,
        },
        'ca-jobs': {
          activeOpenings: jobs.filter(
            (j) => j.category === 'ca-jobs' && j.status === 'Published' && (!j.expiresAt || new Date(j.expiresAt) > now)
          ).length,
          applicationsSubmitted: applications.filter((a) => {
            const j = jobs.find((job) => job.id === a.jobId || job._id === a.jobId);
            return j?.category === 'ca-jobs';
          }).length,
        },
      };
      setCategoryStats(fallback);
      return fallback;
    } finally {
      setCategoryStatsLoading(false);
    }
  };

  // Fetch latest data from backend API on initial mount
  useEffect(() => {
    jobsAPI
      .getJobs()
      .then((res) => {
        if (res.data?.success && res.data.jobs && res.data.jobs.length > 0) {
          // Normalize _id to id if coming from MongoDB
          const normalized = res.data.jobs.map((j) => ({
            ...j,
            id: j._id || j.id,
            companyId: j.companyId?._id || j.companyId?.id || j.companyId,
          }));
          setJobs(normalized);
        }
      })
      .catch(() => {
        // Fallback to local / cached dataset
      });

    // Role-aware application fetching
    refreshApplications();

    // Fetch initial live statistics from MongoDB Atlas
    refreshCategoryStats();
  }, []);

  const refreshApplications = async () => {
    try {
      const token = localStorage.getItem('ca_setu_token');
      const storedUser = localStorage.getItem('ca_setu_user');
      if (!token || !storedUser) return;
      const currentUser = JSON.parse(storedUser);

      let res = null;
      if (currentUser.role === 'admin') {
        res = await applicationsAPI.getAllApplications();
      } else if (currentUser.role === 'employer') {
        res = await applicationsAPI.getEmployerApplications();
      } else if (currentUser.role === 'student') {
        res = await applicationsAPI.getMyApplications();
      }

      if (res?.data?.success && res.data.applications) {
        const normalized = res.data.applications.map((a) => ({
          ...a,
          id: a._id || a.id,
          jobId: a.jobId?._id || a.jobId?.id || a.jobId,
          job: a.jobId,
        }));
        setApplications(normalized);
      }
    } catch {}
  };

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('ca_setu_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('ca_setu_companies', JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem('ca_setu_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('ca_setu_saved_jobs', JSON.stringify(savedJobIds));
  }, [savedJobIds]);

  // Save / Bookmark helpers
  const toggleSaveJob = (jobId) => {
    setSavedJobIds((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  const isJobSaved = (jobId) => savedJobIds.includes(jobId);

  // Apply to Job (Internal application to MongoDB Atlas)
  const applyToJob = async ({ jobId, student, coverNote, resumeUrl }) => {
    const job = jobs.find((j) => j.id === jobId || j._id === jobId);
    if (!job) throw new Error('Job not found');

    // Duplicate Check
    const alreadyApplied = applications.some(
      (a) =>
        (a.jobId === jobId || a.jobId?._id === jobId || a.jobId?.id === jobId) &&
        (a.studentId === student.id || a.studentId?._id === student.id || (student.email && a.studentEmail === student.email))
    );
    if (alreadyApplied) {
      return { success: false, message: 'You have already submitted an application for this vacancy.' };
    }

    try {
      const res = await applicationsAPI.apply(jobId, coverNote, resumeUrl);
      if (res.data?.success && res.data.application) {
        const app = {
          ...res.data.application,
          id: res.data.application._id || res.data.application.id,
        };
        setApplications((prev) => [app, ...prev]);
        setJobs((prev) =>
          prev.map((j) => (j.id === jobId || j._id === jobId ? { ...j, applicantCount: (j.applicantCount || 0) + 1 } : j))
        );
        refreshCategoryStats();
        refreshApplications();
        return { success: true, application: app };
      }
      return { success: false, message: res.data?.message || 'Failed to submit application to database.' };
    } catch (apiErr) {
      const errorMsg =
        apiErr.response?.data?.message ||
        apiErr.message ||
        'Unable to record application in database. Please try again.';
      return { success: false, message: errorMsg };
    }
  };

  const hasApplied = (jobId, studentId, studentEmail) => {
    return applications.some(
      (a) => a.jobId === jobId && (a.studentId === studentId || (studentEmail && a.studentEmail === studentEmail))
    );
  };

  // Employer Job Posting
  const postNewJob = async (jobData) => {
    try {
      const res = await jobsAPI.createJob(jobData);
      if (res.data?.success && res.data.job) {
        const liveJob = {
          ...res.data.job,
          id: res.data.job._id || res.data.job.id,
          companyId: res.data.job.companyId?._id || res.data.job.companyId || res.data.job.companyId?.id,
        };
        setJobs((prev) => [liveJob, ...prev]);
        refreshCategoryStats();
        return liveJob;
      }
      throw new Error(res.data?.message || 'Database rejected vacancy save.');
    } catch (apiErr) {
      const msg =
        apiErr.response?.data?.message ||
        apiErr.message ||
        'Failed to save vacancy to database. Please check all fields.';
      throw new Error(msg);
    }
  };

  // Update Job Status
  const updateJobStatus = async (jobId, newStatus) => {
    try {
      await jobsAPI.updateJob(jobId, { status: newStatus });
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId || j._id === jobId ? { ...j, status: newStatus } : j))
      );
      refreshCategoryStats();
    } catch (err) {
      console.error('Failed to update job status in database:', err);
    }
  };

  // Delete Job
  const deleteJob = async (jobId) => {
    try {
      await jobsAPI.deleteJob(jobId);
      setJobs((prev) => prev.filter((j) => j.id !== jobId && j._id !== jobId));
      refreshCategoryStats();
    } catch (apiErr) {
      const msg =
        apiErr.response?.data?.message ||
        apiErr.message ||
        'Failed to delete vacancy from database.';
      throw new Error(msg);
    }
  };

  // Edit Job Details
  const editJob = async (jobId, updatedData) => {
    try {
      const res = await jobsAPI.updateJob(jobId, updatedData);
      if (res.data?.success && res.data.job) {
        const updated = {
          ...res.data.job,
          id: res.data.job._id || res.data.job.id,
          companyId: res.data.job.companyId?._id || res.data.job.companyId || res.data.job.companyId?.id,
        };
        setJobs((prev) => prev.map((j) => (j.id === jobId || j._id === jobId ? updated : j)));
        refreshCategoryStats();
        return updated;
      }
      throw new Error(res.data?.message || 'Failed to update vacancy in database.');
    } catch (apiErr) {
      const msg =
        apiErr.response?.data?.message ||
        apiErr.message ||
        'Failed to update vacancy in database.';
      throw new Error(msg);
    }
  };

  // Admin Job Operations
  const adminApproveJob = async (jobId) => {
    try {
      await adminAPI.moderateJob(jobId, 'Published');
    } catch {}
    updateJobStatus(jobId, 'Published');
  };

  const adminRejectJob = async (jobId) => {
    try {
      await adminAPI.moderateJob(jobId, 'Rejected');
    } catch {}
    updateJobStatus(jobId, 'Rejected');
  };

  const adminToggleFeature = (jobId) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, isFeatured: !j.isFeatured } : j))
    );
  };

  // Admin Verification of CA Firm
  const adminVerifyCompany = async (companyId, isVerified = true) => {
    try {
      await adminAPI.verifyCompany(companyId, isVerified);
    } catch {}

    setCompanies((prev) =>
      prev.map((c) =>
        c.id === companyId
          ? {
              ...c,
              isVerified,
              verifiedAt: isVerified ? new Date().toISOString() : null,
            }
          : c
      )
    );
  };

  // Employer Applicant Management (Change Status)
  const updateApplicationStatus = async (appId, newStatus, note = '') => {
    try {
      await applicationsAPI.updateStatus(appId, newStatus, note);
    } catch {}

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          const historyEntry = {
            status: newStatus,
            date: new Date().toISOString(),
            note: note || `Status changed to ${newStatus}`,
          };
          return {
            ...app,
            status: newStatus,
            statusHistory: [...(app.statusHistory || []), historyEntry],
          };
        }
        return app;
      })
    );
  };

  // Lookup helpers
  const getJobById = (id) => jobs.find((j) => j.id === id || j._id === id);
  const getCompanyById = (id) => companies.find((c) => c.id === id || c._id === id);

  return (
    <JobContext.Provider
      value={{
        jobs,
        companies,
        categories: initialCategories,
        cities: initialCities,
        domains: initialDomains,
        applications,
        savedJobIds,
        toggleSaveJob,
        isJobSaved,
        applyToJob,
        hasApplied,
        postNewJob,
        updateJobStatus,
        deleteJob,
        editJob,
        adminApproveJob,
        adminRejectJob,
        adminToggleFeature,
        adminVerifyCompany,
        updateApplicationStatus,
        getJobById,
        getCompanyById,
        categoryStats,
        categoryStatsLoading,
        refreshCategoryStats,
        refreshApplications,
      }}
    >
      {children}
    </JobContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
}
