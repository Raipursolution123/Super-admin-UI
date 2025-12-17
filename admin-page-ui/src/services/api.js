import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT, HTTP_STATUS } from '../constants/apiConstants';
import { STORAGE_KEYS } from '../constants/appConstants';
// import store from '../store/store'; // Will import after store is created to avoid circular dependency issues if any, though direct import usually fine
// import { logout } from '../store/slices/authSlice';

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Request interceptor with logging
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    } else if (config.data) {
      config.headers['Content-Type'] = 'application/json';
    }
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers
    });

    return config;
  },
  (error) => {
    console.error('Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);


API.interceptors.response.use(
  (response) => {
    console.log('API Response Success:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    const { config, response } = error;

    console.error('API Response Error:', {
      url: config?.url,
      status: response?.status,
      data: response?.data,
      message: error.message
    });

    // Specific handling for 404 errors
    if (response?.status === HTTP_STATUS.NOT_FOUND) {
      const errorMessage = `Resource not found: ${config?.url}`;
      console.warn('404 Error:', errorMessage);

      const customError = new Error(errorMessage);
      customError.status = 404;
      customError.url = config?.url;
      customError.is404 = true;

      return Promise.reject(customError);
    }

    // Handle Unauthorized
    if (response?.status === HTTP_STATUS.UNAUTHORIZED) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);

      // Dispatch logout if store is available (TODO: Import store and dispatch)
      // store.dispatch(logout());

      // Redirect to login (In this case, maybe redirect back to main HRMS UI login?)
      // window.location.href = 'http://localhost:3000/login'; 
    }

    // Always return a proper error object
    const enhancedError = new Error(
      response?.data?.message ||
      response?.data?.detail ||
      error.message ||
      'Request failed'
    );
    enhancedError.status = response?.status;
    enhancedError.data = response?.data;

    return Promise.reject(enhancedError);
  }
);

export default API;
