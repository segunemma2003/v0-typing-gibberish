import apiClient from './apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 1. Service Functions

interface School {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo: string;
  status: string;
  academic_year: string;
  term: string;
  settings: Record<string, any>;
  created_at: string;
  updated_at?: string;
}

interface UpdateSchoolRequest {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
}

interface SchoolStats {
  students: {
    total: number;
    active: number;
    inactive: number;
  };
  teachers: {
    total: number;
    active: number;
    inactive: number;
  };
  classes: number;
  subjects: number;
  departments: number;
  revenue: {
    current_month: number;
    total: number;
  };
}

interface RecentActivity {
  id: number;
  type: string;
  description: string;
  timestamp: string;
  user: string;
}

interface UpcomingEvent {
  id: number;
  title: string;
  date: string;
  type: string;
}

interface SchoolDashboard {
  school: {
    id: number;
    name: string;
  };
  stats: {
    total_students: number;
    total_teachers: number;
    total_classes: number;
    attendance_rate: number;
  };
  recent_activities: RecentActivity[];
  upcoming_events: UpcomingEvent[];
}

interface DepartmentHOD {
  id: number;
  name: string;
}

interface Department {
  id: number;
  name: string;
  hod: DepartmentHOD;
  teachers: Array<{ id: number; name: string }>;
}

interface SchoolOrganogram {
  organogram: {
    principal: {
      id: number;
      name: string;
      role: string;
    };
    vice_principal: {
      id: number;
      name: string;
      role: string;
    };
    departments: Department[];
    year_tutors: Array<{ id: number; name: string; role: string }>;
    class_teachers: Array<{ id: number; name: string; role: string }>;
  };
}

export const schoolService = {
  // List Schools
  getSchools: async (): Promise<{ data: School[] }> => {
    const response = await apiClient.get('/schools');
    return response.data;
  },

  getSchoolById: async (id: number): Promise<School> => {
    const response = await apiClient.get(`/schools/${id}`);
    // API returns { school: {...}, stats: {...} } but we want just the school object
    return response.data.school || response.data.data || response.data;
  },

  updateSchool: async ({ id, data }: { id: number; data: UpdateSchoolRequest }): Promise<{ message: string; school: School }> => {
    const response = await apiClient.put(`/schools/${id}`, data);
    return response.data;
  },

  getSchoolStats: async (id: number): Promise<{ stats: SchoolStats }> => {
    const response = await apiClient.get(`/schools/${id}/stats`);
    // API returns { stats: {...} }
    return response.data;
  },

  getSchoolDashboard: async (id: number): Promise<SchoolDashboard> => {
    const response = await apiClient.get(`/schools/${id}/dashboard`);
    return response.data;
  },

  getSchoolOrganogram: async (id: number): Promise<SchoolOrganogram> => {
    const response = await apiClient.get(`/schools/${id}/organogram`);
    return response.data;
  },
};

// 2. TanStack Query Hooks

export const useSchools = () => {
  return useQuery({
    queryKey: ['schools'],
    queryFn: schoolService.getSchools,
  });
};

export const useSchool = (id: number) => {
  return useQuery({
    queryKey: ['school', id],
    queryFn: () => schoolService.getSchoolById(id),
    enabled: !!id,
  });
};

export const useUpdateSchool = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: schoolService.updateSchool,
    onSuccess: (data, variables) => {
      console.log('School updated successfully', data);
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      queryClient.invalidateQueries({ queryKey: ['school', variables.id] });
    },
  });
};

export const useSchoolStats = (id: number) => {
  return useQuery({
    queryKey: ['schoolStats', id],
    queryFn: () => schoolService.getSchoolStats(id),
    enabled: !!id,
  });
};

export const useSchoolDashboard = (id: number) => {
  return useQuery({
    queryKey: ['schoolDashboard', id],
    queryFn: () => schoolService.getSchoolDashboard(id),
    enabled: !!id,
  });
};

export const useSchoolOrganogram = (id: number) => {
  return useQuery({
    queryKey: ['schoolOrganogram', id],
    queryFn: () => schoolService.getSchoolOrganogram(id),
    enabled: !!id,
  });
};

