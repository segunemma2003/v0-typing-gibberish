import apiClient from './apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 1. Service Functions

interface AttendanceRecord {
  id: number;
  attendanceable_type: 'student' | 'teacher';
  attendanceable_id: number;
  attendanceable_name: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  time_in?: string;
  time_out?: string;
  notes?: string;
  created_at: string;
}

interface AttendanceListResponse {
  data: AttendanceRecord[];
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

interface GetAttendanceParams {
  page?: number;
  per_page?: number;
  date?: string;
  status?: 'present' | 'absent' | 'late' | 'excused';
  attendanceable_type?: 'student' | 'teacher';
  search?: string;
}

interface AttendanceReport {
  period: {
    start_date: string;
    end_date: string;
  };
  summary: {
    total: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
  };
  daily_breakdown: Array<{
    date: string;
    present: number;
    absent: number;
    late: number;
    excused: number;
  }>;
  top_absentees: Array<{
    id: number;
    name: string;
    absent_days: number;
  }>;
  attendance_trends: {
    daily: Array<{ date: string; percentage: number }>;
    weekly: Array<{ week: string; percentage: number }>;
  };
}

interface GetAttendanceReportsParams {
  start_date?: string;
  end_date?: string;
  type?: 'students' | 'teachers';
}

interface CreateAttendanceRequest {
  attendanceable_type: 'student' | 'teacher';
  attendanceable_id: number;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  time_in?: string;
  time_out?: string;
  notes?: string;
}

interface BulkAttendanceRequest {
  date: string;
  records: Array<{
    attendanceable_type: 'student' | 'teacher';
    attendanceable_id: number;
    status: 'present' | 'absent' | 'late' | 'excused';
    time_in?: string;
    time_out?: string;
  }>;
}

export const attendanceService = {
  // List Attendance Records
  getAttendance: async (params?: GetAttendanceParams): Promise<AttendanceListResponse> => {
    const response = await apiClient.get('/attendance', { params });
    return response.data;
  },

  // Get Attendance by ID
  getAttendanceById: async (id: number): Promise<{ data: AttendanceRecord }> => {
    const response = await apiClient.get(`/attendance/${id}`);
    return response.data;
  },

  // Create Attendance Record
  createAttendance: async (data: CreateAttendanceRequest): Promise<{ message: string; data: AttendanceRecord }> => {
    const response = await apiClient.post('/attendance', data);
    return response.data;
  },

  // Update Attendance Record
  updateAttendance: async ({ id, data }: { id: number; data: Partial<CreateAttendanceRequest> }): Promise<{ message: string; data: AttendanceRecord }> => {
    const response = await apiClient.put(`/attendance/${id}`, data);
    return response.data;
  },

  // Delete Attendance Record
  deleteAttendance: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/attendance/${id}`);
    return response.data;
  },

  // Mark Class Attendance
  markClassAttendance: async (data: {
    class_id: number;
    date: string;
    attendance: Array<{
      student_id: number;
      status: 'present' | 'absent' | 'late';
      check_in_time?: string;
      notes?: string;
    }>;
  }): Promise<{ message: string; created: number }> => {
    const response = await apiClient.post('/attendance/mark', data);
    return response.data;
  },

  // Bulk Create Attendance
  bulkCreateAttendance: async (data: BulkAttendanceRequest): Promise<{ message: string; created: number }> => {
    const response = await apiClient.post('/bulk/attendance/mark', data);
    return response.data;
  },

  // Attendance Reports
  getAttendanceReports: async (params?: GetAttendanceReportsParams): Promise<{ data: AttendanceReport }> => {
    const response = await apiClient.get('/attendance/reports', { params });
    return response.data;
  },

  // Parent/Guardian endpoints - Child attendance
  getChildAttendance: async (childId: number, params?: { from?: string; to?: string; per_page?: number }): Promise<{
    student: {
      id: number;
      name: string;
      admission_number: string;
      class: string;
    };
    attendance: Array<{
      date: string;
      day: string;
      status: 'present' | 'absent' | 'late' | 'excused';
      check_in_time?: string;
      notes?: string;
      excused?: boolean;
    }>;
    summary: {
      total_days: number;
      present: number;
      absent: number;
      late: number;
      excused_absences: number;
      attendance_rate: number;
      punctuality_rate: number;
    };
    period: {
      from: string;
      to: string;
    };
  }> => {
    const response = await apiClient.get(`/attendance/student/${childId}`, { params });
    return response.data;
  },

  // Student My Attendance
  getMyAttendance: async (params?: { from?: string; to?: string; per_page?: number }): Promise<{
    student: {
      id: number;
      name: string;
      admission_number: string;
      class: string;
    };
    attendance: Array<{
      date: string;
      day: string;
      status: 'present' | 'absent' | 'late' | 'excused';
      check_in_time?: string;
      notes?: string;
    }>;
    summary: {
      total_days: number;
      present: number;
      absent: number;
      late: number;
      attendance_rate: number;
      punctuality_rate?: number;
    };
  }> => {
    const response = await apiClient.get('/attendance/student/me', { params });
    return response.data;
  },
};

// 2. TanStack Query Hooks

export const useAttendance = (params?: GetAttendanceParams) => {
  return useQuery({
    queryKey: ['attendance', params],
    queryFn: () => attendanceService.getAttendance(params),
  });
};

export const useAttendanceById = (id: number) => {
  return useQuery({
    queryKey: ['attendance', id],
    queryFn: () => attendanceService.getAttendanceById(id),
    enabled: !!id,
  });
};

export const useCreateAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: attendanceService.createAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
};

export const useUpdateAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: attendanceService.updateAttendance,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({ queryKey: ['attendance', variables.id] });
    },
  });
};

export const useDeleteAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: attendanceService.deleteAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
};

export const useMarkClassAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: attendanceService.markClassAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
};

export const useBulkCreateAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: attendanceService.bulkCreateAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
};

export const useAttendanceReports = (params?: GetAttendanceReportsParams) => {
  return useQuery({
    queryKey: ['attendanceReports', params],
    queryFn: () => attendanceService.getAttendanceReports(params),
  });
};

export const useMyAttendance = (params?: { from?: string; to?: string }) => {
  return useQuery({
    queryKey: ['myAttendance', params],
    queryFn: () => attendanceService.getMyAttendance(params),
  });
};

// Parent/Guardian hooks - Child attendance
export const useChildAttendance = (childId: number, params?: { from?: string; to?: string; per_page?: number }) => {
  return useQuery({
    queryKey: ['childAttendance', childId, params],
    queryFn: () => attendanceService.getChildAttendance(childId, params),
    enabled: !!childId,
  });
};

