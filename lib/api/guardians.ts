import apiClient from './apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 1. Service Functions

interface Guardian {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  relationship: string;
  students: Array<{
    id: number;
    name: string;
    admission_number: string;
  }>;
  created_at: string;
  updated_at?: string;
}

interface GuardianListResponse {
  data: Guardian[];
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
}

interface GetGuardiansParams {
  page?: number;
  per_page?: number;
  search?: string;
  student_id?: number;
}

interface CreateGuardianRequest {
  name: string;
  email: string;
  phone: string;
  address?: string;
  relationship: string;
  student_ids?: number[];
}

interface UpdateGuardianRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  relationship?: string;
}

export const guardianService = {
  getGuardians: async (params?: GetGuardiansParams): Promise<GuardianListResponse> => {
    const response = await apiClient.get('/guardians', { params });
    return response.data;
  },

  getGuardianById: async (id: number): Promise<Guardian> => {
    const response = await apiClient.get(`/guardians/${id}`);
    return response.data;
  },

  createGuardian: async (data: CreateGuardianRequest): Promise<{ message: string; guardian: Guardian }> => {
    const response = await apiClient.post('/guardians', data);
    return response.data;
  },

  updateGuardian: async ({ id, data }: { id: number; data: UpdateGuardianRequest }): Promise<{ message: string; guardian: Guardian }> => {
    const response = await apiClient.put(`/guardians/${id}`, data);
    return response.data;
  },

  deleteGuardian: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/guardians/${id}`);
    return response.data;
  },

  linkStudentToGuardian: async ({ guardian_id, student_id }: { guardian_id: number; student_id: number }): Promise<{ message: string }> => {
    const response = await apiClient.post(`/guardians/${guardian_id}/students/${student_id}`);
    return response.data;
  },

  unlinkStudentFromGuardian: async ({ guardian_id, student_id }: { guardian_id: number; student_id: number }): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/guardians/${guardian_id}/students/${student_id}`);
    return response.data;
  },
};

// 2. TanStack Query Hooks

export const useGuardians = (params?: GetGuardiansParams) => {
  return useQuery({
    queryKey: ['guardians', params],
    queryFn: () => guardianService.getGuardians(params),
  });
};

export const useGuardian = (id: number) => {
  return useQuery({
    queryKey: ['guardian', id],
    queryFn: () => guardianService.getGuardianById(id),
    enabled: !!id,
  });
};

export const useCreateGuardian = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: guardianService.createGuardian,
    onSuccess: (data) => {
      console.log('Guardian created successfully', data);
      queryClient.invalidateQueries({ queryKey: ['guardians'] });
    },
  });
};

export const useUpdateGuardian = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: guardianService.updateGuardian,
    onSuccess: (data, variables) => {
      console.log('Guardian updated successfully', data);
      queryClient.invalidateQueries({ queryKey: ['guardians'] });
      queryClient.invalidateQueries({ queryKey: ['guardian', variables.id] });
    },
  });
};

export const useDeleteGuardian = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: guardianService.deleteGuardian,
    onSuccess: () => {
      console.log('Guardian deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['guardians'] });
    },
  });
};

export const useLinkStudentToGuardian = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: guardianService.linkStudentToGuardian,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guardians'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

export const useUnlinkStudentFromGuardian = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: guardianService.unlinkStudentFromGuardian,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guardians'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

