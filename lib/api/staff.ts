import apiClient from './apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 1. Service Functions

interface Staff {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  department?: string;
  position?: string;
  status: 'active' | 'inactive';
  created_at: string;
}

interface StaffListResponse {
  data: Staff[];
  links?: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta?: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

interface GetStaffParams {
  page?: number;
  per_page?: number;
  role?: string;
  department?: string;
  status?: string;
  search?: string;
}

interface CreateStaffRequest {
  name: string;
  email: string;
  phone?: string;
  role: string;
  department?: string;
  position?: string;
}

interface UpdateStaffRequest {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  department?: string;
  position?: string;
  status?: 'active' | 'inactive';
}

export const staffService = {
  getStaff: async (params?: GetStaffParams): Promise<StaffListResponse> => {
    const response = await apiClient.get('/staff', { params });
    return response.data;
  },

  getStaffById: async (id: number): Promise<Staff> => {
    const response = await apiClient.get(`/staff/${id}`);
    return response.data;
  },

  createStaff: async (data: CreateStaffRequest): Promise<{ message: string; staff: Staff }> => {
    const response = await apiClient.post('/staff', data);
    return response.data;
  },

  updateStaff: async ({ id, data }: { id: number; data: UpdateStaffRequest }): Promise<{ message: string; staff: Staff }> => {
    const response = await apiClient.put(`/staff/${id}`, data);
    return response.data;
  },

  deleteStaff: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/staff/${id}`);
    return response.data;
  },
};

// 2. TanStack Query Hooks

export const useStaff = (params?: GetStaffParams) => {
  return useQuery({
    queryKey: ['staff', params],
    queryFn: () => staffService.getStaff(params),
  });
};

export const useStaffMember = (id: number) => {
  return useQuery({
    queryKey: ['staff', id],
    queryFn: () => staffService.getStaffById(id),
    enabled: !!id,
  });
};

export const useCreateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: staffService.createStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
};

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: staffService.updateStaff,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      queryClient.invalidateQueries({ queryKey: ['staff', variables.id] });
    },
  });
};

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: staffService.deleteStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
};

