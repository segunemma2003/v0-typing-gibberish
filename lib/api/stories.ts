import apiClient from './apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Types
export type StoryType = 'photo' | 'video' | 'text' | 'announcement' | 'achievement' | 'event';
export type VisibilityType = 'public' | 'students' | 'staff' | 'parents' | 'guardians' | 'teachers' | 'admin_only' | 'class_specific';
export type ReactionType = 'like' | 'love' | 'celebrate' | 'support' | 'insightful' | 'curious';

export interface Story {
  id: number;
  school_id: number;
  user_id: number;
  title?: string;
  content?: string;
  type: StoryType;
  media?: string[];
  thumbnail?: string;
  visibility: VisibilityType;
  visible_to_classes?: number[] | null;
  is_pinned: boolean;
  expires_at?: string | null;
  is_active: boolean;
  allow_comments: boolean;
  allow_reactions: boolean;
  views_count: number;
  reactions_count: number;
  comments_count: number;
  shares_count: number;
  tags?: string[];
  category?: string;
  created_at: string;
  updated_at: string;
  is_expired?: boolean;
  has_user_viewed?: boolean;
  user_reaction?: ReactionType | null;
  author?: {
    id: number;
    name: string;
    email: string;
    role?: string;
  };
  reactions?: StoryReaction[];
  comments?: StoryComment[];
}

export interface StoryReaction {
  id: number;
  reaction_type: ReactionType;
  user: {
    id: number;
    name: string;
  };
  created_at: string;
}

export interface StoryComment {
  id: number;
  comment: string;
  user: {
    id: number;
    name: string;
    email?: string;
  };
  parent_id?: number | null;
  replies?: StoryComment[];
  created_at: string;
}

export interface StoryAnalytics {
  views_count: number;
  reactions_count: number;
  comments_count: number;
  shares_count: number;
  reactions_breakdown: {
    reaction_type: ReactionType;
    count: number;
  }[];
  top_viewers: {
    id: number;
    user: {
      id: number;
      name: string;
      email: string;
    };
    viewed_at: string;
  }[];
}

export interface CreateStoryRequest {
  title?: string;
  content?: string;
  type: StoryType;
  media?: string[];
  thumbnail?: string;
  visibility: VisibilityType;
  visible_to_classes?: number[];
  is_pinned?: boolean;
  expires_at?: string;
  allow_comments?: boolean;
  allow_reactions?: boolean;
  tags?: string[];
  category?: string;
}

export interface UpdateStoryRequest {
  title?: string;
  content?: string;
  is_pinned?: boolean;
  expires_at?: string;
  allow_comments?: boolean;
  allow_reactions?: boolean;
  visibility?: VisibilityType;
  visible_to_classes?: number[];
}

export interface StoryListResponse {
  stories: {
    data: Story[];
    current_page: number;
    per_page: number;
    total: number;
  };
}

export interface StoryResponse {
  story: Story;
}

export interface StoryAnalyticsResponse {
  analytics: StoryAnalytics;
}

export interface GetStoriesParams {
  type?: StoryType;
  category?: string;
  visibility?: VisibilityType;
  pinned?: boolean;
  recent?: boolean;
  hours?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

// Service Functions
export const storiesService = {
  getStories: async (params?: GetStoriesParams): Promise<StoryListResponse> => {
    const response = await apiClient.get('/stories', { params });
    return response.data;
  },

  getStory: async (id: number): Promise<StoryResponse> => {
    const response = await apiClient.get(`/stories/${id}`);
    return response.data;
  },

  createStory: async (data: CreateStoryRequest): Promise<{ message: string; story: Story }> => {
    const response = await apiClient.post('/stories', data);
    return response.data;
  },

  updateStory: async ({ id, data }: { id: number; data: UpdateStoryRequest }): Promise<{ message: string; story: Story }> => {
    const response = await apiClient.put(`/stories/${id}`, data);
    return response.data;
  },

  deleteStory: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/stories/${id}`);
    return response.data;
  },

  reactToStory: async (storyId: number, reactionType: ReactionType): Promise<{ message: string; reactions_count: number }> => {
    const response = await apiClient.post(`/stories/${storyId}/react`, { reaction_type: reactionType });
    return response.data;
  },

  removeReaction: async (storyId: number): Promise<{ message: string; reactions_count: number }> => {
    const response = await apiClient.delete(`/stories/${storyId}/unreact`);
    return response.data;
  },

  addComment: async (storyId: number, comment: string, parentId?: number): Promise<{ message: string; comment: StoryComment; comments_count: number }> => {
    const response = await apiClient.post(`/stories/${storyId}/comments`, {
      comment,
      parent_id: parentId || null,
    });
    return response.data;
  },

  deleteComment: async (storyId: number, commentId: number): Promise<{ message: string; comments_count: number }> => {
    const response = await apiClient.delete(`/stories/${storyId}/comments/${commentId}`);
    return response.data;
  },

  shareStory: async (storyId: number): Promise<{ message: string; shares_count: number }> => {
    const response = await apiClient.post(`/stories/${storyId}/share`);
    return response.data;
  },

  getStoryAnalytics: async (storyId: number): Promise<StoryAnalyticsResponse> => {
    const response = await apiClient.get(`/stories/${storyId}/analytics`);
    return response.data;
  },

  // School Admin - School Stories APIs (already have most, adding missing ones)
  listStories: async (): Promise<{
    data: Array<{
      id: number;
      title: string;
      content: string;
      published_at: string;
    }>;
  }> => {
    const response = await apiClient.get('/stories');
    return response.data;
  },
};

// TanStack Query Hooks
export const useStories = (params?: GetStoriesParams) => {
  return useQuery({
    queryKey: ['stories', params],
    queryFn: () => storiesService.getStories(params),
  });
};

export const useStory = (id: number) => {
  return useQuery({
    queryKey: ['story', id],
    queryFn: () => storiesService.getStory(id),
    enabled: !!id,
  });
};

export const useCreateStory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: storiesService.createStory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
    },
  });
};

export const useUpdateStory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: storiesService.updateStory,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      queryClient.invalidateQueries({ queryKey: ['story', variables.id] });
    },
  });
};

export const useDeleteStory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: storiesService.deleteStory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
    },
  });
};

export const useReactToStory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ storyId, reactionType }: { storyId: number; reactionType: ReactionType }) =>
      storiesService.reactToStory(storyId, reactionType),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      queryClient.invalidateQueries({ queryKey: ['story', variables.storyId] });
    },
  });
};

export const useRemoveReaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: storiesService.removeReaction,
    onSuccess: (data, storyId) => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      queryClient.invalidateQueries({ queryKey: ['story', storyId] });
    },
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ storyId, comment, parentId }: { storyId: number; comment: string; parentId?: number }) =>
      storiesService.addComment(storyId, comment, parentId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      queryClient.invalidateQueries({ queryKey: ['story', variables.storyId] });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ storyId, commentId }: { storyId: number; commentId: number }) =>
      storiesService.deleteComment(storyId, commentId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      queryClient.invalidateQueries({ queryKey: ['story', variables.storyId] });
    },
  });
};

export const useShareStory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: storiesService.shareStory,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      queryClient.invalidateQueries({ queryKey: ['story', variables] });
    },
  });
};

export const useStoryAnalytics = (storyId: number) => {
  return useQuery({
    queryKey: ['storyAnalytics', storyId],
    queryFn: () => storiesService.getStoryAnalytics(storyId),
    enabled: !!storyId,
  });
};

