import apiClient from './apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 1. Service Functions

interface SchoolStatistics {
  total_students: number;
  total_teachers: number;
  total_staff: number;
  total_classes: number;
  student_teacher_ratio: number;
  attendance_rate: number;
  pass_rate: number;
}

interface DepartmentPerformance {
  id: number;
  name: string;
  average_score: number;
  pass_rate: number;
  student_count: number;
  teacher_count: number;
}

interface StaffOverview {
  total: number;
  by_department: Array<{
    department: string;
    count: number;
  }>;
  by_role: Array<{
    role: string;
    count: number;
  }>;
  active: number;
  inactive: number;
}

interface PendingApproval {
  id: number;
  type: 'leave_request' | 'expense' | 'disciplinary';
  title: string;
  description: string;
  requested_by: string;
  requested_at: string;
  amount?: number;
  status: string;
}

interface LeaveRequest {
  id: number;
  employee_id: number;
  employee_name: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requested_at: string;
}

interface DisciplinaryCase {
  id: number;
  student_id: number;
  student_name: string;
  case_type: string;
  description: string;
  reported_by: string;
  reported_at: string;
  status: 'pending' | 'reviewed' | 'resolved';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface ClassPerformance {
  id: number;
  name: string;
  average_score: number;
  pass_rate: number;
  total_students: number;
  rank: number;
}

interface TeacherPerformance {
  id: number;
  name: string;
  department: string;
  average_score: number;
  student_count: number;
  subject_count: number;
  attendance_rate: number;
}

interface ExamAnalysis {
  exam_id: number;
  title: string;
  subject: string;
  class: string;
  total_students: number;
  average_score: number;
  pass_rate: number;
  highest_score: number;
  lowest_score: number;
  grade_distribution: Array<{
    grade: string;
    count: number;
  }>;
}

export const principalService = {
  // School Management
  getSchoolStatistics: async (): Promise<{ data: SchoolStatistics }> => {
    const response = await apiClient.get('/schools/statistics');
    return response.data;
  },

  getDepartmentPerformance: async (): Promise<{ data: DepartmentPerformance[] }> => {
    const response = await apiClient.get('/departments/performance');
    return response.data;
  },

  getStaffOverview: async (): Promise<{ data: StaffOverview }> => {
    const response = await apiClient.get('/staff/overview');
    return response.data;
  },

  // Approval Management
  getPendingApprovals: async (): Promise<{ data: PendingApproval[] }> => {
    const response = await apiClient.get('/approvals/pending');
    return response.data;
  },

  approveLeaveRequest: async (id: number, data?: { notes?: string }): Promise<{ message: string }> => {
    const response = await apiClient.post(`/approvals/leave/${id}/approve`, data || {});
    return response.data;
  },

  rejectLeaveRequest: async (id: number, data?: { reason?: string }): Promise<{ message: string }> => {
    const response = await apiClient.post(`/approvals/leave/${id}/reject`, data || {});
    return response.data;
  },

  approveExpense: async (id: number, data?: { notes?: string }): Promise<{ message: string }> => {
    const response = await apiClient.post(`/approvals/expense/${id}/approve`, data || {});
    return response.data;
  },

  rejectExpense: async (id: number, data?: { reason?: string }): Promise<{ message: string }> => {
    const response = await apiClient.post(`/approvals/expense/${id}/reject`, data || {});
    return response.data;
  },

  // Academic Oversight
  getClassPerformanceReport: async (params?: { term_id?: number; academic_year_id?: number }): Promise<{ data: ClassPerformance[] }> => {
    const response = await apiClient.get('/academic/performance/classes', { params });
    return response.data;
  },

  getTeacherPerformance: async (params?: { department_id?: number }): Promise<{ data: TeacherPerformance[] }> => {
    const response = await apiClient.get('/academic/teachers/performance', { params });
    return response.data;
  },

  // HOD-specific endpoint
  getTeacherPerformanceReview: async (teacherId: number): Promise<{
    teacher: {
      id: number;
      name: string;
      email: string;
      department: string;
    };
    performance: {
      average_score: number;
      student_count: number;
      subject_count: number;
      attendance_rate: number;
      punctuality_rate: number;
    };
    reviews: Array<{
      period: string;
      rating: number;
      comments: string;
      reviewed_by: string;
      reviewed_at: string;
    }>;
  }> => {
    const response = await apiClient.get(`/teachers/${teacherId}/performance-review`);
    return response.data;
  },

  getExamAnalysis: async (params?: { exam_id?: number; term_id?: number; academic_year_id?: number }): Promise<{ data: ExamAnalysis[] }> => {
    const response = await apiClient.get('/academic/exams/analysis', { params });
    return response.data;
  },

  // Disciplinary Management
  getDisciplinaryCases: async (params?: { status?: string; severity?: string }): Promise<{ data: DisciplinaryCase[] }> => {
    const response = await apiClient.get('/discipline/cases', { params });
    return response.data;
  },

  reviewDisciplinaryCase: async (id: number, data: {
    action: string;
    notes?: string;
    status: 'reviewed' | 'resolved';
  }): Promise<{ message: string }> => {
    const response = await apiClient.post(`/discipline/cases/${id}/review`, data);
    return response.data;
  },

  // Communication
  sendSchoolWideAnnouncement: async (data: {
    title: string;
    content: string;
    priority?: 'low' | 'normal' | 'high';
    target_audience?: string[];
  }): Promise<{ message: string; announcement: any }> => {
    const response = await apiClient.post('/announcements/school-wide', data);
    return response.data;
  },

  sendMessageToDepartment: async (departmentId: number, data: {
    subject: string;
    message: string;
  }): Promise<{ message: string }> => {
    const response = await apiClient.post(`/messages/department/${departmentId}`, data);
    return response.data;
  },
};

// 2. TanStack Query Hooks

export const useSchoolStatistics = () => {
  return useQuery({
    queryKey: ['schoolStatistics'],
    queryFn: () => principalService.getSchoolStatistics(),
  });
};

export const useDepartmentPerformance = () => {
  return useQuery({
    queryKey: ['departmentPerformance'],
    queryFn: () => principalService.getDepartmentPerformance(),
  });
};

export const useStaffOverview = () => {
  return useQuery({
    queryKey: ['staffOverview'],
    queryFn: () => principalService.getStaffOverview(),
  });
};

export const usePendingApprovals = () => {
  return useQuery({
    queryKey: ['pendingApprovals'],
    queryFn: () => principalService.getPendingApprovals(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useApproveLeaveRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data?: { notes?: string } }) =>
      principalService.approveLeaveRequest(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingApprovals'] });
      queryClient.invalidateQueries({ queryKey: ['principalDashboard'] });
    },
  });
};

