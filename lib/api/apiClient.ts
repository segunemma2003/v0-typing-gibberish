import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  console.warn('⚠️ NEXT_PUBLIC_API_BASE_URL is not set. API calls may fail.');
}

// Construct base URL with API version prefix
const getBaseURL = () => {
  const base = API_BASE_URL || 'http://31.97.155.60:8078';
  // Remove trailing slash if present
  const cleanBase = base.replace(/\/$/, '');
  // Add /api/v1 prefix if not already present
  if (!cleanBase.includes('/api/v1')) {
    return `${cleanBase}/api/v1`;
  }
  return cleanBase;
};

const apiClient = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the authorization token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration or refresh (optional, more advanced)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Example: If 401 Unauthorized and not a login/refresh request
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // Here you might try to refresh the token
      // For simplicity, we'll just clear token and redirect to login
      localStorage.removeItem('token');
      // window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default apiClient;
