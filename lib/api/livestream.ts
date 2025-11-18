import apiClient from './apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 1. Service Functions

interface Livestream {
  id: number;
  title: string;
  description: string;
  stream_url: string;
  thumbnail_url?: string;
  scheduled_start: string;
  scheduled_end?: string;
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  class_id?: number;
  subject_id?: number;
  teacher_id: number;
  teacher: {
    id: number;
    name: string;
  };
  viewers_count: number;
  created_at: string;
  updated_at?: string;
}

interface LivestreamListResponse {
  data: Livestream[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

interface GetLivestreamsParams {
  page?: number;
  per_page?: number;
  status?: 'scheduled' | 'live' | 'ended' | 'cancelled';
  class_id?: number;
  teacher_id?: number;
}

interface CreateLivestreamRequest {
  title: string;
  description: string;
  scheduled_start: string;
  scheduled_end?: string;
  class_id?: number;
  subject_id?: number;
  teacher_id: number;
}

interface UpdateLivestreamRequest {
  title?: string;
  description?: string;
  scheduled_start?: string;
  scheduled_end?: string;
  status?: 'scheduled' | 'live' | 'ended' | 'cancelled';
}

export const livestreamService = {
  getLivestreams: async (params?: GetLivestreamsParams): Promise<LivestreamListResponse> => {
    const response = await apiClient.get('/livestreams/livestreams', { params });
    return response.data;
  },

  getLivestreamById: async (id: number): Promise<Livestream> => {
    const response = await apiClient.get(`/livestreams/livestreams/${id}`);
    return response.data;
  },

  createLivestream: async (data: CreateLivestreamRequest): Promise<{ message: string; livestream: Livestream }> => {
    const response = await apiClient.post('/livestreams/livestreams', data);
    return response.data;
  },

  updateLivestream: async ({ id, data }: { id: number; data: UpdateLivestreamRequest }): Promise<{ message: string; livestream: Livestream }> => {
    const response = await apiClient.put(`/livestreams/livestreams/${id}`, data);
    return response.data;
  },

  deleteLivestream: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/livestreams/livestreams/${id}`);
    return response.data;
  },

  joinLivestream: async (id: number): Promise<{ message: string; livestream: Livestream }> => {
    const response = await apiClient.post(`/livestreams/${id}/join`);
    return response.data;
  },

  leaveLivestream: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.post(`/livestreams/${id}/leave`);
    return response.data;
  },

  getLivestreamAttendance: async (id: number): Promise<{ data: any[] }> => {
    const response = await apiClient.get(`/livestreams/${id}/attendance`);
    return response.data;
  },

  startLivestream: async (id: number): Promise<{ message: string; livestream: Livestream }> => {
    const response = await apiClient.post(`/livestreams/${id}/start`);
    return response.data;
  },

  endLivestream: async (id: number): Promise<{ message: string; livestream: Livestream }> => {
    const response = await apiClient.post(`/livestreams/${id}/end`);
    return response.data;
  },
};

// 2. TanStack Query Hooks

export const useLivestreams = (params?: GetLivestreamsParams) => {
  return useQuery({
    queryKey: ['livestreams', params],
    queryFn: () => livestreamService.getLivestreams(params),
  });
};

export const useLivestream = (id: number) => {
  return useQuery({
    queryKey: ['livestream', id],
    queryFn: () => livestreamService.getLivestreamById(id),
    enabled: !!id,
  });
};

export const useCreateLivestream = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: livestreamService.createLivestream,
    onSuccess: (data) => {
      console.log('Livestream created successfully', data);
      queryClient.invalidateQueries({ queryKey: ['livestreams'] });
    },
  });
};

export const useUpdateLivestream = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: livestreamService.updateLivestream,
    onSuccess: (data, variables) => {
      console.log('Livestream updated successfully', data);
      queryClient.invalidateQueries({ queryKey: ['livestreams'] });
      queryClient.invalidateQueries({ queryKey: ['livestream', variables.id] });
    },
  });
};

export const useDeleteLivestream = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: livestreamService.deleteLivestream,
    onSuccess: () => {
      console.log('Livestream deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['livestreams'] });
    },
  });
};

export const useStartLivestream = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: livestreamService.startLivestream,
    onSuccess: (data, variables) => {
      console.log('Livestream started successfully', data);
      queryClient.invalidateQueries({ queryKey: ['livestreams'] });
      queryClient.invalidateQueries({ queryKey: ['livestream', variables] });
    },
  });
};

export const useEndLivestream = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: livestreamService.endLivestream,
    onSuccess: (data, variables) => {
      console.log('Livestream ended successfully', data);
      queryClient.invalidateQueries({ queryKey: ['livestreams'] });
      queryClient.invalidateQueries({ queryKey: ['livestream', variables] });
    },
  });
};

