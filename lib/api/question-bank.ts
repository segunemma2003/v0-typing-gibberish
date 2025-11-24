import apiClient from './apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 1. Service Functions

interface Question {
  id: number;
  school_id: number;
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
  status?: 'active' | 'inactive' | 'archived';
  usage_count?: number;
  last_used_at?: string;
  created_at: string;
  updated_at?: string;
  subject?: { id: number; name: string; code?: string };
  class?: { id: number; name: string };
  term?: { id: number; name: string };
  academicYear?: { id: number; name: string };
  creator?: { id: number; name: string; email: string };
}

interface QuestionListResponse {
  current_page: number;
  data: Question[];
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
}

interface GetQuestionsParams {
  subject_id?: number;
  class_id?: number;
  term_id?: number;
  academic_year_id?: number;
  question_type?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  topic?: string;
  search?: string;
  tags?: string | string[];
  status?: 'active' | 'inactive' | 'archived';
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

interface CreateQuestionRequest {
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
}

interface UpdateQuestionRequest extends Partial<CreateQuestionRequest> {}

interface GetQuestionsForExamParams {
  subject_id: number;
  class_id: number;
  term_id: number;
  academic_year_id: number;
  question_types?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  topics?: string[];
  count?: number;
}

interface QuestionsForExamResponse {
  total_available: number;
  returned: number;
  questions: Question[];
}

interface QuestionStatistics {
  total_questions: number;
  active_questions: number;
  by_type: Array<{ question_type: string; count: number }>;
  by_difficulty: Array<{ difficulty: string; count: number }>;
  by_subject: Array<{ subject_id: number; subject: { id: number; name: string }; count: number }>;
  most_used: Array<{ id: number; question: string; usage_count: number; last_used_at: string }>;
}

export const questionBankService = {
  getQuestions: async (params?: GetQuestionsParams): Promise<QuestionListResponse | Question[]> => {
    const response = await apiClient.get('/question-bank', { params });
    // API may return direct array or paginated response
    return response.data;
  },

  getQuestionById: async (id: number): Promise<Question> => {
    const response = await apiClient.get(`/question-bank/${id}`);
    return response.data;
  },

  createQuestion: async (data: CreateQuestionRequest): Promise<{ message: string; question: Question }> => {
    const response = await apiClient.post('/question-bank', data);
    return response.data;
  },

  updateQuestion: async ({ id, data }: { id: number; data: UpdateQuestionRequest }): Promise<{ message: string; question: Question }> => {
    const response = await apiClient.put(`/question-bank/${id}`, data);
    return response.data;
  },

  deleteQuestion: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/question-bank/${id}`);
    return response.data;
  },

  duplicateQuestion: async (id: number): Promise<{ message: string; question: Question }> => {
    const response = await apiClient.post(`/question-bank/${id}/duplicate`);
    return response.data;
  },

  getQuestionsForExam: async (params: GetQuestionsForExamParams): Promise<QuestionsForExamResponse> => {
    const response = await apiClient.get('/question-bank/for-exam', { params });
    return response.data;
  },

  getStatistics: async (): Promise<QuestionStatistics> => {
    const response = await apiClient.get('/question-bank/statistics');
    return response.data;
  },
};

// 2. TanStack Query Hooks

export const useQuestionBank = (params?: GetQuestionsParams) => {
  return useQuery({
    queryKey: ['question-bank', params],
    queryFn: () => questionBankService.getQuestions(params),
  });
};

export const useQuestion = (id: number) => {
  return useQuery({
    queryKey: ['question-bank', id],
    queryFn: () => questionBankService.getQuestionById(id),
    enabled: !!id,
  });
};

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: questionBankService.createQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-bank'] });
    },
  });
};

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: questionBankService.updateQuestion,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['question-bank'] });
      queryClient.invalidateQueries({ queryKey: ['question-bank', variables.id] });
    },
  });
};

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: questionBankService.deleteQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-bank'] });
    },
  });
};

export const useDuplicateQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: questionBankService.duplicateQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-bank'] });
    },
  });
};

export const useQuestionsForExam = (params: GetQuestionsForExamParams) => {
  return useQuery({
    queryKey: ['question-bank', 'for-exam', params],
    queryFn: () => questionBankService.getQuestionsForExam(params),
    enabled: !!(params.subject_id && params.class_id && params.term_id && params.academic_year_id),
  });
};

export const useQuestionBankStatistics = () => {
  return useQuery({
    queryKey: ['question-bank', 'statistics'],
    queryFn: questionBankService.getStatistics,
  });
};

