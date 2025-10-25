import apiClient from './apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 1. Service Functions

export interface Tenant {
  id: number;
  name: string;
  domain: string;
  database_name: string;
  status: string;
  schools_count: number;
  users_count: number;
}

interface TenantListResponse {
  data: Tenant[];
}

interface CreateTenantRequest {
  name: string;
  domain: string;
  database_name: string;
}

export const tenantService = {
  // Tenant Management
  getTenants: async (): Promise<TenantListResponse> => {
    const response = await apiClient.get('/tenants');
    return response.data;
  },

  createTenant: async (data: CreateTenantRequest): Promise<{ message: string; tenant: Tenant }> => {
    const response = await apiClient.post('/tenants', data);
    return response.data;
  },
};

// 2. TanStack Query Hooks

export const useTenants = () => {
  return useQuery({
    queryKey: ['tenants'],
    queryFn: tenantService.getTenants,
  });
};

export const useCreateTenant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tenantService.createTenant,
    onSuccess: (data) => {
      console.log('Tenant created successfully', data);
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });
};
