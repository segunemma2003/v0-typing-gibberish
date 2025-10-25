import apiClient from './apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 1. Service Functions

interface Arm {
  id: number;
  name: string;
  class_teacher?: { id: number; name: string };
}

interface Class {
  id: number;
  name: string;
  level: string;
  arms: Arm[];
  student_count: number;
}

interface SubjectTeacher {
  id: number;
  name: string;
}

interface Subject {
  id: number;
  name: string;
  code: string;
  description: string;
  teachers: SubjectTeacher[];
}

interface ClassListResponse {
  data: Class[];
}

interface SubjectListResponse {
  data: Subject[];
}

interface CreateClassRequest {
  name: string;
  level: string;
  arms: string[];
}

interface CreateSubjectRequest {
  name: string;
  code: string;
  description: string;
  teacher_ids: number[];
}

export const academicService = {
  // Classes
  getClasses: async (): Promise<ClassListResponse> => {
    const response = await apiClient.get('/classes');
    return response.data;
  },

  createClass: async (data: CreateClassRequest): Promise<{ message: string; class: Class }> => {
    const response = await apiClient.post('/classes', data);
    return response.data;
  },

  // Subjects
  getSubjects: async (): Promise<SubjectListResponse> => {
    const response = await apiClient.get('/subjects');
    return response.data;
  },

  createSubject: async (data: CreateSubjectRequest): Promise<{ message: string; subject: Subject }> => {
    const response = await apiClient.post('/subjects', data);
    return response.data;
  },
};

// 2. TanStack Query Hooks

// Classes
export const useClasses = () => {
  return useQuery({
    queryKey: ['classes'],
    queryFn: academicService.getClasses,
  });
};

export const useCreateClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: academicService.createClass,
    onSuccess: (data) => {
      console.log('Class created successfully', data);
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
};

// Subjects
export const useSubjects = () => {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: academicService.getSubjects,
  });
};

export const useCreateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: academicService.createSubject,
    onSuccess: (data) => {
      console.log('Subject created successfully', data);
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });
};
