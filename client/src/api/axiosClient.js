import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization token if available
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('icityfix_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified error formatting
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred';

    // If 401 Unauthorized, clear stale token
    if (error.response?.status === 401) {
      const isAuthRequest = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');
      if (!isAuthRequest) {
        localStorage.removeItem('icityfix_token');
        localStorage.removeItem('icityfix_user');
      }
    }

    return Promise.reject({
      status: error.response?.status,
      message,
      data: error.response?.data,
    });
  }
);

export default axiosClient;
