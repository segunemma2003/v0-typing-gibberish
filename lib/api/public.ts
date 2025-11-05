import apiClient from './apiClient';
import { useQuery } from '@tanstack/react-query';

// 1. Service Functions

interface TenantInfo {
  id: number;
  name: string;
  subdomain: string;
  domain: string;
  status: string;
}

interface SchoolInfo {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo: string;
  status: string;
  academic_year: string;
  term: string;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface SchoolStats {
  students: number;
  teachers: number;
  classes: number;
}

interface GetSchoolBySubdomainResponse {
  success: boolean;
  subdomain: string;
  tenant: TenantInfo;
  school: SchoolInfo;
  stats: SchoolStats;
}

export const publicService = {
  getSchoolBySubdomain: async (subdomain: string): Promise<GetSchoolBySubdomainResponse> => {
    // Public endpoint doesn't require /api/v1 prefix - it's at /api/v1/schools/subdomain/{subdomain}
    const response = await apiClient.get(`/schools/subdomain/${subdomain}`);
    return response.data;
  },
};

// 2. TanStack Query Hooks

export const useSchoolBySubdomain = (subdomain: string) => {
  return useQuery({
    queryKey: ['schoolBySubdomain', subdomain],
    queryFn: () => publicService.getSchoolBySubdomain(subdomain),
    enabled: !!subdomain,
  });
};

