import apiClient from './apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 1. Service Functions

interface SportsActivity {
  id: number;
  name: string;
  description?: string;
  category: string;
  coach_id?: number;
  schedule?: string;
  status: 'active' | 'inactive';
  created_at: string;
}

interface SportsTeam {
  id: number;
  name: string;
  sport: string;
  coach_id: number;
  members: {
    id: number;
    student_id: number;
    student: {
      id: number;
      name: string;
    };
    position?: string;
  }[];
  created_at: string;
}

interface SportsEvent {
  id: number;
  name: string;
  description?: string;
  sport: string;
  date: string;
  venue?: string;
  teams: {
    id: number;
    name: string;
    score?: number;
  }[];
  status: 'scheduled' | 'ongoing' | 'completed';
  created_at: string;
}

interface ActivityListResponse {
  data: SportsActivity[];
}

interface TeamListResponse {
  data: SportsTeam[];
}

interface EventListResponse {
  data: SportsEvent[];
}

interface CreateActivityRequest {
  name: string;
  description?: string;
  category: string;
  coach_id?: number;
  schedule?: string;
}

interface CreateTeamRequest {
  name: string;
  sport: string;
  coach_id: number;
  member_ids?: number[];
}

interface CreateEventRequest {
  name: string;
  description?: string;
  sport: string;
  date: string;
  venue?: string;
  team_ids: number[];
}

export const sportsService = {
  getActivities: async (): Promise<ActivityListResponse> => {
    const response = await apiClient.get('/sports/activities');
    return response.data;
  },

  createActivity: async (data: CreateActivityRequest): Promise<{ message: string; activity: SportsActivity }> => {
    const response = await apiClient.post('/sports/activities', data);
    return response.data;
  },

  updateActivity: async ({ id, data }: { id: number; data: Partial<CreateActivityRequest> }): Promise<{ message: string; activity: SportsActivity }> => {
    const response = await apiClient.put(`/sports/activities/${id}`, data);
    return response.data;
  },

  deleteActivity: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/sports/activities/${id}`);
    return response.data;
  },

  getTeams: async (): Promise<TeamListResponse> => {
    const response = await apiClient.get('/sports/teams');
    return response.data;
  },

  createTeam: async (data: CreateTeamRequest): Promise<{ message: string; team: SportsTeam }> => {
    const response = await apiClient.post('/sports/teams', data);
    return response.data;
  },

  getEvents: async (): Promise<EventListResponse> => {
    const response = await apiClient.get('/sports/events');
    return response.data;
  },

  createEvent: async (data: CreateEventRequest): Promise<{ message: string; event: SportsEvent }> => {
    const response = await apiClient.post('/sports/events', data);
    return response.data;
  },
};

// 2. TanStack Query Hooks

export const useSportsActivities = () => {
  return useQuery({
    queryKey: ['sportsActivities'],
    queryFn: sportsService.getActivities,
  });
};

export const useCreateSportsActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sportsService.createActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sportsActivities'] });
    },
  });
};

export const useUpdateSportsActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sportsService.updateActivity,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sportsActivities'] });
    },
  });
};

export const useDeleteSportsActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sportsService.deleteActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sportsActivities'] });
    },
  });
};

export const useSportsTeams = () => {
  return useQuery({
    queryKey: ['sportsTeams'],
    queryFn: sportsService.getTeams,
  });
};

export const useCreateSportsTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sportsService.createTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sportsTeams'] });
    },
  });
};

export const useSportsEvents = () => {
  return useQuery({
    queryKey: ['sportsEvents'],
    queryFn: sportsService.getEvents,
  });
};

export const useCreateSportsEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sportsService.createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sportsEvents'] });
    },
  });
};

