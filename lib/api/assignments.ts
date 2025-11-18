import apiClient from './apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 1. Service Functions

interface Assignment {
  id: number;
  title: string;
  description: string;
  subject_id: number;
  class_id: number;
  teacher_id: number;
  due_date: string;
  total_marks: number;
  status: 'draft' | 'published' | 'closed';
  created_at: string;
  updated_at?: string;
}

interface AssignmentSubmission {
  id: number;
  assignment_id: number;
  student_id: number;
  content: string;
  file_url?: string;
  submitted_at: string;
  grade?: number;
  feedback?: string;
  status: 'submitted' | 'graded';
}

interface AssignmentListResponse {
  data: Assignment[];
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

interface GetAssignmentsParams {
  page?: number;
  per_page?: number;
  class_id?: number;
  subject_id?: number;
  teacher_id?: number;
  status?: string;
  search?: string;
}

interface CreateAssignmentRequest {
  title: string;
  description: string;
  subject_id: number;
  class_id: number;
  due_date: string;
  total_marks: number;
  status?: 'draft' | 'published';
}

interface UpdateAssignmentRequest {
  title?: string;
  description?: string;
  due_date?: string;
  total_marks?: number;
  status?: 'draft' | 'published' | 'closed';
}

interface SubmitAssignmentRequest {
  content: string;
  file_url?: string;
}

interface GradeAssignmentRequest {
  grade: number;
  feedback?: string;
}

export const assignmentService = {
  getAssignments: async (params?: GetAssignmentsParams): Promise<AssignmentListResponse> => {
    const response = await apiClient.get('/assignments', { params });
    return response.data;
  },

  getAssignmentById: async (id: number): Promise<Assignment> => {
    const response = await apiClient.get(`/assignments/${id}`);
    return response.data;
  },

  createAssignment: async (data: CreateAssignmentRequest): Promise<{ message: string; assignment: Assignment }> => {
    const response = await apiClient.post('/assignments', data);
    return response.data;
  },

  updateAssignment: async ({ id, data }: { id: number; data: UpdateAssignmentRequest }): Promise<{ message: string; assignment: Assignment }> => {
    const response = await apiClient.put(`/assignments/${id}`, data);
    return response.data;
  },

  deleteAssignment: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/assignments/${id}`);
    return response.data;
  },

  getAssignmentSubmissions: async (id: number): Promise<{ data: AssignmentSubmission[] }> => {
    const response = await apiClient.get(`/assignments/${id}/submissions`);
    return response.data;
  },

  submitAssignment: async ({ id, data }: { id: number; data: SubmitAssignmentRequest }): Promise<{ message: string; submission: AssignmentSubmission }> => {
    const response = await apiClient.post(`/assignments/${id}/submit`, data);
    return response.data;
  },

  gradeAssignment: async ({ id, data }: { id: number; data: GradeAssignmentRequest }): Promise<{ message: string; submission: AssignmentSubmission }> => {
    const response = await apiClient.put(`/assignments/${id}/grade`, data);
    return response.data;
  },
};

// 2. TanStack Query Hooks

export const useAssignments = (params?: GetAssignmentsParams) => {
  return useQuery({
    queryKey: ['assignments', params],
    queryFn: () => assignmentService.getAssignments(params),
  });
};

export const useAssignment = (id: number) => {
  return useQuery({
    queryKey: ['assignment', id],
    queryFn: () => assignmentService.getAssignmentById(id),
    enabled: !!id,
  });
};

export const useCreateAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignmentService.createAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
  });
};

export const useUpdateAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignmentService.updateAssignment,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['assignment', variables.id] });
    },
  });
};

export const useDeleteAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignmentService.deleteAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
  });
};

export const useAssignmentSubmissions = (id: number) => {
  return useQuery({
    queryKey: ['assignmentSubmissions', id],
    queryFn: () => assignmentService.getAssignmentSubmissions(id),
    enabled: !!id,
  });
};

export const useSubmitAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignmentService.submitAssignment,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['assignment', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['assignmentSubmissions', variables.id] });
    },
  });
};

export const useGradeAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignmentService.gradeAssignment,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['assignmentSubmissions', variables.id] });
    },
  });
};

