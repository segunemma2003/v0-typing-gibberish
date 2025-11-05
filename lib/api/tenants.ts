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

interface CreateTenantSchool {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  admin_name?: string;
  admin_email?: string;
  admin_password?: string;
}

interface CreateTenantSettings {
  timezone?: string;
  currency?: string;
}

interface CreateTenantRequest {
  name: string;
  subdomain: string;
  domain?: string;
  school: CreateTenantSchool;
  settings?: CreateTenantSettings;
}

interface CreateTenantResponse {
  message: string;
  tenant: Tenant;
  school: {
    id: number;
    name: string;
    address?: string;
    phone?: string;
    email?: string;
    status: string;
  };
  admin_credentials: {
    email: string;
    role: string;
    password: string;
    note: string;
  };
}

interface GetTenantsParams {
  page?: number;
  per_page?: number;
  status?: 'active' | 'inactive' | 'suspended';
  search?: string;
}

interface TenantStats {
  tenant: {
    total_users: number;
    total_schools: number;
  };
  schools: number;
  users: number;
  students: number;
  teachers: number;
}

interface TenantListPaginatedResponse {
  tenants: {
    data: Tenant[];
    links: {
      first: string;
      last: string;
      prev: string | null;
      next: string | null;
    };
    meta: {
      current_page: number;
      from: number;
      last_page: number;
      per_page: number;
      to: number;
      total: number;
    };
  };
}

export const tenantService = {
  // Tenant Management
  getTenants: async (params?: GetTenantsParams): Promise<TenantListResponse | TenantListPaginatedResponse> => {
    const response = await apiClient.get('/tenants', { params });
    return response.data;
  },

  getTenantById: async (id: number): Promise<Tenant> => {
    const response = await apiClient.get(`/tenants/${id}`);
    return response.data;
  },

  getTenantStats: async (id: number): Promise<{ stats: TenantStats }> => {
    const response = await apiClient.get(`/tenants/${id}/stats`);
    return response.data;
  },

  createTenant: async (data: CreateTenantRequest): Promise<CreateTenantResponse> => {
    const response = await apiClient.post('/tenants', data);
    return response.data;
  },

  updateTenant: async ({ id, data }: { id: number; data: Partial<CreateTenantRequest> }): Promise<{ message: string; tenant: Tenant }> => {
    const response = await apiClient.put(`/tenants/${id}`, data);
    return response.data;
  },

  deleteTenant: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/tenants/${id}`);
    return response.data;
  },
};

// 2. TanStack Query Hooks

export const useTenants = (params?: GetTenantsParams) => {
  return useQuery({
    queryKey: ['tenants', params],
    queryFn: () => tenantService.getTenants(params),
  });
};

export const useTenant = (id: number) => {
  return useQuery({
    queryKey: ['tenant', id],
    queryFn: () => tenantService.getTenantById(id),
    enabled: !!id,
  });
};

export const useTenantStats = (id: number) => {
  return useQuery({
    queryKey: ['tenantStats', id],
    queryFn: () => tenantService.getTenantStats(id),
    enabled: !!id,
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

export const useUpdateTenant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tenantService.updateTenant,
    onSuccess: (data, variables) => {
      console.log('Tenant updated successfully', data);
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      queryClient.invalidateQueries({ queryKey: ['tenant', variables.id] });
    },
  });
};

export const useDeleteTenant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tenantService.deleteTenant,
    onSuccess: () => {
      console.log('Tenant deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });
};
