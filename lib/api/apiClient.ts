import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  console.warn('⚠️ NEXT_PUBLIC_API_BASE_URL is not set. API calls may fail.');
}

// Construct base URL with API version prefix
const getBaseURL = () => {
  const base = API_BASE_URL || 'https://api.compasse.net';
  // Remove trailing slash if present
  const cleanBase = base.replace(/\/$/, '');
  // Add /api/v1 prefix if not already present
  if (!cleanBase.includes('/api/v1')) {
    return `${cleanBase}/api/v1`;
  }
  return cleanBase;
};

// Helper function to extract subdomain from hostname
const getSubdomainFromHostname = (hostname: string): string | null => {
  const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'compasse.net';
  
  // Handle localhost development
  if (hostname === 'localhost' || hostname.startsWith('localhost:')) {
    // Try to get from URL params
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('school');
    }
    return null;
  }
  
  // Check if hostname contains base domain
  if (hostname.includes(`.${BASE_DOMAIN}`)) {
    const parts = hostname.split('.');
    const baseDomainParts = BASE_DOMAIN.split('.');
    
    // If it's a subdomain (e.g., test.compasse.net)
    if (parts.length > baseDomainParts.length) {
      return parts[0]; // Return the first part as subdomain
    }
  }
  
  // Handle other subdomain patterns (e.g., subdomain.domain.com)
  const parts = hostname.split('.');
  if (parts.length >= 3) {
    return parts[0];
  }
  
  return null;
};

// Helper function to get current subdomain
const getCurrentSubdomain = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  // First, try to get from localStorage (if stored)
  const storedSubdomain = localStorage.getItem('subdomain');
  if (storedSubdomain) {
    return storedSubdomain;
  }
  
  // Otherwise, extract from hostname (more reliable)
  const hostname = window.location.hostname;
  const subdomain = getSubdomainFromHostname(hostname);
  
  // If we found a subdomain from hostname, store it in localStorage for next time
  if (subdomain && typeof window !== 'undefined') {
    localStorage.setItem('subdomain', subdomain);
  }
  
  return subdomain;
};

// Helper function to get subdomain for header (always tries to get it)
const getSubdomainForHeader = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  // Priority 1: Check localStorage (fastest)
  const storedSubdomain = localStorage.getItem('subdomain');
  if (storedSubdomain) {
    return storedSubdomain;
  }
  
  // Priority 2: Extract from current URL/hostname
  const hostname = window.location.hostname;
  const subdomain = getSubdomainFromHostname(hostname);
  
  // If we found a subdomain, store it for next time
  if (subdomain) {
    localStorage.setItem('subdomain', subdomain);
    return subdomain;
  }
  
  // Priority 3: Check URL search params (for localhost development)
  if (hostname === 'localhost' || hostname.startsWith('localhost:')) {
    const urlParams = new URLSearchParams(window.location.search);
    const schoolParam = urlParams.get('school');
    if (schoolParam) {
      localStorage.setItem('subdomain', schoolParam);
      return schoolParam;
    }
  }
  
  return null;
};

const apiClient = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the authorization token and tenant context
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

      // Add tenant context if available
      const tenantId = localStorage.getItem('tenant_id');
      if (tenantId) {
        config.headers['X-Tenant-ID'] = tenantId;
      }

      // Add subdomain header for all subdomain API calls (critical for multi-tenancy)
      // Always try to get subdomain, even if localStorage doesn't have it yet
      const subdomain = getSubdomainForHeader();
      if (subdomain) {
        config.headers['X-Subdomain'] = subdomain;
        console.log('🌐 X-Subdomain header added:', subdomain);
      } else {
        // Log warning if no subdomain found (might be super admin or base domain)
        const hostname = window.location.hostname;
        if (hostname && !hostname.includes('localhost') && !hostname.includes('compasse.net')) {
          console.warn('⚠️ No subdomain detected for X-Subdomain header. Hostname:', hostname);
        }
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
