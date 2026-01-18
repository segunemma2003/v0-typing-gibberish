import apiClient from './apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Types
export type ExamType = 'mid_term' | 'end_term' | 'ca1' | 'ca2' | 'mock' | 'final';
export type ExamStatus = 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'fill_in_blank';
export type CBTSessionStatus = 'in_progress' | 'completed' | 'expired' | 'abandoned';

export interface Exam {
  id: number;
  school_id: number;
  title: string;
  description?: string;
  subject_id: number;
  class_id: number;
  teacher_id?: number;
  term_id: number;
  academic_year_id: number;
  start_date: string;
  end_date: string;
  duration_minutes?: number;
  total_marks: number;
  passing_marks: number;
  exam_type: ExamType;
  is_cbt: boolean;
  status: ExamStatus;
  instructions?: string;
  venue?: string;
  created_at: string;
  updated_at: string;
  subject?: {
    id: number;
    name: string;
    code: string;
  };
  class?: {
    id: number;
    name: string;
  };
  teacher?: {
    id: number;
    name: string;
  };
  term?: {
    id: number;
    name: string;
  };
  questions_count?: number;
  students_count?: number;
  completed_count?: number;
}

export interface Question {
  id: number;
  exam_id: number;
  question_text: string;
  question_type: QuestionType;
  marks: number;
  options?: string[];
  correct_answer?: string;
  explanation?: string;
  order: number;
}

export interface ExamAttempt {
  id: number;
  exam_id: number;
  student_id: number;
  started_at?: string;
  submitted_at?: string;
  score?: number;
  total_marks?: number;
  percentage?: number;
  status: string;
  student?: {
    id: number;
    name: string;
    admission_number: string;
  };
}

export interface CBTSession {
  id: number;
  exam_id: number;
  student_id: number;
  started_at: string;
  expires_at: string;
  status: CBTSessionStatus;
  time_remaining_seconds?: number;
  questions_answered?: number;
  questions_total?: number;
}

export interface CBTResult {
  session_id: number;
  exam_id: number;
  student_id: number;
  score: number;
  total_marks: number;
  percentage: number;
  grade: string;
  correct_answers?: number;
  wrong_answers?: number;
  submitted_at: string;
  detailed_answers?: CBTAnswerDetail[];
  statistics?: {
    total_questions: number;
    correct_answers: number;
    wrong_answers: number;
    unanswered: number;
    time_taken_minutes: number;
  };
}

export interface CBTAnswerDetail {
  question_id: number;
  question_text: string;
  student_answer: string;
  correct_answer?: string;
  is_correct?: boolean;
  marks: number;
}

export interface ExamResult {
  id: number;
  student_id: number;
  exam_id: number;
  subject_id: number;
  score: number;
  total_marks: number;
  percentage: number;
  grade: string;
  remarks?: string;
  created_at: string;
  student?: {
    id: number;
    name: string;
    admission_number: string;
  };
  exam?: {
    id: number;
    title: string;
  };
}

export interface CreateExamRequest {
  title: string;
  description?: string;
  subject_id: number;
  class_id: number;
  teacher_id?: number;
  term_id: number;
  academic_year_id: number;
  start_date: string;
  end_date: string;
  duration_minutes?: number;
  total_marks: number;
  passing_marks: number;
  exam_type: ExamType;
  is_cbt?: boolean;
  status?: ExamStatus;
  instructions?: string;
  venue?: string;
}

export interface UpdateExamRequest {
  title?: string;
  description?: string;
  subject_id?: number;
  class_id?: number;
  teacher_id?: number;
  term_id?: number;
  academic_year_id?: number;
  start_date?: string;
  end_date?: string;
  duration_minutes?: number;
  total_marks?: number;
  passing_marks?: number;
  exam_type?: ExamType;
  is_cbt?: boolean;
  status?: ExamStatus;
  instructions?: string;
  venue?: string;
}

export interface CreateQuestionRequest {
  question_text: string;
  question_type: QuestionType;
  marks: number;
  options?: string[];
  correct_answer?: string;
  explanation?: string;
  order?: number;
}

