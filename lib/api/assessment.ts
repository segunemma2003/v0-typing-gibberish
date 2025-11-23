import apiClient from './apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 1. Service Functions

interface ExamSubject {
  id: number;
  name: string;
}

interface ExamClass {
  id: number;
  name: string;
}

interface Exam {
  id: number;
  title: string;
  type: string;
  subject: ExamSubject;
  class: ExamClass;
  start_date: string;
  end_date: string;
  duration: number;
  total_marks: number;
  status: string;
}

interface ExamListResponse {
  data: Exam[];
}

interface CreateExamRequest {
  title: string;
  type: string;
  subject_id: number;
  class_id: number;
  start_date: string;
  end_date: string;
  duration: number;
  total_marks: number;
}

interface CBTSessionExam {
  id: number;
  title: string;
}

interface CBTSessionStudent {
  id: number;
  name: string;
  admission_number: string;
}

interface CBTSession {
  id: number;
  session_id: string;
  exam: CBTSessionExam;
  student: CBTSessionStudent;
  start_time: string;
  end_time: string;
  status: string;
  score: number;
  total_questions: number;
  answered_questions: number;
}

interface CBTSessionListResponse {
  data: CBTSession[];
}

interface CBTQuestionOption {
  id: number;
  text: string;
}

interface CBTQuestion {
  id: number;
  question: string;
  type: string;
  options: CBTQuestionOption[];
  marks: number;
}

interface StartCBTSessionResponse {
  message: string;
  session: Omit<CBTSession, 'score' | 'total_questions' | 'answered_questions' | 'end_time' | 'status'> & {
    questions: CBTQuestion[];
    duration: number;
  };
}

interface StartCBTSessionRequest {
  exam_id: number;
  student_id: number;
}

interface SubmitCBTAnswer {
  question_id: number;
  answer: string;
  time_spent: number;
}

interface SubmitCBTAnswersRequest {
  answers: SubmitCBTAnswer[];
}

interface SubmitCBTAnswersResponse {
  message: string;
  result: {
    session_id: string;
    score: number;
    total_marks: number;
    correct_answers: number;
    wrong_answers: number;
    completion_time: string;
    grade: string;
  };
}

export const assessmentService = {
  // Assignments Management (using /assessments/assignments endpoint)
  getAssignments: async (params?: { class_id?: number; subject_id?: number; teacher_id?: number; status?: string; search?: string; per_page?: number }): Promise<any> => {
    const response = await apiClient.get('/assessments/assignments', { params });
    return response.data;
  },

  // Exams Management (using /assessments/exams endpoint)
  getExams: async (params?: { class_id?: number; subject_id?: number; type?: string; status?: string; search?: string; per_page?: number }): Promise<ExamListResponse> => {
    const response = await apiClient.get('/assessments/exams', { params });
    return response.data;
  },

  // Results Management (using /assessments/results endpoint)
  getResults: async (params?: { student_id?: number; exam_id?: number; subject_id?: number; status?: string; per_page?: number }): Promise<any> => {
    const response = await apiClient.get('/assessments/results', { params });
    return response.data;
  },

  // Legacy endpoints (also supported)
  getExamsLegacy: async (): Promise<ExamListResponse> => {
    const response = await apiClient.get('/exams');
    return response.data;
  },

  createExam: async (data: CreateExamRequest): Promise<{ message: string; exam: Exam }> => {
    const response = await apiClient.post('/exams', data);
    return response.data;
  },

  // CBT Management
  getCBTSessions: async (): Promise<CBTSessionListResponse> => {
    const response = await apiClient.get('/cbt/sessions');
    return response.data;
  },

  startCBTSession: async (data: StartCBTSessionRequest): Promise<StartCBTSessionResponse> => {
    const response = await apiClient.post('/cbt/sessions', data);
    return response.data;
  },

  submitCBTAnswers: async ({ session_id, data }: { session_id: string; data: SubmitCBTAnswersRequest }): Promise<SubmitCBTAnswersResponse> => {
    const response = await apiClient.post(`/cbt/sessions/${session_id}/submit`, data);
    return response.data;
  },
};

// 2. TanStack Query Hooks

// Assignments (using /assessments/assignments)
export const useAssignmentsAssessment = (params?: { class_id?: number; subject_id?: number; teacher_id?: number; status?: string; search?: string; per_page?: number }) => {
  return useQuery({
    queryKey: ['assessments', 'assignments', params],
    queryFn: () => assessmentService.getAssignments(params),
  });
};

// Exams (using /assessments/exams)
export const useExams = (params?: { class_id?: number; subject_id?: number; type?: string; status?: string; search?: string; per_page?: number }) => {
  return useQuery({
    queryKey: ['assessments', 'exams', params],
    queryFn: () => assessmentService.getExams(params),
  });
};

// Results (using /assessments/results)
export const useResults = (params?: { student_id?: number; exam_id?: number; subject_id?: number; status?: string; per_page?: number }) => {
  return useQuery({
    queryKey: ['assessments', 'results', params],
    queryFn: () => assessmentService.getResults(params),
  });
};

// Legacy Exams (backward compatibility)
export const useExamsLegacy = () => {
  return useQuery({
    queryKey: ['exams'],
    queryFn: assessmentService.getExamsLegacy,
  });
};

export const useCreateExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assessmentService.createExam,
    onSuccess: (data) => {
      console.log('Exam created successfully', data);
      queryClient.invalidateQueries({ queryKey: ['exams'] });
    },
  });
};

// CBT
export const useCBTSessions = () => {
  return useQuery({
    queryKey: ['cbtSessions'],
    queryFn: assessmentService.getCBTSessions,
  });
};

export const useStartCBTSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assessmentService.startCBTSession,
    onSuccess: (data) => {
      console.log('CBT session started', data);
      queryClient.invalidateQueries({ queryKey: ['cbtSessions'] });
    },
  });
};

export const useSubmitCBTAnswers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assessmentService.submitCBTAnswers,
    onSuccess: (data, variables) => {
      console.log('CBT answers submitted successfully', data);
      queryClient.invalidateQueries({ queryKey: ['cbtSessions'] });
      queryClient.invalidateQueries({ queryKey: ['cbtSession', variables.session_id] });
    },
  });
};
