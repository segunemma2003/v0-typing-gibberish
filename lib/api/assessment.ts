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

  // Parent/Guardian endpoints - Child assignments
  getChildAssignments: async (childId: number, params?: { status?: string; subject_id?: number; per_page?: number }): Promise<{
    student: {
      id: number;
      name: string;
      class: string;
    };
    assignments: Array<{
      id: number;
      title: string;
      description: string;
      subject: string;
      teacher: string;
      due_date: string;
      total_marks: number;
      status: string;
      submission?: {
        submitted_at: string;
        marks?: number;
        grade?: string;
        feedback?: string;
        on_time: boolean;
      };
      days_remaining?: number;
    }>;
    summary: {
      total: number;
      pending: number;
      submitted: number;
      graded: number;
      late: number;
      average_score?: number;
    };
  }> => {
    const response = await apiClient.get(`/assessments/assignments/student/${childId}`, { params });
    return response.data;
  },

  getChildAssignmentDetails: async (assignmentId: number, childId: number): Promise<any> => {
    const response = await apiClient.get(`/assessments/assignments/${assignmentId}/student/${childId}`);
    return response.data;
  },

  // Parent/Guardian endpoints - Child exams
  getChildExams: async (childId: number, params?: { status?: string; subject_id?: number; term_id?: number }): Promise<{
    student: {
      id: number;
      name: string;
      class: string;
    };
    exams: Array<{
      id: number;
      title: string;
      subject: string;
      exam_type?: string;
      date: string;
      start_time?: string;
      end_time?: string;
      total_marks: number;
      is_cbt?: boolean;
      status: string;
      result?: {
        marks: number;
        percentage: number;
        grade: string;
        position: number;
        total_students: number;
        class_average: number;
        teacher_remarks?: string;
      };
    }>;
  }> => {
    const response = await apiClient.get(`/assessments/exams/student/${childId}`, { params });
    return response.data;
  },

  getChildExamResult: async (examId: number, childId: number): Promise<any> => {
    const response = await apiClient.get(`/assessments/exams/${examId}/student/${childId}`);
    return response.data;
  },

  // Student-specific endpoints - My Assignments
  getMyAssignments: async (params?: { status?: string; subject_id?: number; per_page?: number }): Promise<{
    assignments: Array<{
      id: number;
      title: string;
      description: string;
      subject: {
        id: number;
        name: string;
      };
      teacher: {
        name: string;
      };
      due_date: string;
      total_marks: number;
      status: string;
      submission?: {
        submitted_at: string;
        marks?: number;
        grade?: string;
        feedback?: string;
      };
      attachments?: Array<{
        name: string;
        url: string;
      }>;
    }>;
    summary: {
      total: number;
      pending: number;
      submitted: number;
      graded: number;
      late: number;
    };
  }> => {
    const response = await apiClient.get('/assessments/assignments/my-assignments', { params });
    return response.data;
  },

  getAssignmentDetails: async (id: number): Promise<any> => {
    const response = await apiClient.get(`/assessments/assignments/${id}`);
    return response.data;
  },

  submitAssignment: async (id: number, data: {
    content: string;
    attachments?: Array<{ name: string; url: string }>;
  }): Promise<{ message: string; submission: any }> => {
    const response = await apiClient.post(`/assessments/assignments/${id}/submit`, data);
    return response.data;
  },

  // Student-specific endpoints - My Exams
  getMyExams: async (params?: { status?: string; subject_id?: number; per_page?: number }): Promise<{
    exams: Array<{
      id: number;
      title: string;
      exam_code?: string;
      subject: {
        id: number;
        name: string;
      };
      exam_type?: string;
      start_date: string;
      end_date?: string;
      duration_minutes?: number;
      total_marks: number;
      is_cbt?: boolean;
      status: string;
      my_result?: {
        marks: number;
        grade: string;
        position: number;
        total_students: number;
      };
    }>;
  }> => {
    const response = await apiClient.get('/assessments/exams/my-exams', { params });
    return response.data;
  },

  getMyExamResult: async (examId: number): Promise<any> => {
    const response = await apiClient.get(`/assessments/exams/${examId}/my-result`);
    return response.data;
  },

  // Student-specific endpoints - CBT
  startCBTExam: async (examId: number): Promise<{
    message: string;
    session: {
      id: string;
      exam: {
        id: number;
        title: string;
        duration_minutes: number;
        total_marks: number;
      };
      started_at: string;
      ends_at: string;
      time_remaining: number;
    };
  }> => {
    const response = await apiClient.post(`/assessments/cbt/${examId}/start`);
    return response.data;
  },

  getCBTQuestions: async (examId: number): Promise<{
    session_id: string;
    exam: {
      id: number;
      title: string;
      total_marks: number;
    };
    questions: Array<{
      id: number;
      question: string;
      question_type: string;
      options: Array<{ key: string; value: string }>;
      marks: number;
    }>;
    total_questions: number;
    time_remaining: number;
  }> => {
    const response = await apiClient.get(`/assessments/cbt/${examId}/questions`);
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
    result: {
      exam: {
        id: number;
        title: string;
      };
      total_questions: number;
      answered: number;
      unanswered: number;
      score: number;
      total_marks: number;
      percentage: number;
      grade: string;
      status: string;
      position: number;
      total_students: number;
    };
  }> => {
    const response = await apiClient.post('/assessments/cbt/submit', data);
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

// Parent/Guardian hooks - Child assignments and exams
export const useChildAssignments = (childId: number, params?: { status?: string; subject_id?: number; per_page?: number }) => {
  return useQuery({
    queryKey: ['childAssignments', childId, params],
    queryFn: () => assessmentService.getChildAssignments(childId, params),
    enabled: !!childId,
  });
};

export const useChildAssignmentDetails = (assignmentId: number, childId: number) => {
  return useQuery({
    queryKey: ['childAssignmentDetails', assignmentId, childId],
    queryFn: () => assessmentService.getChildAssignmentDetails(assignmentId, childId),
    enabled: !!assignmentId && !!childId,
  });
};

export const useChildExams = (childId: number, params?: { status?: string; subject_id?: number; term_id?: number }) => {
  return useQuery({
    queryKey: ['childExams', childId, params],
    queryFn: () => assessmentService.getChildExams(childId, params),
    enabled: !!childId,
  });
};

export const useChildExamResult = (examId: number, childId: number) => {
  return useQuery({
    queryKey: ['childExamResult', examId, childId],
    queryFn: () => assessmentService.getChildExamResult(examId, childId),
    enabled: !!examId && !!childId,
  });
};

// Student-specific hooks - My Assignments
export const useMyAssignments = (params?: { status?: string; subject_id?: number; per_page?: number }) => {
  return useQuery({
    queryKey: ['myAssignments', params],
    queryFn: () => assessmentService.getMyAssignments(params),
  });
};

export const useAssignmentDetails = (id: number) => {
  return useQuery({
    queryKey: ['assignmentDetails', id],
    queryFn: () => assessmentService.getAssignmentDetails(id),
    enabled: !!id,
  });
};

export const useSubmitAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { content: string; attachments?: Array<{ name: string; url: string }> } }) =>
      assessmentService.submitAssignment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myAssignments'] });
      queryClient.invalidateQueries({ queryKey: ['studentDashboard'] });
    },
  });
};

// Student-specific hooks - My Exams
export const useMyExams = (params?: { status?: string; subject_id?: number; per_page?: number }) => {
  return useQuery({
    queryKey: ['myExams', params],
    queryFn: () => assessmentService.getMyExams(params),
  });
};

export const useMyExamResult = (examId: number) => {
  return useQuery({
    queryKey: ['myExamResult', examId],
    queryFn: () => assessmentService.getMyExamResult(examId),
    enabled: !!examId,
  });
};

// Student-specific hooks - CBT
export const useStartCBTExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (examId: number) => assessmentService.startCBTExam(examId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myExams'] });
    },
  });
};

export const useCBTQuestions = (examId: number) => {
  return useQuery({
    queryKey: ['cbtQuestions', examId],
    queryFn: () => assessmentService.getCBTQuestions(examId),
    enabled: !!examId,
  });
};

export const useSubmitCBTAnswers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { session_id: string; exam_id: number; answers: Array<{ question_id: number; answer: string[] }> }) =>
      assessmentService.submitCBTAnswers(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myExams'] });
      queryClient.invalidateQueries({ queryKey: ['studentDashboard'] });
    },
  });
};
