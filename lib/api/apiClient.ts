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
    // Only access localStorage on client-side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔑 Token added to request:', token.substring(0, 20) + '...');
      } else {
        console.warn('⚠️ No token found in localStorage');
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration or refresh
apiClient.interceptors.response.use(
  (response) => {
    // Log successful authenticated requests
    if (response.config.headers?.Authorization) {
      console.log('✅ Authenticated request successful:', response.config.url);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle network errors or errors without response
    if (!error.response) {
      console.error('❌ Network error or no response:', error.message);
      return Promise.reject(error);
    }
    
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.warn('⚠️ 401 Unauthorized - Clearing token');
      
      // Clear token on client-side only
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        // Optionally redirect to login page
        // window.location.href = '/login';
      }
    }
    
    // Log other errors
    if (error.response.status >= 500) {
      console.error('❌ Server error:', error.response.status, error.response.data);
    } else if (error.response.status >= 400) {
      console.warn('⚠️ Client error:', error.response.status, error.response.data);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