export interface CreateQuestionsRequest {
  questions: CreateQuestionRequest[];
}

export interface CreateResultRequest {
  student_id: number;
  exam_id: number;
  subject_id: number;
  score: number;
  total_marks: number;
  grade?: string;
  remarks?: string;
}

export interface UpdateResultRequest {
  score?: number;
  total_marks?: number;
  grade?: string;
  remarks?: string;
}

export interface CBTSubmitAnswerRequest {
  session_id: number;
  question_id: number;
  answer: string;
}

export interface CBTSubmitExamRequest {
  exam_id: number;
  answers: {
    question_id: number;
    answer: string;
  }[];
}

export interface CBTStartRequest {
  exam_id: number;
}

export interface ExamListResponse {
  exams: {
    data: Exam[];
    current_page: number;
    per_page: number;
    total: number;
  };
}

export interface ExamResponse {
  exam: Exam;
}

export interface QuestionsResponse {
  questions: Question[];
}

export interface CBTQuestionsResponse {
  exam: Exam;
  questions: Question[];
}

export interface AttemptsResponse {
  attempts: ExamAttempt[];
}

export interface CBTSessionResponse {
  session: CBTSession;
}

export interface CBTResultsResponse {
  result: CBTResult;
}

export interface ResultsListResponse {
  results: {
    data: ExamResult[];
    current_page: number;
    per_page: number;
    total: number;
  };
}

export interface ResultResponse {
  result: ExamResult;
}

export interface GetExamsParams {
  subject_id?: number;
  class_id?: number;
  teacher_id?: number;
  term_id?: number;
  academic_year_id?: number;
  exam_type?: ExamType;
  status?: ExamStatus;
  search?: string;
  per_page?: number;
  page?: number;
}

export interface GetResultsParams {
  student_id?: number;
  exam_id?: number;
  class_id?: number;
  subject_id?: number;
  term_id?: number;
  academic_year_id?: number;
  per_page?: number;
  page?: number;
}

