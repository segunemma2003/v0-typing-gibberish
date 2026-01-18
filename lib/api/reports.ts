import apiClient from './apiClient';
import { useQuery } from '@tanstack/react-query';

// 1. Service Functions

interface AttendanceReport {
  date: string;
  total_students: number;
  present: number;
  absent: number;
  late: number;
  attendance_percentage: number;
}

interface AcademicReport {
  class_id: number;
  class_name: string;
  total_students: number;
  average_score: number;
  pass_rate: number;
  top_students: Array<{
    id: number;
    name: string;
    admission_number: string;
    average_score: number;
  }>;
}

interface FinancialReport {
  period: string;
  total_revenue: number;
  total_fees: number;
  paid_fees: number;
  pending_fees: number;
  collection_rate: number;
}

interface GetReportsParams {
  start_date?: string;
  end_date?: string;
  month?: number;
  year?: number;
  class_id?: number;
  term_id?: number;
  session_id?: number;
}

export const reportsService = {
  getAttendanceReport: async (params?: GetReportsParams): Promise<{ data: AttendanceReport[] }> => {
    const response = await apiClient.get('/reports/attendance', { params });
    return response.data;
  },

  getAcademicReport: async (params?: GetReportsParams): Promise<{ data: AcademicReport[] }> => {
    const response = await apiClient.get('/reports/academic', { params });
    return response.data;
  },

  getFinancialReport: async (params?: GetReportsParams): Promise<{ data: FinancialReport[] }> => {
    const response = await apiClient.get('/reports/financial', { params });
    return response.data;
  },

  exportReport: async ({ type, format, params }: { type: string; format: 'pdf' | 'excel' | 'csv'; params?: GetReportsParams }): Promise<Blob> => {
    const response = await apiClient.get(`/reports/${type}/export`, {
      params: { ...params, format },
      responseType: 'blob',
    });
    return response.data;
  },

  // School Admin - Analytics & Reporting APIs
  getSchoolAnalytics: async (params?: {
    term_id?: number;
    academic_year_id?: number;
  }): Promise<{
    analytics: {
      total_students: number;
      average_performance: number;
      pass_rate: number;
      top_subjects: Array<any>;
      weakest_subjects: Array<any>;
    };
  }> => {
    const response = await apiClient.get('/assessments/analytics/school', { params });
    return response.data;
  },

  getClassAnalytics: async (classId: number, params?: {
    term_id?: number;
    academic_year_id?: number;
  }): Promise<{
    class: {
      id: number;
      name: string;
    };
    analytics: {
      average_score: number;
      pass_rate: number;
      total_students: number;
    };
  }> => {
    const response = await apiClient.get(`/assessments/analytics/class/${classId}`, { params });
    return response.data;
  },

  getSubjectAnalytics: async (subjectId: number, params?: {
    term_id?: number;
    academic_year_id?: number;
  }): Promise<{
    subject: any;
    analytics: any;
  }> => {
    const response = await apiClient.get(`/assessments/analytics/subject/${subjectId}`, { params });
    return response.data;
  },

  getStudentTrend: async (studentId: number): Promise<{
    student: any;
    trend: Array<any>;
  }> => {
    const response = await apiClient.get(`/assessments/analytics/student/${studentId}/trend`);
    return response.data;
  },

  getComparativeAnalytics: async (params?: {
    class_id?: number;
    term_id?: number;
  }): Promise<{
    comparison: Array<any>;
  }> => {
    const response = await apiClient.get('/assessments/analytics/comparative', { params });
    return response.data;
  },

  getStudentPrediction: async (studentId: number): Promise<{
    student: any;
    prediction: any;
  }> => {
    const response = await apiClient.get(`/assessments/analytics/student/${studentId}/prediction`);
    return response.data;
  },

  // School Admin - Promotions APIs
  listPromotions: async (): Promise<{
    data: Array<{
      id: number;
      student_id: number;
      from_class_id: number;
      to_class_id: number;
      academic_year_id: number;
      status: string;
    }>;
  }> => {
    const response = await apiClient.get('/assessments/promotions');
    return response.data;
  },

  promoteStudent: async (data: {
    student_id: number;
    from_class_id: number;
    to_class_id: number;
    academic_year_id: number;
  }): Promise<{
    message: string;
    promotion: any;
  }> => {
    const response = await apiClient.post('/assessments/promotions/promote', data);
    return response.data;
  },

  bulkPromoteStudents: async (data: {
    class_id: number;
    to_class_id: number;
    academic_year_id: number;
    criteria?: {
      min_average?: number;
    };
  }): Promise<{
    message: string;
    promoted_count: number;
  }> => {
    const response = await apiClient.post('/assessments/promotions/bulk-promote', data);
    return response.data;
  },

  autoPromoteStudents: async (data: {
    class_id: number;
    academic_year_id: number;
  }): Promise<{
    message: string;
    promoted_count: number;
  }> => {
    const response = await apiClient.post('/assessments/promotions/auto-promote', data);
    return response.data;
  },

  graduateStudents: async (data: {
    student_ids: number[];
    academic_year_id: number;
  }): Promise<{
    message: string;
    graduated_count: number;
  }> => {
    const response = await apiClient.post('/assessments/promotions/graduate', data);
    return response.data;
  },

  getPromotionStatistics: async (params?: {
    academic_year_id?: number;
  }): Promise<{
    statistics: {
      promoted: number;
      repeated: number;
      graduated: number;
      total: number;
    };
  }> => {
    const response = await apiClient.get('/assessments/promotions/statistics', { params });
    return response.data;
  },

  deletePromotion: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/assessments/promotions/${id}`);
    return response.data;
  },
};

// 2. TanStack Query Hooks

export const useAttendanceReport = (params?: GetReportsParams) => {
  return useQuery({
    queryKey: ['attendanceReport', params],
    queryFn: () => reportsService.getAttendanceReport(params),
  });
};

export const useAcademicReport = (params?: GetReportsParams) => {
  return useQuery({
    queryKey: ['academicReport', params],
    queryFn: () => reportsService.getAcademicReport(params),
  });
};

export const useFinancialReport = (params?: GetReportsParams) => {
  return useQuery({
    queryKey: ['financialReport', params],
    queryFn: () => reportsService.getFinancialReport(params),
  });
};

// School Admin - Analytics & Reporting Hooks
export const useSchoolAnalytics = (params?: { term_id?: number; academic_year_id?: number }) => {
  return useQuery({
    queryKey: ['schoolAnalytics', params],
    queryFn: () => reportsService.getSchoolAnalytics(params),
  });
};

export const useClassAnalytics = (classId: number, params?: { term_id?: number; academic_year_id?: number }) => {
  return useQuery({
    queryKey: ['classAnalytics', classId, params],
    queryFn: () => reportsService.getClassAnalytics(classId, params),
    enabled: !!classId,
  });
};

export const useSubjectAnalytics = (subjectId: number, params?: { term_id?: number; academic_year_id?: number }) => {
  return useQuery({
    queryKey: ['subjectAnalytics', subjectId, params],
    queryFn: () => reportsService.getSubjectAnalytics(subjectId, params),
    enabled: !!subjectId,
  });
};

export const useStudentTrend = (studentId: number) => {
  return useQuery({
    queryKey: ['studentTrend', studentId],
    queryFn: () => reportsService.getStudentTrend(studentId),
    enabled: !!studentId,
  });
};

export const useComparativeAnalytics = (params?: { class_id?: number; term_id?: number }) => {
  return useQuery({
    queryKey: ['comparativeAnalytics', params],
    queryFn: () => reportsService.getComparativeAnalytics(params),
  });
};

export const useStudentPrediction = (studentId: number) => {
  return useQuery({
    queryKey: ['studentPrediction', studentId],
    queryFn: () => reportsService.getStudentPrediction(studentId),
    enabled: !!studentId,
  });
};

// School Admin - Promotions Hooks
export const usePromotions = () => {
  return useQuery({
    queryKey: ['promotions'],
    queryFn: () => reportsService.listPromotions(),
  });
};

export const usePromoteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reportsService.promoteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

export const useBulkPromoteStudents = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reportsService.bulkPromoteStudents,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

export const useAutoPromoteStudents = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reportsService.autoPromoteStudents,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

export const useGraduateStudents = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reportsService.graduateStudents,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

export const usePromotionStatistics = (params?: { academic_year_id?: number }) => {
  return useQuery({
    queryKey: ['promotionStatistics', params],
    queryFn: () => reportsService.getPromotionStatistics(params),
  });
};

export const useDeletePromotion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reportsService.deletePromotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    },
  });
};
