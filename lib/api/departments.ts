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
  getDepartments: async (params?: GetDepartmentsParams): Promise<Department[] | DepartmentListResponse> => {
    const response = await apiClient.get('/departments', { params });
    // API may return direct array or wrapped in { data: [...] }
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

  // HOD-specific endpoints
  getDepartmentTeachers: async (id: number): Promise<Array<{
    id: number;
    name: string;
    email: string;
    phone?: string;
    qualification?: string;
    specialization?: string;
    subjects?: Array<{
      id: number;
      name: string;
    }>;
  }>> => {
    const response = await apiClient.get(`/departments/${id}/teachers`);
    return Array.isArray(response.data) ? response.data : (response.data?.data || []);
  },

  getDepartmentSubjects: async (id: number): Promise<Array<{
    id: number;
    name: string;
    code: string;
    teacher_count: number;
    student_count: number;
  }>> => {
    const response = await apiClient.get(`/departments/${id}/subjects`);
    return Array.isArray(response.data) ? response.data : (response.data?.data || []);
  },

  getDepartmentPerformance: async (id: number): Promise<{
    department: {
      id: number;
      name: string;
    };
    statistics: {
      total_teachers: number;
      total_subjects: number;
      total_students: number;
      average_score: number;
      pass_rate: number;
    };
    teacher_performance: Array<{
      id: number;
      name: string;
      average_score: number;
      student_count: number;
      attendance_rate: number;
    }>;
    subject_performance: Array<{
      id: number;
      name: string;
      average_score: number;
      pass_rate: number;
      student_count: number;
    }>;
  }> => {
    const response = await apiClient.get(`/departments/${id}/performance`);
    return response.data;
  },

  assignTeacherToSubject: async (data: {
    teacher_id: number;
    subject_id: number;
  }): Promise<{ message: string }> => {
    const response = await apiClient.post('/departments/assign-teacher', data);
    return response.data;
  },

  getTeacherAttendance: async (id: number, params?: { from?: string; to?: string }): Promise<{
    department: {
      id: number;
      name: string;
    };
    attendance: Array<{
      teacher_id: number;
      teacher_name: string;
      date: string;
      status: 'present' | 'absent' | 'late';
      check_in_time?: string;
    }>;
    summary: {
      total_days: number;
      present: number;
      absent: number;
      late: number;
      attendance_rate: number;
    };
  }> => {
    const response = await apiClient.get(`/departments/${id}/teacher-attendance`, { params });
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

// HOD-specific hooks
export const useDepartmentTeachers = (id: number) => {
  return useQuery({
    queryKey: ['departmentTeachers', id],
    queryFn: () => departmentService.getDepartmentTeachers(id),
    enabled: !!id,
  });
};

export const useDepartmentSubjects = (id: number) => {
  return useQuery({
    queryKey: ['departmentSubjects', id],
    queryFn: () => departmentService.getDepartmentSubjects(id),
    enabled: !!id,
  });
};

export const useDepartmentPerformance = (id: number) => {
  return useQuery({
    queryKey: ['departmentPerformance', id],
    queryFn: () => departmentService.getDepartmentPerformance(id),
    enabled: !!id,
  });
};

export const useAssignTeacherToSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: departmentService.assignTeacherToSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departmentTeachers'] });
      queryClient.invalidateQueries({ queryKey: ['departmentSubjects'] });
    },
  });
};

export const useTeacherAttendance = (id: number, params?: { from?: string; to?: string }) => {
  return useQuery({
    queryKey: ['teacherAttendance', id, params],
    queryFn: () => departmentService.getTeacherAttendance(id, params),
    enabled: !!id,
  });
};

