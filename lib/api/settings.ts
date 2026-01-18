import apiClient from './apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 1. Service Functions

interface Settings {
  [key: string]: any;
}

export const settingsService = {
  // School Admin - Settings APIs
  getSettings: async (): Promise<{
    settings: Array<any>;
  }> => {
    const response = await apiClient.get('/settings');
    return response.data;
  },

  updateSettings: async (data: {
    school_name?: string;
    academic_year?: string;
    term?: string;
    [key: string]: any;
  }): Promise<{
    message: string;
  }> => {
    const response = await apiClient.put('/settings', data);
    return response.data;
  },
};

// 2. TanStack Query Hooks

export const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsService.getSettings(),
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: settingsService.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      queryClient.invalidateQueries({ queryKey: ['school', 'me'] });
    },
  });
};
