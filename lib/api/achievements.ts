import apiClient from './apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 1. Service Functions

interface Achievement {
  id: number;
  title: string;
  description?: string;
  type: string;
  icon?: string;
  points?: number;
  student_id?: number;
  awarded_by?: number;
  awarded_at: string;
  created_at: string;
}

interface AchievementListResponse {
  data: Achievement[];
}

interface GetAchievementsParams {
  page?: number;
  per_page?: number;
  student_id?: number;
  type?: string;
  search?: string;
}

interface CreateAchievementRequest {
  title: string;
  description?: string;
  type: string;
  icon?: string;
  points?: number;
  student_id?: number;
}

interface UpdateAchievementRequest {
  title?: string;
  description?: string;
  type?: string;
  icon?: string;
  points?: number;
}

export const achievementService = {
  getAchievements: async (params?: GetAchievementsParams): Promise<AchievementListResponse> => {
    const response = await apiClient.get('/achievements', { params });
    return response.data;
  },

  getAchievementById: async (id: number): Promise<Achievement> => {
    const response = await apiClient.get(`/achievements/${id}`);
    return response.data;
  },

  getStudentAchievements: async (studentId: number): Promise<AchievementListResponse> => {
    const response = await apiClient.get(`/achievements/student/${studentId}`);
    return response.data;
  },

  createAchievement: async (data: CreateAchievementRequest): Promise<{ message: string; achievement: Achievement }> => {
    const response = await apiClient.post('/achievements', data);
    return response.data;
  },

  updateAchievement: async ({ id, data }: { id: number; data: UpdateAchievementRequest }): Promise<{ message: string; achievement: Achievement }> => {
    const response = await apiClient.put(`/achievements/${id}`, data);
    return response.data;
  },

  deleteAchievement: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/achievements/${id}`);
    return response.data;
  },

  // School Admin - Achievements APIs
  listAchievements: async (): Promise<{
    data: Array<{
      id: number;
      title: string;
      description?: string;
      category: string;
    }>;
  }> => {
    const response = await apiClient.get('/achievements');
    return response.data;
  },

  createAchievement: async (data: {
    title: string;
    description?: string;
    category: string;
  }): Promise<{
    message: string;
    achievement: any;
  }> => {
    const response = await apiClient.post('/achievements', data);
    return response.data;
  },

  getAchievement: async (id: number): Promise<{
    achievement: any;
  }> => {
    const response = await apiClient.get(`/achievements/${id}`);
    return response.data;
  },

  updateAchievement: async ({ id, data }: {
    id: number;
    data: Partial<{
      title: string;
      description: string;
      category: string;
    }>;
  }): Promise<{
    message: string;
    achievement: any;
  }> => {
    const response = await apiClient.put(`/achievements/${id}`, data);
    return response.data;
  },

  deleteAchievement: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/achievements/${id}`);
    return response.data;
  },

  getStudentAchievements: async (studentId: number): Promise<{
    student: {
      id: number;
      name: string;
    };
    achievements: Array<any>;
  }> => {
    const response = await apiClient.get(`/achievements/student/${studentId}`);
    return response.data;
  },
};

// 2. TanStack Query Hooks

export const useAchievements = (params?: GetAchievementsParams) => {
  return useQuery({
    queryKey: ['achievements', params],
    queryFn: () => achievementService.getAchievements(params),
  });
};

export const useAchievement = (id: number) => {
  return useQuery({
    queryKey: ['achievement', id],
    queryFn: () => achievementService.getAchievementById(id),
    enabled: !!id,
  });
};

export const useStudentAchievements = (studentId: number) => {
  return useQuery({
    queryKey: ['studentAchievements', studentId],
    queryFn: () => achievementService.getStudentAchievements(studentId),
    enabled: !!studentId,
  });
};

export const useCreateAchievement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: achievementService.createAchievement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
    },
  });
};

export const useUpdateAchievement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: achievementService.updateAchievement,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      queryClient.invalidateQueries({ queryKey: ['achievement', variables.id] });
    },
  });
};

export const useDeleteAchievement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: achievementService.deleteAchievement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
    },
  });
};

