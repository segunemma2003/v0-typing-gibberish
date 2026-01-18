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

  // School Admin - Grading Systems
  getGradingSystems: async (): Promise<{
    grading_systems: Array<{
      id: number;
      name: string;
      grade_boundaries: Array<{
        min: number;
        max: number;
        grade: string;
        remark: string;
      }>;
      pass_mark: number;
      is_default: boolean;
    }>;
  }> => {
    const response = await apiClient.get('/assessments/grading-systems');
    return response.data;
  },

  getDefaultGradingSystem: async (): Promise<{
    grading_system: {
      id: number;
      name: string;
      grade_boundaries: Array<{
        min: number;
        max: number;
        grade: string;
        remark: string;
      }>;
      pass_mark: number;
      is_default: boolean;
    };
  }> => {
    const response = await apiClient.get('/assessments/grading-systems/default');
    return response.data;
  },

  createGradingSystem: async (data: {
    name: string;
    description?: string;
    grade_boundaries: Array<{
      min: number;
      max: number;
      grade: string;
      remark: string;
    }>;
    pass_mark: number;
    is_default?: boolean;
  }): Promise<{
    message: string;
    grading_system: {
      id: number;
      name: string;
    };
  }> => {
    const response = await apiClient.post('/assessments/grading-systems', data);
    return response.data;
  },

  updateGradingSystem: async ({ id, data }: {
    id: number;
    data: {
      name?: string;
      description?: string;
      grade_boundaries?: Array<{
        min: number;
        max: number;
        grade: string;
        remark: string;
      }>;
      pass_mark?: number;
      is_default?: boolean;
    };
  }): Promise<{
    message: string;
    grading_system: any;
  }> => {
    const response = await apiClient.put(`/assessments/grading-systems/${id}`, data);
    return response.data;
  },

  deleteGradingSystem: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/assessments/grading-systems/${id}`);
    return response.data;
  },

  calculateGrade: async (data: {
    score: number;
    grading_system_id: number;
  }): Promise<{
    grade: string;
    remark: string;
  }> => {
    const response = await apiClient.post('/assessments/grading-systems/calculate-grade', data);
    return response.data;
  },

  // School Admin - Continuous Assessments
  getContinuousAssessments: async (params?: {
    class_id?: number;
    term_id?: number;
    academic_year_id?: number;
  }): Promise<{
    assessments: Array<{
      id: number;
      name: string;
      type: string;
      class_id: number;
      subject_id: number;
      total_marks: number;
      assessment_date: string;
    }>;
  }> => {
    const response = await apiClient.get('/assessments/continuous-assessments', { params });
    return response.data;
  },

  createContinuousAssessment: async (data: {
    name: string;
    type: string;
    class_id: number;
    subject_id: number;
    term_id: number;
    academic_year_id: number;
    total_marks: number;
    assessment_date: string;
  }): Promise<{
    message: string;
    assessment: any;
  }> => {
    const response = await apiClient.post('/assessments/continuous-assessments', data);
    return response.data;
  },

  updateContinuousAssessment: async ({ id, data }: {
    id: number;
    data: Partial<{
      name: string;
      type: string;
      class_id: number;
      subject_id: number;
      term_id: number;
      academic_year_id: number;
      total_marks: number;
      assessment_date: string;
    }>;
  }): Promise<{
    message: string;
    assessment: any;
  }> => {
    const response = await apiClient.put(`/assessments/continuous-assessments/${id}`, data);
    return response.data;
  },

  deleteContinuousAssessment: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/assessments/continuous-assessments/${id}`);
    return response.data;
  },

  recordCAScores: async ({ id, data }: {
    id: number;
    data: {
      scores: Array<{
        student_id: number;
        score: number;
      }>;
    };
  }): Promise<{
    message: string;
  }> => {
    const response = await apiClient.post(`/assessments/continuous-assessments/${id}/record-scores`, data);
    return response.data;
  },

  getCAScores: async (id: number): Promise<{
    assessment: any;
    scores: Array<{
      student_id: number;
      student_name: string;
      score: number;
    }>;
  }> => {
    const response = await apiClient.get(`/assessments/continuous-assessments/${id}/scores`);
    return response.data;
  },

  getStudentCAScores: async (studentId: number): Promise<{
    student: any;
    scores: Array<{
      assessment_id: number;
      assessment_name: string;
      score: number;
    }>;
  }> => {
    const response = await apiClient.get(`/assessments/continuous-assessments/student/${studentId}/scores`);
    return response.data;
  },

  // School Admin - Psychomotor Assessments
  getPsychomotorAssessmentsByClass: async (classId: number, params?: {
    term_id?: number;
    academic_year_id?: number;
  }): Promise<{
    assessments: Array<any>;
  }> => {
    const response = await apiClient.get(`/assessments/psychomotor-assessments/class/${classId}`, { params });
    return response.data;
  },

  getPsychomotorAssessment: async (studentId: number, termId: number, academicYearId: number): Promise<{
    student: any;
    term: any;
    academic_year: any;
    ratings: Record<string, number>;
  }> => {
    const response = await apiClient.get(`/assessments/psychomotor-assessments/${studentId}/${termId}/${academicYearId}`);
    return response.data;
  },

  createPsychomotorAssessment: async (data: {
    student_id: number;
    term_id: number;
    academic_year_id: number;
    ratings: Record<string, number>;
  }): Promise<{
    message: string;
    assessment: any;
  }> => {
    const response = await apiClient.post('/assessments/psychomotor-assessments', data);
    return response.data;
  },

  bulkCreatePsychomotorAssessments: async (data: {
    class_id: number;
    term_id: number;
    academic_year_id: number;
    assessments: Array<{
      student_id: number;
      ratings: Record<string, number>;
    }>;
  }): Promise<{
    message: string;
    created: number;
  }> => {
    const response = await apiClient.post('/assessments/psychomotor-assessments/bulk', data);
    return response.data;
  },

  deletePsychomotorAssessment: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/assessments/psychomotor-assessments/${id}`);
    return response.data;
  },

  // School Admin - Results Management
  generateResults: async (data: {
    class_id: number;
    term_id: number;
    academic_year_id: number;
  }): Promise<{
    message: string;
    results_generated: number;
  }> => {
    const response = await apiClient.post('/assessments/results/generate', data);
    return response.data;
  },

  getStudentResult: async (studentId: number, termId: number, academicYearId: number): Promise<{
    student: any;
    term: any;
    academic_year: any;
    results: Array<any>;
    summary: {
      total_subjects: number;
      average_score: number;
      overall_grade: string;
      class_position: number;
    };
  }> => {
    const response = await apiClient.get(`/assessments/results/student/${studentId}/${termId}/${academicYearId}`);
    return response.data;
  },

  getClassResults: async (classId: number, params?: {
    term_id?: number;
    academic_year_id?: number;
  }): Promise<{
    class: {
      id: number;
      name: string;
    };
    results: Array<any>;
  }> => {
    const response = await apiClient.get(`/assessments/results/class/${classId}`, { params });
    return response.data;
  },

  addCommentsToResult: async ({ resultId, data }: {
    resultId: number;
    data: {
      principal_comment?: string;
      teacher_comment?: string;
    };
  }): Promise<{
    message: string;
    result: any;
  }> => {
    const response = await apiClient.post(`/assessments/results/${resultId}/comments`, data);
    return response.data;
  },

  approveResult: async (resultId: number): Promise<{
    message: string;
    result: any;
  }> => {
    const response = await apiClient.post(`/assessments/results/${resultId}/approve`);
    return response.data;
  },

  publishResults: async (data: {
    class_id?: number;
    term_id: number;
    academic_year_id: number;
  }): Promise<{
    message: string;
    published_count: number;
  }> => {
    const response = await apiClient.post('/assessments/results/publish', data);
    return response.data;
  },

  // School Admin - Scoreboards
  getScoreboardForClass: async (classId: number, params?: {
    term_id?: number;
    academic_year_id?: number;
    limit?: number;
  }): Promise<{
    scoreboard: Array<{
      student_id: number;
      student_name: string;
      total_score: number;
      average: number;
      position: number;
      grade: string;
    }>;
  }> => {
    const response = await apiClient.get(`/assessments/scoreboards/class/${classId}`, { params });
    return response.data;
  },

  getTopPerformers: async (params?: {
    term_id?: number;
    academic_year_id?: number;
    limit?: number;
  }): Promise<{
    top_performers: Array<{
      student_id: number;
      student_name: string;
      class: string;
      total_score: number;
      average: number;
      position: number;
    }>;
  }> => {
    const response = await apiClient.get('/assessments/scoreboards/top-performers', { params });
    return response.data;
  },

  getSubjectToppers: async (subjectId: number): Promise<{
    subject: any;
    toppers: Array<{
      student_id: number;
      student_name: string;
      score: number;
      position: number;
    }>;
  }> => {
    const response = await apiClient.get(`/assessments/scoreboards/subject/${subjectId}/toppers`);
    return response.data;
  },

  refreshScoreboard: async (): Promise<{
    message: string;
  }> => {
    const response = await apiClient.post('/assessments/scoreboards/refresh');
    return response.data;
  },

  getClassComparison: async (params?: {
    term_id?: number;
    academic_year_id?: number;
  }): Promise<{
    comparison: Array<{
      class_id: number;
      class_name: string;
      average_score: number;
      pass_rate: number;
      total_students: number;
    }>;
  }> => {
    const response = await apiClient.get('/assessments/scoreboards/class-comparison', { params });
    return response.data;
  },

  // School Admin - Report Cards
  getReportCard: async (studentId: number, termId: number, academicYearId: number): Promise<{
    student: any;
    term: any;
    academic_year: any;
    report_card: any;
  }> => {
    const response = await apiClient.get(`/assessments/report-cards/${studentId}/${termId}/${academicYearId}`);
    return response.data;
  },

  generatePDFReportCard: async (studentId: number, termId: number, academicYearId: number): Promise<Blob> => {
    const response = await apiClient.get(`/assessments/report-cards/${studentId}/${termId}/${academicYearId}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },

  getPrintableReportCard: async (studentId: number, termId: number, academicYearId: number): Promise<{
    student: any;
    term: any;
    academic_year: any;
    report_card: any;
  }> => {
    const response = await apiClient.get(`/assessments/report-cards/${studentId}/${termId}/${academicYearId}/print`);
    return response.data;
  },

  bulkDownloadReportCards: async (data: {
    class_id: number;
    term_id: number;
    academic_year_id: number;
  }): Promise<Blob> => {
    const response = await apiClient.post('/assessments/report-cards/bulk-download', data, {
      responseType: 'blob',
    });
    return response.data;
  },

  emailReportCard: async (studentId: number, termId: number, academicYearId: number): Promise<{
    message: string;
  }> => {
    const response = await apiClient.post(`/assessments/report-cards/${studentId}/${termId}/${academicYearId}/email`);
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

// School Admin - Grading Systems Hooks
export const useGradingSystems = () => {
  return useQuery({
    queryKey: ['gradingSystems'],
    queryFn: () => assessmentService.getGradingSystems(),
  });
};

export const useDefaultGradingSystem = () => {
  return useQuery({
    queryKey: ['defaultGradingSystem'],
    queryFn: () => assessmentService.getDefaultGradingSystem(),
  });
};

export const useCreateGradingSystem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assessmentService.createGradingSystem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gradingSystems'] });
      queryClient.invalidateQueries({ queryKey: ['defaultGradingSystem'] });
    },
  });
};

