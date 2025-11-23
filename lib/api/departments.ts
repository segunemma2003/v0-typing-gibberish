import apiClient from './apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 1. Service Functions

interface DepartmentHead {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

interface Department {
  id: number;
  school_id: number;
  name: string;
  description?: string;
  head_of_department_id?: number;
  code?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at?: string;
  head?: DepartmentHead;
  subjects?: Array<{
    id: number;
    name: string;
    code: string;
  }>;
  staff_count?: number;
  teacher_count?: number;
}

interface DepartmentListResponse {
  data: Department[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

interface GetDepartmentsParams {
  page?: number;
  per_page?: number;
  search?: string;
}

interface CreateDepartmentRequest {
  name: string;
  description?: string;
  code?: string;
  head_of_department_id?: number;
  status?: 'active' | 'inactive';
}

interface UpdateDepartmentRequest {
  name?: string;
  description?: string;
  code?: string;
  head_of_department_id?: number;
  status?: 'active' | 'inactive';
}

interface DepartmentDetailsResponse {
  department: Department & {
    subjects?: Array<{
      id: number;
      name: string;
      code: string;
    }>;
    staff_count?: number;
    teacher_count?: number;
  };
}

export const departmentService = {
  getDepartments: async (params?: GetDepartmentsParams): Promise<DepartmentListResponse> => {
    const response = await apiClient.get('/departments', { params });
    return response.data;
  },

  getDepartmentById: async (id: number): Promise<DepartmentDetailsResponse> => {
    const response = await apiClient.get(`/departments/${id}`);
    return response.data;
  },

  createDepartment: async (data: CreateDepartmentRequest): Promise<{ message: string; department: Department }> => {
    const response = await apiClient.post('/departments', data);
    return response.data;
  },

  updateDepartment: async ({ id, data }: { id: number; data: UpdateDepartmentRequest }): Promise<{ message: string; department: Department }> => {
    const response = await apiClient.put(`/departments/${id}`, data);
    return response.data;
  },

  deleteDepartment: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/departments/${id}`);
    return response.data;
  },
};

// 2. TanStack Query Hooks

export const useDepartments = (params?: GetDepartmentsParams) => {
  return useQuery({
    queryKey: ['departments', params],
    queryFn: () => departmentService.getDepartments(params),
  });
};

export const useDepartment = (id: number) => {
  return useQuery({
    queryKey: ['department', id],
    queryFn: () => departmentService.getDepartmentById(id),
    enabled: !!id,
  });
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: departmentService.createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: departmentService.updateDepartment,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['department', variables.id] });
    },
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: departmentService.deleteDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
};

