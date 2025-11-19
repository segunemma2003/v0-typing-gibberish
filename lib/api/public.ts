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

// Create a public API client without auth interceptors
const publicApiClient = axios.create({
  baseURL: getPublicBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Service Functions

interface TenantInfo {
  id: string;
  name: string;
  subdomain: string;
  status: string;
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
  school: SchoolInfo;
  tenant: TenantInfo;
}

export const publicService = {
  /**
   * Get school details by subdomain (no authentication required)
   * Endpoint: GET /api/v1/schools/by-subdomain/{subdomain}
   */
  getSchoolBySubdomain: async (subdomain: string): Promise<GetSchoolBySubdomainResponse> => {
    const response = await publicApiClient.get(`/schools/by-subdomain/${encodeURIComponent(subdomain)}`)
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