export const useUpdateGradingSystem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assessmentService.updateGradingSystem,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['gradingSystems'] });
      queryClient.invalidateQueries({ queryKey: ['defaultGradingSystem'] });
    },
  });
};

export const useDeleteGradingSystem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assessmentService.deleteGradingSystem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gradingSystems'] });
    },
  });
};

export const useCalculateGrade = () => {
  return useMutation({
    mutationFn: assessmentService.calculateGrade,
  });
};

// School Admin - Continuous Assessments Hooks
export const useContinuousAssessments = (params?: { class_id?: number; term_id?: number; academic_year_id?: number }) => {
  return useQuery({
    queryKey: ['continuousAssessments', params],
    queryFn: () => assessmentService.getContinuousAssessments(params),
  });
};

export const useCreateContinuousAssessment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assessmentService.createContinuousAssessment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['continuousAssessments'] });
    },
  });
};

export const useUpdateContinuousAssessment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assessmentService.updateContinuousAssessment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['continuousAssessments'] });
    },
  });
};

export const useDeleteContinuousAssessment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assessmentService.deleteContinuousAssessment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['continuousAssessments'] });
    },
  });
};

export const useRecordCAScores = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assessmentService.recordCAScores,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['continuousAssessments'] });
    },
  });
};

export const useCAScores = (id: number) => {
  return useQuery({
    queryKey: ['caScores', id],
    queryFn: () => assessmentService.getCAScores(id),
    enabled: !!id,
  });
};

