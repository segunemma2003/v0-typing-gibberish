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

