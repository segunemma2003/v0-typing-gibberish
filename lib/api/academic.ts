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

  updateClass: async ({ id, data }: { id: number; data: Partial<CreateClassRequest> }): Promise<{ message: string; class: Class }> => {
    const response = await apiClient.put(`/classes/${id}`, data);
    return response.data;
  },

  deleteClass: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/classes/${id}`);
    return response.data;
  },

  updateSubject: async ({ id, data }: { id: number; data: Partial<CreateSubjectRequest> }): Promise<{ message: string; subject: Subject }> => {
    const response = await apiClient.put(`/subjects/${id}`, data);
    return response.data;
  },

  deleteSubject: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/subjects/${id}`);
    return response.data;
  },

  // Academic Years
  getAcademicYears: async (): Promise<{ data: any[] }> => {
    const response = await apiClient.get('/academic-years');
    return response.data;
  },

  // Terms
  getTerms: async (): Promise<{ data: any[] }> => {
    const response = await apiClient.get('/terms');
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

export const useUpdateClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: academicService.updateClass,
    onSuccess: (data, variables) => {
      console.log('Class updated successfully', data);
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      queryClient.invalidateQueries({ queryKey: ['class', variables.id] });
    },
  });
};

export const useDeleteClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: academicService.deleteClass,
    onSuccess: () => {
      console.log('Class deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
};

export const useUpdateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: academicService.updateSubject,
    onSuccess: (data, variables) => {
      console.log('Subject updated successfully', data);
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      queryClient.invalidateQueries({ queryKey: ['subject', variables.id] });
    },
  });
};

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: academicService.deleteSubject,
    onSuccess: () => {
      console.log('Subject deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });
};

// Academic Years
export const useAcademicYears = () => {
  return useQuery({
    queryKey: ['academicYears'],
    queryFn: academicService.getAcademicYears,
  });
};

// Terms
export const useTerms = () => {
  return useQuery({
    queryKey: ['terms'],
    queryFn: academicService.getTerms,
  });
};