export const useStudentCAScores = (studentId: number) => {
  return useQuery({
    queryKey: ['studentCAScores', studentId],
    queryFn: () => assessmentService.getStudentCAScores(studentId),
    enabled: !!studentId,
  });
};

// School Admin - Psychomotor Assessments Hooks
export const usePsychomotorAssessmentsByClass = (classId: number, params?: { term_id?: number; academic_year_id?: number }) => {
  return useQuery({
    queryKey: ['psychomotorAssessments', classId, params],
    queryFn: () => assessmentService.getPsychomotorAssessmentsByClass(classId, params),
    enabled: !!classId,
  });
};

export const usePsychomotorAssessment = (studentId: number, termId: number, academicYearId: number) => {
  return useQuery({
    queryKey: ['psychomotorAssessment', studentId, termId, academicYearId],
    queryFn: () => assessmentService.getPsychomotorAssessment(studentId, termId, academicYearId),
    enabled: !!studentId && !!termId && !!academicYearId,
  });
};

export const useCreatePsychomotorAssessment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assessmentService.createPsychomotorAssessment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['psychomotorAssessments'] });
    },
  });
};

export const useBulkCreatePsychomotorAssessments = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assessmentService.bulkCreatePsychomotorAssessments,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['psychomotorAssessments'] });
    },
  });
};

