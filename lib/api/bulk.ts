import apiClient from './apiClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// 1. Service Functions

interface BulkStudentRequest {
  students: Array<{
    first_name: string;
    last_name: string;
    middle_name?: string;
    class_id?: number;
    arm_id?: number;
    date_of_birth: string;
    gender: 'male' | 'female' | 'other';
    phone?: string;
    address?: string;
    blood_group?: string;
    parent_name?: string;
    parent_phone?: string;
    parent_email?: string;
    emergency_contact?: string;
    medical_info?: {
      allergies?: string[];
      medications?: string[];
    };
    transport_info?: {
      route_id?: number;
      pickup_point?: string;
    };
  }>;
  guardians?: Array<{
    first_name: string;
    last_name: string;
    email?: string;
    phone: string;
    relationship?: string;
  }>;
}

interface BulkTeacherRequest {
  teachers: Array<{
    first_name: string;
    last_name: string;
    middle_name?: string;
    department_id?: number;
    qualification?: string;
    experience_years?: number;
    hire_date?: string;
    employment_date?: string;
    date_of_birth?: string;
    gender?: 'male' | 'female' | 'other';
    phone?: string;
    address?: string;
  }>;
  subjects?: Array<{ subject_id: number }>;
  classes?: Array<{ class_id: number }>;
}

interface BulkStaffRequest {
  staff: Array<{
    first_name: string;
    last_name: string;
    middle_name?: string;
    department_id: number;
    position: string;
    date_of_birth: string;
    gender: 'male' | 'female' | 'other';
    phone?: string;
    address?: string;
    qualification?: string;
    hire_date: string;
    employment_date?: string;
    salary?: number;
    employment_type?: 'full_time' | 'part_time' | 'contract' | 'intern';
  }>;
}

interface BulkGuardianRequest {
  guardians: Array<{
    first_name: string;
    last_name: string;
    middle_name?: string;
    email?: string;
    phone: string;
    address?: string;
    occupation?: string;
    employer?: string;
    students?: Array<{
      student_id: number;
      relationship: string;
      is_primary?: boolean;
      emergency_contact?: boolean;
    }>;
  }>;
}

interface BulkQuestionRequest {
  questions: Array<{
    subject_id: number;
    class_id: number;
    term_id: number;
    academic_year_id: number;
    question_type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'fill_in_blank' | 'matching' | 'ordering';
    question: string;
    options?: Array<{ key: string; value: string }>;
    correct_answer: string[];
    explanation?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    marks?: number;
    tags?: string[];
    topic?: string;
    hints?: string;
  }>;
}

interface BulkResponse<T> {
  success: boolean;
  message: string;
  summary?: {
    total: number;
    created: number;
    failed: number;
  };
  data: {
    created: T[];
    failed?: Array<{
      index: number;
      data: any;
      error: string;
    }>;
  };
}

export const bulkService = {
  bulkCreateStudents: async (data: BulkStudentRequest): Promise<BulkResponse<any>> => {
    const response = await apiClient.post('/bulk/students/register', data);
    return response.data;
  },

  bulkCreateTeachers: async (data: BulkTeacherRequest): Promise<BulkResponse<any>> => {
    const response = await apiClient.post('/bulk/teachers/register', data);
    return response.data;
  },

  bulkCreateStaff: async (data: BulkStaffRequest): Promise<BulkResponse<any>> => {
    const response = await apiClient.post('/bulk/staff/create', data);
    return response.data;
  },

  bulkCreateGuardians: async (data: BulkGuardianRequest): Promise<BulkResponse<any>> => {
    const response = await apiClient.post('/bulk/guardians/create', data);
    return response.data;
  },

  bulkCreateQuestions: async (data: BulkQuestionRequest): Promise<BulkResponse<any>> => {
    const response = await apiClient.post('/bulk/questions/create', data);
    return response.data;
  },
};

// 2. TanStack Query Hooks

export const useBulkCreateStudents = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkService.bulkCreateStudents,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

export const useBulkCreateTeachers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkService.bulkCreateTeachers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
  });
};

export const useBulkCreateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkService.bulkCreateStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
};

export const useBulkCreateGuardians = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkService.bulkCreateGuardians,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guardians'] });
    },
  });
};

export const useBulkCreateQuestions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkService.bulkCreateQuestions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-bank'] });
    },
  });
};

