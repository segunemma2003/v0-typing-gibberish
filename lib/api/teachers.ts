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
  data: Teacher[];
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

interface CreateTeacherRequest {
  name: string;
  subjects: number[]; // Array of subject IDs
  classes: number[]; // Array of class IDs
  qualification?: string;
  experience_years?: number;
  phone?: string;
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
