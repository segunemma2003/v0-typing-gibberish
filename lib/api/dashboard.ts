import apiClient from './apiClient';
import { useQuery } from '@tanstack/react-query';

// 1. Service Functions

interface AdminDashboard {
  dashboard: {
    overview: {
      total_students: number;
      total_teachers: number;
      total_classes: number;
      attendance_rate: number;
    };
    recent_activities: Array<{
      id: number;
      type: string;
      description: string;
      timestamp: string;
      user: string;
    }>;
    upcoming_events: Array<{
      id: number;
      title: string;
      date: string;
      type: string;
    }>;
  };
}

interface TeacherDashboard {
  dashboard: {
    my_classes: number;
    my_students: number;
    pending_assignments: number;
    upcoming_classes: Array<{
      id: number;
      class: string;
      subject: string;
      time: string;
    }>;
  };
}

interface StudentDashboard {
  dashboard: {
    my_courses: number;
    pending_assignments: number;
    upcoming_exams: number;
    attendance_rate: number;
    recent_grades: Array<{
      id: number;
      subject: string;
      grade: string;
      score: number;
    }>;
  };
}

interface ParentDashboard {
  dashboard: {
    children: Array<{
      id: number;
      name: string;
      class: string;
      attendance_rate: number;
      recent_grades: Array<{
        subject: string;
        grade: string;
      }>;
    }>;
    upcoming_events: Array<{
      id: number;
      title: string;
      date: string;
    }>;
    pending_payments: number;
  };
}

interface SuperAdminDashboard {
  dashboard: {
    total_tenants: number;
    active_tenants: number;
    total_schools: number;
    total_users: number;
    system_health: string;
    recent_activities: Array<{
      id: number;
      type: string;
      description: string;
      timestamp: string;
    }>;
  };
}

export const dashboardService = {
  getAdminDashboard: async (): Promise<AdminDashboard> => {
    const response = await apiClient.get('/dashboard/admin');
    // API returns { dashboard: {...} }
    return response.data;
  },

  getTeacherDashboard: async (): Promise<TeacherDashboard> => {
    const response = await apiClient.get('/dashboard/teacher');
    // API returns { dashboard: {...} }
    return response.data;
  },

  getStudentDashboard: async (): Promise<StudentDashboard> => {
    const response = await apiClient.get('/dashboard/student');
    // API returns { dashboard: {...} }
    return response.data;
  },

  getParentDashboard: async (): Promise<ParentDashboard> => {
    const response = await apiClient.get('/dashboard/parent');
    // API returns { dashboard: {...} }
    return response.data;
  },

  getSuperAdminDashboard: async (): Promise<SuperAdminDashboard> => {
    const response = await apiClient.get('/dashboard/super-admin');
    // API returns { dashboard: {...} } or { analytics: {...} }
    return response.data;
  },
};

// 2. TanStack Query Hooks

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['adminDashboard'],
    queryFn: dashboardService.getAdminDashboard,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useTeacherDashboard = () => {
  return useQuery({
    queryKey: ['teacherDashboard'],
    queryFn: dashboardService.getTeacherDashboard,
    staleTime: 1000 * 60 * 5,
  });
};

export const useStudentDashboard = () => {
  return useQuery({
    queryKey: ['studentDashboard'],
    queryFn: dashboardService.getStudentDashboard,
    staleTime: 1000 * 60 * 5,
  });
};

export const useParentDashboard = () => {
  return useQuery({
    queryKey: ['parentDashboard'],
    queryFn: dashboardService.getParentDashboard,
    staleTime: 1000 * 60 * 5,
  });
};

export const useSuperAdminDashboard = () => {
  return useQuery({
    queryKey: ['superAdminDashboard'],
    queryFn: dashboardService.getSuperAdminDashboard,
    staleTime: 1000 * 60 * 5,
  });
};

