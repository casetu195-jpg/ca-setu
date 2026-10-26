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

    applicationsAPI
      .getMyApplications()
      .then((res) => {
        if (res.data?.success && res.data.applications) {
          const normalized = res.data.applications.map((a) => ({
            ...a,
            id: a._id || a.id,
            jobId: a.jobId?._id || a.jobId?.id || a.jobId,
          }));
          setApplications((prev) => {
            const map = new Map();
            [...normalized, ...prev].forEach((item) => map.set(item.id, item));
            return Array.from(map.values());
          });
        }
      })
      .catch(() => {
        // Fallback to local applications
      });
  }, []);

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

  // Apply to Job
  const applyToJob = async ({ jobId, student, coverNote }) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) throw new Error('Job not found');

    // Duplicate Check
    const alreadyApplied = applications.some(
      (a) => a.jobId === jobId && (a.studentId === student.id || a.studentEmail === student.email)
    );
    if (alreadyApplied) {
      return { success: false, message: 'You have already submitted an application for this vacancy.' };
    }

    try {
      // Try sending to real backend API first
      const res = await applicationsAPI.apply(jobId, coverNote);
      if (res.data?.success && res.data.application) {
        const app = {
          ...res.data.application,
          id: res.data.application._id || res.data.application.id,
        };
        setApplications((prev) => [app, ...prev]);
        setJobs((prev) =>
          prev.map((j) => (j.id === jobId ? { ...j, applicantCount: (j.applicantCount || 0) + 1 } : j))
        );
        return { success: true, application: app };
      }
    } catch (apiErr) {
      // Check duplicate error from server (409)
      if (apiErr.response?.status === 409) {
        return { success: false, message: apiErr.response.data.message || 'Already applied.' };
      }
    }

    // Local / Offline fallback
    const newApplication = {
      id: 'app-' + Date.now(),
      jobId,
      studentId: student.id,
      studentName: student.name,
      studentEmail: student.email,
      studentPhone: student.phone || '+91 98765 43210',
      caStage: student.caStage || 'Final',
      groupsCleared: student.groupsCleared || 'Both Groups',
      attemptsCount: student.attemptsCount || 1,
      city: student.city || 'Mumbai',
      appliedDate: new Date().toISOString(),
      status: 'Applied',
      coverNote: coverNote || '',
      resumeUrl: student.resumeUrl || 'https://casetu.com/resumes/default-resume.pdf',
      statusHistory: [
        { status: 'Applied', date: new Date().toISOString(), note: 'Application submitted successfully on CA Dwar' },
      ],
    };

    setApplications((prev) => [newApplication, ...prev]);
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, applicantCount: (j.applicantCount || 0) + 1 } : j))
    );

    return { success: true, application: newApplication };
  };

  const hasApplied = (jobId, studentId, studentEmail) => {
    return applications.some(
      (a) => a.jobId === jobId && (a.studentId === studentId || (studentEmail && a.studentEmail === studentEmail))
    );
  };

  // Employer Job Posting
  const postNewJob = async (jobData, companyId) => {
    const company = companies.find((c) => c.id === companyId) || companies[0];

    try {
      const res = await jobsAPI.createJob(jobData);
      if (res.data?.success && res.data.job) {
        const liveJob = {
          ...res.data.job,
          id: res.data.job._id || res.data.job.id,
          companyId: company.id,
        };
        setJobs((prev) => [liveJob, ...prev]);
        return liveJob;
      }
    } catch {
      // Fallback local save
    }

    const newJob = {
      ...jobData,
      id: 'job-' + Date.now(),
      companyId: company.id,
      status: company.isVerified ? 'Published' : 'Pending Review',
      isFeatured: jobData.isFeatured || false,
      applicantCount: 0,
      postedTime: 'Just now',
      createdAt: new Date().toISOString(),
    };

    setJobs((prev) => [newJob, ...prev]);
    return newJob;
  };

  // Update Job Status
  const updateJobStatus = async (jobId, newStatus) => {
    try {
      await jobsAPI.updateJob(jobId, { status: newStatus });
    } catch {
      // Fallback
    }

    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j))
    );
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
  const getJobById = (id) => jobs.find((j) => j.id === id);
  const getCompanyById = (id) => companies.find((c) => c.id === id);

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
        adminApproveJob,
        adminRejectJob,
        adminToggleFeature,
        adminVerifyCompany,
        updateApplicationStatus,
        getJobById,
        getCompanyById,
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