export const useDeletePsychomotorAssessment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assessmentService.deletePsychomotorAssessment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['psychomotorAssessments'] });
    },
  });
};

// School Admin - Results Management Hooks
export const useGenerateResults = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assessmentService.generateResults,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['results'] });
    },
  });
};

export const useStudentResult = (studentId: number, termId: number, academicYearId: number) => {
  return useQuery({
    queryKey: ['studentResult', studentId, termId, academicYearId],
    queryFn: () => assessmentService.getStudentResult(studentId, termId, academicYearId),
    enabled: !!studentId && !!termId && !!academicYearId,
  });
};

export const useClassResults = (classId: number, params?: { term_id?: number; academic_year_id?: number }) => {
  return useQuery({
    queryKey: ['classResults', classId, params],
    queryFn: () => assessmentService.getClassResults(classId, params),
    enabled: !!classId,
  });
};

export const useAddCommentsToResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assessmentService.addCommentsToResult,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['results'] });
    },
  });
};

export const useApproveResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assessmentService.approveResult,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['results'] });
    },
  });
};

export const usePublishResults = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assessmentService.publishResults,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['results'] });
    },
  });
};

// School Admin - Scoreboards Hooks
export const useScoreboardForClass = (classId: number, params?: { term_id?: number; academic_year_id?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['scoreboard', classId, params],
    queryFn: () => assessmentService.getScoreboardForClass(classId, params),
    enabled: !!classId,
  });
};

export const useTopPerformers = (params?: { term_id?: number; academic_year_id?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['topPerformers', params],
    queryFn: () => assessmentService.getTopPerformers(params),
  });
};

export const useSubjectToppers = (subjectId: number) => {
  return useQuery({
    queryKey: ['subjectToppers', subjectId],
    queryFn: () => assessmentService.getSubjectToppers(subjectId),
    enabled: !!subjectId,
  });
};

export const useRefreshScoreboard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assessmentService.refreshScoreboard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scoreboard'] });
      queryClient.invalidateQueries({ queryKey: ['topPerformers'] });
    },
  });
};

export const useClassComparison = (params?: { term_id?: number; academic_year_id?: number }) => {
  return useQuery({
    queryKey: ['classComparison', params],
    queryFn: () => assessmentService.getClassComparison(params),
  });
};

// School Admin - Report Cards Hooks
export const useReportCard = (studentId: number, termId: number, academicYearId: number) => {
  return useQuery({
    queryKey: ['reportCard', studentId, termId, academicYearId],
    queryFn: () => assessmentService.getReportCard(studentId, termId, academicYearId),
    enabled: !!studentId && !!termId && !!academicYearId,
  });
};

export const useGeneratePDFReportCard = () => {
  return useMutation({
    mutationFn: ({ studentId, termId, academicYearId }: { studentId: number; termId: number; academicYearId: number }) =>
      assessmentService.generatePDFReportCard(studentId, termId, academicYearId),
  });
};

export const usePrintableReportCard = (studentId: number, termId: number, academicYearId: number) => {
  return useQuery({
    queryKey: ['printableReportCard', studentId, termId, academicYearId],
    queryFn: () => assessmentService.getPrintableReportCard(studentId, termId, academicYearId),
    enabled: !!studentId && !!termId && !!academicYearId,
  });
};

export const useBulkDownloadReportCards = () => {
  return useMutation({
    mutationFn: assessmentService.bulkDownloadReportCards,
  });
};

export const useEmailReportCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ studentId, termId, academicYearId }: { studentId: number; termId: number; academicYearId: number }) =>
      assessmentService.emailReportCard(studentId, termId, academicYearId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reportCard'] });
    },
  });
};
