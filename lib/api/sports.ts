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

  // School Admin - Sports Management APIs
  listSportsActivities: async (): Promise<{
    activities: Array<{
      id: number;
      name: string;
      type: string;
      coach_id?: number;
      status: string;
    }>;
  }> => {
    const response = await apiClient.get('/sports/activities');
    return response.data;
  },

  createSportsActivity: async (data: {
    name: string;
    description?: string;
    type: string;
    coach_id?: number;
  }): Promise<{
    message: string;
    activity: {
      id: number;
      name: string;
    };
  }> => {
    const response = await apiClient.post('/sports/activities', data);
    return response.data;
  },

  updateSportsActivity: async ({ id, data }: {
    id: number;
    data: Partial<{
      name: string;
      description: string;
      type: string;
      coach_id: number;
      status: string;
    }>;
  }): Promise<{
    message: string;
    activity: any;
  }> => {
    const response = await apiClient.put(`/sports/activities/${id}`, data);
    return response.data;
  },

  deleteSportsActivity: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/sports/activities/${id}`);
    return response.data;
  },

  listSportsTeams: async (): Promise<{
    teams: Array<{
      id: number;
      name: string;
      activity_id: number;
      captain_id?: number;
    }>;
  }> => {
    const response = await apiClient.get('/sports/teams');
    return response.data;
  },

  createSportsTeam: async (data: {
    name: string;
    sport: string;
    gender?: string;
    age_group?: string;
  }): Promise<{
    message: string;
    team: {
      id: number;
      name: string;
    };
  }> => {
    const response = await apiClient.post('/sports/teams', data);
    return response.data;
  },

  updateSportsTeam: async ({ id, data }: {
    id: number;
    data: Partial<{
      name: string;
      captain_id: number;
    }>;
  }): Promise<{
    message: string;
    team: any;
  }> => {
    const response = await apiClient.put(`/sports/teams/${id}`, data);
    return response.data;
  },

  deleteSportsTeam: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/sports/teams/${id}`);
    return response.data;
  },

  listSportsEvents: async (): Promise<{
    events: Array<{
      id: number;
      name: string;
      event_date: string;
      venue?: string;
    }>;
  }> => {
    const response = await apiClient.get('/sports/events');
    return response.data;
  },

  createSportsEvent: async (data: {
    title: string;
    date: string;
    venue?: string;
    description?: string;
  }): Promise<{
    message: string;
    event: {
      id: number;
      name: string;
    };
  }> => {
    const response = await apiClient.post('/sports/events', data);
    return response.data;
  },

  updateSportsEvent: async ({ id, data }: {
    id: number;
    data: Partial<{
      title: string;
      date: string;
      venue: string;
      description: string;
    }>;
  }): Promise<{
    message: string;
    event: any;
  }> => {
    const response = await apiClient.put(`/sports/events/${id}`, data);
    return response.data;
  },

  deleteSportsEvent: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/sports/events/${id}`);
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

