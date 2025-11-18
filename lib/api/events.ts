import apiClient from './apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 1. Service Functions

interface Event {
  id: number;
  title: string;
  description?: string;
  type: string;
  start_date: string;
  end_date?: string;
  location?: string;
  organizer_id: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  created_at: string;
}

interface Calendar {
  id: number;
  name: string;
  description?: string;
  academic_year: string;
  events: Event[];
  created_at: string;
}

interface EventListResponse {
  data: Event[];
}

interface CalendarListResponse {
  data: Calendar[];
}

interface GetEventsParams {
  page?: number;
  per_page?: number;
  type?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
}

interface CreateEventRequest {
  title: string;
  description?: string;
  type: string;
  start_date: string;
  end_date?: string;
  location?: string;
  organizer_id: number;
}

interface UpdateEventRequest {
  title?: string;
  description?: string;
  type?: string;
  start_date?: string;
  end_date?: string;
  location?: string;
  status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

export const eventService = {
  getEvents: async (params?: GetEventsParams): Promise<EventListResponse> => {
    const response = await apiClient.get('/events/events', { params });
    return response.data;
  },

  getEventById: async (id: number): Promise<Event> => {
    const response = await apiClient.get(`/events/events/${id}`);
    return response.data;
  },

  createEvent: async (data: CreateEventRequest): Promise<{ message: string; event: Event }> => {
    const response = await apiClient.post('/events/events', data);
    return response.data;
  },

  updateEvent: async ({ id, data }: { id: number; data: UpdateEventRequest }): Promise<{ message: string; event: Event }> => {
    const response = await apiClient.put(`/events/events/${id}`, data);
    return response.data;
  },

  deleteEvent: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/events/events/${id}`);
    return response.data;
  },

  getUpcomingEvents: async (params?: { limit?: number }): Promise<EventListResponse> => {
    const response = await apiClient.get('/events/upcoming', { params });
    return response.data;
  },

  getCalendars: async (): Promise<CalendarListResponse> => {
    const response = await apiClient.get('/events/calendars');
    return response.data;
  },

  getCalendarById: async (id: number): Promise<Calendar> => {
    const response = await apiClient.get(`/events/calendars/${id}`);
    return response.data;
  },

  createCalendar: async (data: { name: string; description?: string; academic_year: string }): Promise<{ message: string; calendar: Calendar }> => {
    const response = await apiClient.post('/events/calendars', data);
    return response.data;
  },

  updateCalendar: async ({ id, data }: { id: number; data: Partial<{ name: string; description?: string; academic_year: string }> }): Promise<{ message: string; calendar: Calendar }> => {
    const response = await apiClient.put(`/events/calendars/${id}`, data);
    return response.data;
  },

  deleteCalendar: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/events/calendars/${id}`);
    return response.data;
  },
};

// 2. TanStack Query Hooks

export const useEvents = (params?: GetEventsParams) => {
  return useQuery({
    queryKey: ['events', params],
    queryFn: () => eventService.getEvents(params),
  });
};

export const useEvent = (id: number) => {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => eventService.getEventById(id),
    enabled: !!id,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: eventService.createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['upcomingEvents'] });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: eventService.updateEvent,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['upcomingEvents'] });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: eventService.deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['upcomingEvents'] });
    },
  });
};

export const useUpcomingEvents = (params?: { limit?: number }) => {
  return useQuery({
    queryKey: ['upcomingEvents', params],
    queryFn: () => eventService.getUpcomingEvents(params),
  });
};

export const useCalendars = () => {
  return useQuery({
    queryKey: ['calendars'],
    queryFn: eventService.getCalendars,
  });
};

export const useCalendar = (id: number) => {
  return useQuery({
    queryKey: ['calendar', id],
    queryFn: () => eventService.getCalendarById(id),
    enabled: !!id,
  });
};

export const useCreateCalendar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: eventService.createCalendar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendars'] });
    },
  });
};

