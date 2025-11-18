import apiClient from './apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 1. Service Functions

interface Announcement {
  id: number;
  title: string;
  content: string;
  type: string;
  status: 'draft' | 'published';
  published_at?: string;
  created_at: string;
  updated_at?: string;
}

interface AnnouncementListResponse {
  data: Announcement[];
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

interface GetAnnouncementsParams {
  page?: number;
  per_page?: number;
  type?: string;
  status?: 'draft' | 'published';
  search?: string;
}

interface CreateAnnouncementRequest {
  title: string;
  content: string;
  type?: string;
  status?: 'draft' | 'published';
}

interface UpdateAnnouncementRequest {
  title?: string;
  content?: string;
  type?: string;
  status?: 'draft' | 'published';
}

export const announcementService = {
  getAnnouncements: async (params?: GetAnnouncementsParams): Promise<AnnouncementListResponse> => {
    const response = await apiClient.get('/announcements', { params });
    return response.data;
  },

  getAnnouncementById: async (id: number): Promise<Announcement> => {
    const response = await apiClient.get(`/announcements/${id}`);
    return response.data;
  },

  createAnnouncement: async (data: CreateAnnouncementRequest): Promise<{ message: string; announcement: Announcement }> => {
    const response = await apiClient.post('/announcements', data);
    return response.data;
  },

  updateAnnouncement: async ({ id, data }: { id: number; data: UpdateAnnouncementRequest }): Promise<{ message: string; announcement: Announcement }> => {
    const response = await apiClient.put(`/announcements/${id}`, data);
    return response.data;
  },

  deleteAnnouncement: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/announcements/${id}`);
    return response.data;
  },

  publishAnnouncement: async (id: number): Promise<{ message: string; announcement: Announcement }> => {
    const response = await apiClient.post(`/announcements/${id}/publish`);
    return response.data;
  },
};

// 2. TanStack Query Hooks

export const useAnnouncements = (params?: GetAnnouncementsParams) => {
  return useQuery({
    queryKey: ['announcements', params],
    queryFn: () => announcementService.getAnnouncements(params),
  });
};

export const useAnnouncement = (id: number) => {
  return useQuery({
    queryKey: ['announcement', id],
    queryFn: () => announcementService.getAnnouncementById(id),
    enabled: !!id,
  });
};

export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: announcementService.createAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
};

export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: announcementService.updateAnnouncement,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      queryClient.invalidateQueries({ queryKey: ['announcement', variables.id] });
    },
  });
};

export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: announcementService.deleteAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
};

export const usePublishAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: announcementService.publishAnnouncement,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      queryClient.invalidateQueries({ queryKey: ['announcement', variables] });
    },
  });
};

