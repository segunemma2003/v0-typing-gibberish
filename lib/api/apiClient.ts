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
  if (!hostname) return null;
  
  const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'compasse.net';
  
  // Handle localhost development
  if (hostname === 'localhost' || hostname.startsWith('localhost:')) {
    // Try to get from URL params
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const schoolParam = urlParams.get('school');
      if (schoolParam) return schoolParam;
    }
    return null;
  }
  
  // Check if hostname contains base domain (e.g., schoolname.compasse.net)
  if (hostname.includes(`.${BASE_DOMAIN}`)) {
    const parts = hostname.split('.');
    const baseDomainParts = BASE_DOMAIN.split('.');
    
    // If it's a subdomain (e.g., test.compasse.net)
    // parts would be: ['test', 'compasse', 'net']
    // baseDomainParts would be: ['compasse', 'net']
    // parts.length (3) > baseDomainParts.length (2) = true, so return 'test'
    if (parts.length > baseDomainParts.length) {
      const subdomain = parts[0];
      console.log('🔍 Extracted subdomain from hostname:', hostname, '->', subdomain);
      return subdomain;
    }
    
    // If hostname equals base domain exactly (e.g., compasse.net), no subdomain
    if (hostname === BASE_DOMAIN) {
      return null;
    }
  }
  
  // Handle other subdomain patterns (e.g., subdomain.domain.com)
  // For cases where hostname is something like "test.example.com"
  const parts = hostname.split('.');
  if (parts.length >= 3 && !hostname.endsWith(`.${BASE_DOMAIN}`)) {
    const subdomain = parts[0];
    console.log('🔍 Extracted subdomain from generic pattern:', hostname, '->', subdomain);
    return subdomain;
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
      const hostname = window.location.hostname;
      
      if (subdomain) {
        config.headers['X-Subdomain'] = subdomain;
        console.log('🌐 X-Subdomain header added:', subdomain, 'for URL:', config.url);
      } else {
        // CRITICAL: Try fallback detection if no subdomain found
        // This handles cases where localStorage might not be initialized yet
        if (hostname && hostname.includes('.') && !hostname.includes('localhost')) {
          const fallbackSubdomain = getSubdomainFromHostname(hostname);
          if (fallbackSubdomain) {
            config.headers['X-Subdomain'] = fallbackSubdomain;
            localStorage.setItem('subdomain', fallbackSubdomain);
            console.log('✅ Fallback: X-Subdomain header added:', fallbackSubdomain, 'for URL:', config.url);
          } else {
            // Log detailed warning only if we truly couldn't detect subdomain
            const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'compasse.net';
            // Only warn if we're on a subdomain-like hostname but couldn't extract it
            if (hostname.includes(`.${BASE_DOMAIN}`) || (hostname.split('.').length >= 3)) {
              console.warn('⚠️ No subdomain detected for X-Subdomain header (this may cause 401 errors):', {
                hostname,
                url: config.url,
                method: config.method,
                hasLocalStorage: !!localStorage.getItem('subdomain'),
                BASE_DOMAIN,
                parts: hostname.split('.'),
              });
            }
          }
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
      
      // Log detailed 401 error information for debugging
      const subdomain = typeof window !== 'undefined' ? localStorage.getItem('subdomain') : null;
      const hostname = typeof window !== 'undefined' ? window.location.hostname : 'server';
      
      console.error('❌ 401 Unauthorized Error:', {
        url: originalRequest.url,
        method: originalRequest.method,
        subdomain: subdomain || 'NOT SET',
        hostname,
        headers: {
          'X-Subdomain': originalRequest.headers['X-Subdomain'] || 'MISSING',
          'Authorization': originalRequest.headers['Authorization'] ? 'PRESENT' : 'MISSING',
        },
        errorData: error.response?.data,
      });
      
      // Clear token on client-side only
      if (typeof window !== 'undefined') {
        // Don't clear token automatically - let user see the error
        // localStorage.removeItem('token');
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
