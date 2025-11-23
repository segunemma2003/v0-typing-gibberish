import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// Public API client (no authentication required)
const getPublicBaseURL = () => {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.compasse.net';
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

// Create a public API client without auth interceptors
const publicApiClient = axios.create({
  baseURL: getPublicBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add X-Subdomain header for public API calls
publicApiClient.interceptors.request.use(
  (config) => {
    // Add subdomain header for all subdomain API calls
    if (typeof window !== 'undefined') {
      const subdomain = getCurrentSubdomain();
      if (subdomain) {
        config.headers['X-Subdomain'] = subdomain;
        console.log('🌐 X-Subdomain header added to public API:', subdomain);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 1. Service Functions

interface TenantInfo {
  id: string | number; // Can be UUID string or number
  name: string;
  subdomain: string;
  status: string;
  domain?: string;
  has_database?: boolean;
  [key: string]: any; // Allow additional fields
}

interface SchoolInfo {
  id: number;
  name: string;
  code: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo: string | null;
  status: string;
  [key: string]: any; // Allow additional fields
}

interface GetSchoolBySubdomainResponse {
  exists: boolean;
  success: boolean;
  school?: SchoolInfo; // Optional - may not be in response
  tenant: TenantInfo;
}

export const publicService = {
  /**
   * Get school details by subdomain (no authentication required)
   * Endpoint: GET /api/v1/schools/by-subdomain/{subdomain}
   * Note: X-Subdomain header is automatically added by the interceptor
   */
  getSchoolBySubdomain: async (subdomain: string): Promise<GetSchoolBySubdomainResponse> => {
    // The X-Subdomain header will be automatically added by the interceptor
    // But we can also explicitly set it for this specific call
    const response = await publicApiClient.get(`/schools/by-subdomain/${encodeURIComponent(subdomain)}`, {
      headers: {
        'X-Subdomain': subdomain,
      },
    })
    return response.data
  },
}

// 2. TanStack Query Hooks

export const useSchoolBySubdomain = (subdomain: string) => {
  return useQuery({
    queryKey: ['schoolBySubdomain', subdomain],
    queryFn: () => publicService.getSchoolBySubdomain(subdomain),
    enabled: !!subdomain,
  });
};

