export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// HRMS UI URL (for redirects after logout)
// Check runtime environment (more reliable than build-time PROD)
const isProduction = typeof window !== 'undefined' && 
  (window.location.hostname === 'hrmssuperadmin.raipursolutions.com' || 
   window.location.hostname.includes('raipursolutions.com'));

export const HRMS_UI_URL = import.meta.env.VITE_HRMS_UI_URL || 
  (isProduction 
    ? 'https://hrms.raipursolutions.com' 
    : 'http://localhost:3000');

export const API_TIMEOUT = 10000;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/login',
    LOGOUT: '/api/logout',
    PROFILE: '/auth/profile',
    REFRESH_TOKEN: '/auth/refresh',
  },
};
