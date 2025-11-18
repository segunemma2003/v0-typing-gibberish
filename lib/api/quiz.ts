import apiClient from './apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 1. Service Functions

interface Quiz {
  id: number;
  name: string;
  description?: string;
  duration_minutes: number;
  total_marks: number;
  start_date?: string;
  end_date?: string;
  status: 'draft' | 'active' | 'closed';
  created_at: string;
}

interface QuizQuestion {
  id: number;
  quiz_id: number;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  options?: string[];
  correct_answer: string;
  marks: number;
  order: number;
}

interface QuizAttempt {
  id: number;
  quiz_id: number;
  student_id: number;
  started_at: string;
  submitted_at?: string;
  score?: number;
  status: 'in-progress' | 'submitted' | 'graded';
}

interface QuizResult {
  id: number;
  quiz_id: number;
  student_id: number;
  score: number;
  total_marks: number;
  percentage: number;
  grade: string;
  submitted_at: string;
}

interface QuizListResponse {
  data: Quiz[];
}

interface QuestionListResponse {
  data: QuizQuestion[];
}

interface AttemptListResponse {
  data: QuizAttempt[];
}

interface ResultListResponse {
  data: QuizResult[];
}

interface GetQuizzesParams {
  page?: number;
  per_page?: number;
  status?: string;
  search?: string;
}

interface CreateQuizRequest {
  name: string;
  description?: string;
  duration_minutes: number;
  total_marks: number;
  start_date?: string;
  end_date?: string;
}

interface CreateQuestionRequest {
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  options?: string[];
  correct_answer: string;
  marks: number;
  order: number;
}

interface StartAttemptRequest {
  quiz_id: number;
  student_id: number;
}

interface SubmitQuizRequest {
  answers: {
    question_id: number;
    answer: string;
  }[];
}

export const quizService = {
  getQuizzes: async (params?: GetQuizzesParams): Promise<QuizListResponse> => {
    const response = await apiClient.get('/quizzes', { params });
    return response.data;
  },

  getQuizById: async (id: number): Promise<Quiz> => {
    const response = await apiClient.get(`/quizzes/${id}`);
    return response.data;
  },

  createQuiz: async (data: CreateQuizRequest): Promise<{ message: string; quiz: Quiz }> => {
    const response = await apiClient.post('/quizzes', data);
    return response.data;
  },

  updateQuiz: async ({ id, data }: { id: number; data: Partial<CreateQuizRequest> }): Promise<{ message: string; quiz: Quiz }> => {
    const response = await apiClient.put(`/quizzes/${id}`, data);
    return response.data;
  },

  deleteQuiz: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/quizzes/${id}`);
    return response.data;
  },

  getQuizQuestions: async (id: number): Promise<QuestionListResponse> => {
    const response = await apiClient.get(`/quizzes/${id}/questions`);
    return response.data;
  },

  addQuestion: async ({ id, data }: { id: number; data: CreateQuestionRequest }): Promise<{ message: string; question: QuizQuestion }> => {
    const response = await apiClient.post(`/quizzes/${id}/questions`, data);
    return response.data;
  },

  getQuizAttempts: async (id: number): Promise<AttemptListResponse> => {
    const response = await apiClient.get(`/quizzes/${id}/attempts`);
    return response.data;
  },

  startAttempt: async ({ id, data }: { id: number; data: StartAttemptRequest }): Promise<{ message: string; attempt: QuizAttempt }> => {
    const response = await apiClient.post(`/quizzes/${id}/attempt`, data);
    return response.data;
  },

  submitQuiz: async ({ id, data }: { id: number; data: SubmitQuizRequest }): Promise<{ message: string; result: QuizResult }> => {
    const response = await apiClient.post(`/quizzes/${id}/submit`, data);
    return response.data;
  },

  getQuizResults: async (id: number): Promise<ResultListResponse> => {
    const response = await apiClient.get(`/quizzes/${id}/results`);
    return response.data;
  },
};

// 2. TanStack Query Hooks

export const useQuizzes = (params?: GetQuizzesParams) => {
  return useQuery({
    queryKey: ['quizzes', params],
    queryFn: () => quizService.getQuizzes(params),
  });
};

export const useQuiz = (id: number) => {
  return useQuery({
    queryKey: ['quiz', id],
    queryFn: () => quizService.getQuizById(id),
    enabled: !!id,
  });
};

export const useCreateQuiz = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: quizService.createQuiz,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
    },
  });
};

export const useUpdateQuiz = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: quizService.updateQuiz,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      queryClient.invalidateQueries({ queryKey: ['quiz', variables.id] });
    },
  });
};

export const useDeleteQuiz = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: quizService.deleteQuiz,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
    },
  });
};

export const useQuizQuestions = (id: number) => {
  return useQuery({
    queryKey: ['quizQuestions', id],
    queryFn: () => quizService.getQuizQuestions(id),
    enabled: !!id,
  });
};

export const useAddQuizQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: quizService.addQuestion,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quizQuestions', variables.id] });
    },
  });
};

export const useQuizAttempts = (id: number) => {
  return useQuery({
    queryKey: ['quizAttempts', id],
    queryFn: () => quizService.getQuizAttempts(id),
    enabled: !!id,
  });
};

export const useStartQuizAttempt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: quizService.startAttempt,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quizAttempts', variables.id] });
    },
  });
};

export const useSubmitQuiz = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: quizService.submitQuiz,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quizAttempts', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['quizResults', variables.id] });
    },
  });
};

export const useQuizResults = (id: number) => {
  return useQuery({
    queryKey: ['quizResults', id],
    queryFn: () => quizService.getQuizResults(id),
    enabled: !!id,
  });
};

