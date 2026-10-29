import axios from 'axios';

// Get base API URL from environment variable or fallback to /api proxy
const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: automatically attach JWT token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ca_setu_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: handle 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      // Only clear if on protected pages
      if (window.location.pathname.startsWith('/student') || 
          window.location.pathname.startsWith('/employer') || 
          window.location.pathname.startsWith('/admin')) {
        localStorage.removeItem('ca_setu_token');
        localStorage.removeItem('ca_setu_user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

// Jobs endpoints
export const jobsAPI = {
  getJobs: (params) => api.get('/jobs', { params }),
  getCategoryStats: () => api.get('/jobs/category-stats'),
  getJobById: (id) => api.get(`/jobs/${id}`),
  createJob: (jobData) => api.post('/jobs', jobData),
  updateJob: (id, jobData) => api.put(`/jobs/${id}`, jobData),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
};

// Applications endpoints
export const applicationsAPI = {
  apply: (jobId, coverNote) => api.post('/applications', { jobId, coverNote }),
  getMyApplications: () => api.get('/applications/my'),
  getAllApplications: () => api.get('/applications'),
  updateStatus: (id, status, note) => api.put(`/applications/${id}/status`, { status, note }),
};

// Admin endpoints
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  verifyCompany: (id, isVerified) => api.put(`/admin/companies/${id}/verify`, { isVerified }),
  moderateJob: (id, status) => api.put(`/admin/jobs/${id}/moderation`, { status }),
};

export default api;