// Service Functions
export const examsService = {
  getExams: async (params?: GetExamsParams): Promise<ExamListResponse> => {
    const response = await apiClient.get('/assessments/exams', { params });
    return response.data;
  },

  getMyExams: async (params?: { status?: string; subject_id?: number }): Promise<{
    exams: Array<Exam & {
      status: 'upcoming' | 'ongoing' | 'completed';
      my_result?: {
        score: number;
        total_marks: number;
        percentage: number;
        grade: string;
      };
    }>;
  }> => {
    const response = await apiClient.get('/assessments/exams/my-exams', { params });
    return response.data;
  },

  getExam: async (id: number): Promise<ExamResponse> => {
    const response = await apiClient.get(`/assessments/exams/${id}`);
    return response.data;
  },

  createExam: async (data: CreateExamRequest): Promise<{ message: string; exam: Exam }> => {
    const response = await apiClient.post('/assessments/exams', data);
    return response.data;
  },

  updateExam: async ({ id, data }: { id: number; data: UpdateExamRequest }): Promise<{ message: string; exam: Exam }> => {
    const response = await apiClient.put(`/assessments/exams/${id}`, data);
    return response.data;
  },

  deleteExam: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/assessments/exams/${id}`);
    return response.data;
  },

  publishExam: async (id: number): Promise<{ message: string; exam: Exam }> => {
    const response = await apiClient.post(`/assessments/exams/${id}/publish`);
    return response.data;
  },

  getExamQuestions: async (examId: number): Promise<QuestionsResponse> => {
    const response = await apiClient.get(`/assessments/exams/${examId}/questions`);
    return response.data;
  },

  getExamAttempts: async (examId: number): Promise<AttemptsResponse> => {
    const response = await apiClient.get(`/assessments/exams/${examId}/attempts`);
    return response.data;
  },

  createQuestions: async (examId: number, data: CreateQuestionsRequest): Promise<{ message: string; questions: Question[] }> => {
    const response = await apiClient.post(`/assessments/cbt/${examId}/questions/create`, data);
    return response.data;
  },

  // CBT Services
  getCBTQuestions: async (examId: number): Promise<CBTQuestionsResponse> => {
    const response = await apiClient.get(`/assessments/cbt/${examId}/questions`);
    return response.data;
  },

  startCBTSession: async (data: CBTStartRequest): Promise<{ message: string; session: CBTSession }> => {
    const response = await apiClient.post('/cbt/start', data);
    return response.data;
  },

  submitCBTAnswer: async (data: CBTSubmitAnswerRequest): Promise<{ message: string; is_correct: boolean; marks_awarded: number }> => {
    const response = await apiClient.post('/cbt/submit-answer', data);
    return response.data;
  },

  submitCBTExam: async (data: CBTSubmitExamRequest): Promise<{ message: string; result: CBTResult }> => {
    const response = await apiClient.post('/assessments/cbt/submit', data);
    return response.data;
  },

  getCBTSessionStatus: async (sessionId: number): Promise<CBTSessionResponse> => {
    const response = await apiClient.get(`/assessments/cbt/session/${sessionId}/status`);
    return response.data;
  },

  getCBTResults: async (sessionId: number): Promise<CBTResultsResponse> => {
    const response = await apiClient.get(`/assessments/cbt/session/${sessionId}/results`);
    return response.data;
  },

  // Results Services
  getResults: async (params?: GetResultsParams): Promise<ResultsListResponse> => {
    const response = await apiClient.get('/assessments/results', { params });
    return response.data;
  },

  createResult: async (data: CreateResultRequest): Promise<{ message: string; result: ExamResult }> => {
    const response = await apiClient.post('/assessments/results', data);
    return response.data;
  },

  updateResult: async ({ id, data }: { id: number; data: UpdateResultRequest }): Promise<{ message: string; result: ExamResult }> => {
    const response = await apiClient.put(`/assessments/results/${id}`, data);
    return response.data;
  },

  deleteResult: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/assessments/results/${id}`);
    return response.data;
  },

  generateResults: async (classId: number, termId: number, academicYearId: number): Promise<{ message: string; total_generated: number; students_processed: number }> => {
    const response = await apiClient.post('/results/mid-term/generate', {
      class_id: classId,
      term_id: termId,
      academic_year_id: academicYearId,
    });
    return response.data;
  },

  publishResults: async (examId: number, classId?: number): Promise<{ message: string; total_published: number }> => {
    const response = await apiClient.post('/results/publish', {
      exam_id: examId,
      class_id: classId,
    });
    return response.data;
  },

  // Bulk Operations
  bulkCreateExams: async (exams: CreateExamRequest[]): Promise<{ message: string; total_created: number; exams: Exam[] }> => {
    const response = await apiClient.post('/bulk/exams/create', { exams });
    return response.data;
  },

  // School Admin - Examinations & CBT APIs
  listExams: async (): Promise<{
    data: Array<{
      id: number;
      title: string;
      subject_id: number;
      class_id: number;
      exam_date: string;
      duration: number;
      total_marks: number;
    }>;
  }> => {
    const response = await apiClient.get('/assessments/exams');
    return response.data;
  },

  createExam: async (data: {
    title: string;
    subject_id: number;
    class_id: number;
    term_id: number;
    academic_year_id: number;
    exam_date: string;
    duration: number;
    total_marks: number;
    passing_marks?: number;
    instructions?: string;
  }): Promise<{
    message: string;
    exam: any;
  }> => {
    const response = await apiClient.post('/assessments/exams', data);
    return response.data;
  },

  getExamDetails: async (id: number): Promise<{
    exam: any;
  }> => {
    const response = await apiClient.get(`/assessments/exams/${id}`);
    return response.data;
  },

  updateExam: async ({ id, data }: {
    id: number;
    data: Partial<{
      title: string;
      exam_date: string;
      duration: number;
      total_marks: number;
      passing_marks: number;
      instructions: string;
    }>;
  }): Promise<{
    message: string;
    exam: any;
  }> => {
    const response = await apiClient.put(`/assessments/exams/${id}`, data);
    return response.data;
  },

  deleteExam: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/assessments/exams/${id}`);
    return response.data;
  },

  // School Admin - Assignments
  listAssignments: async (): Promise<{
    data: Array<{
      id: number;
      title: string;
      subject_id: number;
      class_id: number;
      due_date: string;
      total_marks: number;
    }>;
  }> => {
    const response = await apiClient.get('/assessments/assignments');
    return response.data;
  },

  createAssignment: async (data: {
    title: string;
    description?: string;
    subject_id: number;
    class_id: number;
    due_date: string;
    total_marks: number;
  }): Promise<{
    message: string;
    assignment: any;
  }> => {
    const response = await apiClient.post('/assessments/assignments', data);
    return response.data;
  },

  getAssignmentDetails: async (id: number): Promise<{
    assignment: any;
  }> => {
    const response = await apiClient.get(`/assessments/assignments/${id}`);
    return response.data;
  },

  updateAssignment: async ({ id, data }: {
    id: number;
    data: Partial<{
      title: string;
      description: string;
      due_date: string;
      total_marks: number;
    }>;
  }): Promise<{
    message: string;
    assignment: any;
  }> => {
    const response = await apiClient.put(`/assessments/assignments/${id}`, data);
    return response.data;
  },

  deleteAssignment: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/assessments/assignments/${id}`);
    return response.data;
  },

  getAssignmentSubmissions: async (id: number): Promise<{
    assignment: any;
    submissions: Array<any>;
  }> => {
    const response = await apiClient.get(`/assessments/assignments/${id}/submissions`);
    return response.data;
  },

  submitAssignment: async ({ id, data }: {
    id: number;
    data: {
      student_id: number;
      content: string;
      attachments?: Array<{ name: string; url: string }>;
    };
  }): Promise<{
    message: string;
    submission: any;
  }> => {
    const response = await apiClient.post(`/assessments/assignments/${id}/submit`, data);
    return response.data;
  },

  gradeAssignment: async ({ id, data }: {
    id: number;
    data: {
      submission_id: number;
      marks: number;
      feedback?: string;
    };
  }): Promise<{
    message: string;
    submission: any;
  }> => {
    const response = await apiClient.put(`/assessments/assignments/${id}/grade`, data);
    return response.data;
  },

  // School Admin - Quizzes
  listQuizzes: async (): Promise<{
    data: Array<{
      id: number;
      title: string;
      subject_id: number;
      duration: number;
      total_marks: number;
    }>;
  }> => {
    const response = await apiClient.get('/quizzes');
    return response.data;
  },

  createQuiz: async (data: {
    title: string;
    description?: string;
    subject_id: number;
    class_id?: number;
    duration: number;
    total_marks: number;
  }): Promise<{
    message: string;
    quiz: any;
  }> => {
    const response = await apiClient.post('/quizzes', data);
    return response.data;
  },

  getQuizDetails: async (id: number): Promise<{
    quiz: any;
  }> => {
    const response = await apiClient.get(`/quizzes/${id}`);
    return response.data;
  },

  updateQuiz: async ({ id, data }: {
    id: number;
    data: Partial<{
      title: string;
      description: string;
      duration: number;
      total_marks: number;
    }>;
  }): Promise<{
    message: string;
    quiz: any;
  }> => {
    const response = await apiClient.put(`/quizzes/${id}`, data);
    return response.data;
  },

  deleteQuiz: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/quizzes/${id}`);
    return response.data;
  },

  getQuizQuestions: async (id: number): Promise<{
    quiz: any;
    questions: Array<any>;
  }> => {
    const response = await apiClient.get(`/quizzes/${id}/questions`);
    return response.data;
  },

  addQuestionToQuiz: async ({ id, data }: {
    id: number;
    data: {
      question: string;
      type: string;
      options?: Array<{ text: string; is_correct: boolean }>;
      marks: number;
    };
  }): Promise<{
    message: string;
    question: any;
  }> => {
    const response = await apiClient.post(`/quizzes/${id}/questions`, data);
    return response.data;
  },

  // School Admin - CBT Operations
  getCBTQuestions: async (examId: number): Promise<{
    exam: any;
    questions: Array<any>;
  }> => {
    const response = await apiClient.get(`/assessments/cbt/${examId}/questions`);
    return response.data;
  },

  createCBTQuestions: async ({ examId, data }: {
    examId: number;
    data: {
      questions: Array<{
        question: string;
        type: string;
        options?: Array<{ text: string; is_correct: boolean }>;
        marks: number;
      }>;
    };
  }): Promise<{
    message: string;
    questions: Array<any>;
  }> => {
    const response = await apiClient.post(`/assessments/cbt/${examId}/questions/create`, data);
    return response.data;
  },

  submitCBTAnswers: async (data: {
    session_id: string;
    exam_id: number;
    answers: Array<{
      question_id: number;
      answer: string[];
    }>;
  }): Promise<{
    message: string;
    result: any;
  }> => {
    const response = await apiClient.post('/assessments/cbt/submit', data);
    return response.data;
  },

  getCBTSessionStatus: async (sessionId: string): Promise<{
    session: any;
    status: string;
  }> => {
    const response = await apiClient.get(`/assessments/cbt/session/${sessionId}/status`);
    return response.data;
  },

  getCBTResults: async (sessionId: string): Promise<{
    session: any;
    results: any;
  }> => {
    const response = await apiClient.get(`/assessments/cbt/session/${sessionId}/results`);
    return response.data;
  },
};

// TanStack Query Hooks
export const useExams = (params?: GetExamsParams) => {
  return useQuery({
    queryKey: ['exams', params],
    queryFn: () => examsService.getExams(params),
  });
};

export const useMyExams = (params?: { status?: string; subject_id?: number }) => {
  return useQuery({
    queryKey: ['myExams', params],
    queryFn: () => examsService.getMyExams(params),
  });
};

export const useExam = (id: number) => {
  return useQuery({
    queryKey: ['exam', id],
    queryFn: () => examsService.getExam(id),
    enabled: !!id,
  });
};

export const useCreateExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: examsService.createExam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
    },
  });
};

export const useUpdateExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: examsService.updateExam,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      queryClient.invalidateQueries({ queryKey: ['exam', variables.id] });
    },
  });
};

export const useDeleteExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: examsService.deleteExam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
    },
  });
};

export const usePublishExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: examsService.publishExam,
    onSuccess: (data, examId) => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      queryClient.invalidateQueries({ queryKey: ['exam', examId] });
    },
  });
};

export const useExamQuestions = (examId: number) => {
  return useQuery({
    queryKey: ['examQuestions', examId],
    queryFn: () => examsService.getExamQuestions(examId),
    enabled: !!examId,
  });
};

export const useExamAttempts = (examId: number) => {
  return useQuery({
    queryKey: ['examAttempts', examId],
    queryFn: () => examsService.getExamAttempts(examId),
    enabled: !!examId,
  });
};

export const useCreateQuestions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ examId, data }: { examId: number; data: CreateQuestionsRequest }) =>
      examsService.createQuestions(examId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['examQuestions', variables.examId] });
      queryClient.invalidateQueries({ queryKey: ['exam', variables.examId] });
    },
  });
};

// Results Hooks
export const useResults = (params?: GetResultsParams) => {
  return useQuery({
    queryKey: ['results', params],
    queryFn: () => examsService.getResults(params),
  });
};

export const useCreateResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: examsService.createResult,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['results'] });
    },
  });
};

export const useUpdateResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: examsService.updateResult,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['results'] });
    },
  });
};

export const useDeleteResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: examsService.deleteResult,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['results'] });
    },
  });
};

export const useGenerateResults = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ classId, termId, academicYearId }: { classId: number; termId: number; academicYearId: number }) =>
      examsService.generateResults(classId, termId, academicYearId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['results'] });
    },
  });
};

export const usePublishResults = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ examId, classId }: { examId: number; classId?: number }) =>
      examsService.publishResults(examId, classId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['results'] });
    },
  });
};

