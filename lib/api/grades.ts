import apiClient from './apiClient';
import { useQuery } from '@tanstack/react-query';

// 1. Service Functions

interface Grade {
  subject: string;
  exam_type: string;
  marks: number;
  total_marks: number;
  percentage: number;
  grade: string;
  position: number;
  class_average: number;
}

interface GradeSummary {
  overall_average: number;
  overall_grade: string;
  overall_position: number;
  total_students: number;
}

interface MyGradesResponse {
  student: {
    id: number;
    name: string;
    admission_number: string;
  };
  grades: Grade[];
  summary: GradeSummary;
}

interface SubjectPerformance {
  exam: string;
  score: number;
  grade: string;
}

interface SubjectPerformanceResponse {
  subject: {
    id: number;
    name: string;
    code?: string;
  };
  performance: SubjectPerformance[];
  average: number;
  trend: 'improving' | 'declining' | 'stable';
}

interface GetMyGradesParams {
  subject_id?: number;
  term_id?: number;
  academic_year_id?: number;
}

export const gradesService = {
  getMyGrades: async (params?: GetMyGradesParams): Promise<MyGradesResponse> => {
    const response = await apiClient.get('/grades/student/me', { params });
    return response.data;
  },

  getSubjectPerformance: async (subjectId: number): Promise<SubjectPerformanceResponse> => {
    const response = await apiClient.get(`/grades/student/me/subject/${subjectId}`);
    return response.data;
  },
};

// 2. TanStack Query Hooks

export const useMyGrades = (params?: GetMyGradesParams) => {
  return useQuery({
    queryKey: ['myGrades', params],
    queryFn: () => gradesService.getMyGrades(params),
  });
};

export const useSubjectPerformance = (subjectId: number) => {
  return useQuery({
    queryKey: ['subjectPerformance', subjectId],
    queryFn: () => gradesService.getSubjectPerformance(subjectId),
    enabled: !!subjectId,
  });
};