export const useRejectLeaveRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data?: { reason?: string } }) =>
      principalService.rejectLeaveRequest(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingApprovals'] });
      queryClient.invalidateQueries({ queryKey: ['principalDashboard'] });
    },
  });
};

export const useApproveExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data?: { notes?: string } }) =>
      principalService.approveExpense(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingApprovals'] });
      queryClient.invalidateQueries({ queryKey: ['principalDashboard'] });
      queryClient.invalidateQueries({ queryKey: ['financeDashboard'] });
    },
  });
};

export const useRejectExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data?: { reason?: string } }) =>
      principalService.rejectExpense(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingApprovals'] });
      queryClient.invalidateQueries({ queryKey: ['principalDashboard'] });
      queryClient.invalidateQueries({ queryKey: ['financeDashboard'] });
    },
  });
};

export const useClassPerformanceReport = (params?: { term_id?: number; academic_year_id?: number }) => {
  return useQuery({
    queryKey: ['classPerformanceReport', params],
    queryFn: () => principalService.getClassPerformanceReport(params),
  });
};

export const useTeacherPerformance = (params?: { department_id?: number }) => {
  return useQuery({
    queryKey: ['teacherPerformance', params],
    queryFn: () => principalService.getTeacherPerformance(params),
  });
};

// HOD-specific hook
export const useTeacherPerformanceReview = (teacherId: number) => {
  return useQuery({
    queryKey: ['teacherPerformanceReview', teacherId],
    queryFn: () => principalService.getTeacherPerformanceReview(teacherId),
    enabled: !!teacherId,
  });
};

export const useExamAnalysis = (params?: { exam_id?: number; term_id?: number; academic_year_id?: number }) => {
  return useQuery({
    queryKey: ['examAnalysis', params],
    queryFn: () => principalService.getExamAnalysis(params),
  });
};

export const useDisciplinaryCases = (params?: { status?: string; severity?: string }) => {
  return useQuery({
    queryKey: ['disciplinaryCases', params],
    queryFn: () => principalService.getDisciplinaryCases(params),
  });
};

export const useReviewDisciplinaryCase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { action: string; notes?: string; status: string } }) =>
      principalService.reviewDisciplinaryCase(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disciplinaryCases'] });
      queryClient.invalidateQueries({ queryKey: ['principalDashboard'] });
    },
  });
};

export const useSendSchoolWideAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: principalService.sendSchoolWideAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
};

export const useSendMessageToDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ departmentId, data }: { departmentId: number; data: { subject: string; message: string } }) =>
      principalService.sendMessageToDepartment(departmentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
};

