import apiClient from './apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 1. Service Functions

interface SubjectInfo {
  id: number;
  name: string;
  code?: string;
}

interface ClassArmInfo {
  id: number;
  name: string;
}

interface Teacher {
  id: number;
  name: string;
  email: string;
  username: string;
  subjects: SubjectInfo[];
  classes: ClassArmInfo[];
  qualification?: string;
  experience_years?: number;
  status: 'active' | 'inactive' | 'suspended';
  phone?: string;
}

interface TeacherListResponse {
  data?: Teacher[]; // For direct array or { data: [...] } format
  teachers?: { // For wrapped format { teachers: { data: [...] } }
    data: Teacher[];
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
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

interface CreateTeacherRequest {
  first_name: string;
  last_name: string;
  phone?: string;
  employment_date: string;
  subjects?: number[]; // Array of subject IDs
  classes?: number[]; // Array of class IDs
  qualification?: string;
  experience_years?: number;
}

export const teacherService = {
  getTeachers: async (): Promise<TeacherListResponse> => {
    const response = await apiClient.get('/teachers');
    return response.data;
  },

  getTeacherById: async (id: number): Promise<Teacher> => {
    const response = await apiClient.get(`/teachers/${id}`);
    return response.data;
  },

  createTeacher: async (data: CreateTeacherRequest): Promise<{ message: string; teacher: Teacher }> => {
    const response = await apiClient.post('/teachers', data);
    return response.data;
  },

  updateTeacher: async ({ id, data }: { id: number; data: Partial<CreateTeacherRequest> }): Promise<{ message: string; teacher: Teacher }> => {
    const response = await apiClient.put(`/teachers/${id}`, data);
    return response.data;
  },

  deleteTeacher: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/teachers/${id}`);
    return response.data;
  },

  // Teacher-specific endpoints
  getMyProfile: async (): Promise<Teacher & {
    qualification?: string;
    specialization?: string;
    department?: {
      id: number;
      name: string;
    };
  }> => {
    const response = await apiClient.get('/teachers/me');
    return response.data;
  },

  updateMyProfile: async (data: {
    phone?: string;
    address?: string;
    qualification?: string;
    specialization?: string;
  }): Promise<{ message: string; teacher: Teacher }> => {
    const response = await apiClient.put('/teachers/me', data);
    return response.data;
  },

  getMyClasses: async (): Promise<Array<{
    id: number;
    name: string;
    capacity: number;
    students_count: number;
    class_teacher: {
      id: number;
      name: string;
    };
    arms?: Array<{
      id: number;
      name: string;
    }>;
  }>> => {
    const response = await apiClient.get('/classes', { params: { class_teacher_id: 'me' } });
    return Array.isArray(response.data) ? response.data : (response.data?.data || []);
  },

  getMySubjects: async (): Promise<Array<{
    id: number;
    name: string;
    code: string;
    classes: Array<{
      id: number;
      name: string;
    }>;
    students_count: number;
  }>> => {
    const response = await apiClient.get('/subjects', { params: { teacher_id: 'me' } });
    return Array.isArray(response.data) ? response.data : (response.data?.data || []);
  },
};

// 2. TanStack Query Hooks

export const useTeachers = () => {
  return useQuery({
    queryKey: ['teachers'],
    queryFn: teacherService.getTeachers,
  });
};

export const useTeacher = (id: number) => {
  return useQuery({
    queryKey: ['teacher', id],
    queryFn: () => teacherService.getTeacherById(id),
    enabled: !!id,
  });
};

export const useCreateTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: teacherService.createTeacher,
    onSuccess: (data) => {
      console.log('Teacher created successfully', data);
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
  });
};

export const useUpdateTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: teacherService.updateTeacher,
    onSuccess: (data, variables) => {
      console.log('Teacher updated successfully', data);
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      queryClient.invalidateQueries({ queryKey: ['teacher', variables.id] });
    },
  });
};

export const useDeleteTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: teacherService.deleteTeacher,
    onSuccess: () => {
      console.log('Teacher deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
  });
};

// Teacher-specific hooks
export const useMyProfile = () => {
  return useQuery({
    queryKey: ['myProfile'],
    queryFn: teacherService.getMyProfile,
  });
};

export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: teacherService.updateMyProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      queryClient.invalidateQueries({ queryKey: ['teacherDashboard'] });
    },
  });
};

export const useMyClasses = () => {
  return useQuery({
    queryKey: ['myClasses'],
    queryFn: teacherService.getMyClasses,
  });
};

export const useMySubjects = () => {
  return useQuery({
    queryKey: ['mySubjects'],
    queryFn: teacherService.getMySubjects,
  });
};
