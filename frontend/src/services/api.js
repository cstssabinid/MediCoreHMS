import axios from 'axios';
import { getToken } from '../utils/auth';

const backendUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const api = axios.create({
  baseURL: `${backendUrl}/api`,
  timeout: 10000
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginRequest = (data) => api.post('/auth/login', data);
export const fetchProfile = () => api.get('/auth/profile');
export const fetchPatients = () => api.get('/patients');
export const createPatient = (data) => api.post('/patients', data);
export const fetchAppointments = () => api.get('/appointments');
export const fetchTodayAppointments = () => api.get('/appointments/today');
export const fetchReports = () => api.get('/reports');
export const fetchAuditLogs = () => api.get('/audit');

export default api;
