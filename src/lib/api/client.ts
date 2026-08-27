import axios from 'axios';

const backendUrl = String(import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:8000').replace(/\/+$/, '').replace(/\/api$/, '');

export const api = axios.create({
  baseURL: `${backendUrl}/api`,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

api.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.message || error.message || 'Request failed';
    const normalized = new Error(message);
    (normalized as Error & { status?: number }).status = error.response?.status;
    return Promise.reject(normalized);
  },
);
