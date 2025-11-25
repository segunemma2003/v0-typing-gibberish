import apiClient from './apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 1. Service Functions

interface TimetableEntry {
  id: number;
  class_id: number;
  subject_id: number;
  teacher_id: number;
  day: string;
  start_time: string;
  end_time: string;
  room?: string;
  created_at: string;
  updated_at?: string;
}

interface TimetableListResponse {
  data: TimetableEntry[];
}

interface GetTimetableParams {
  class_id?: number;
  teacher_id?: number;
  day?: string;
}

interface CreateTimetableRequest {
  class_id: number;
  subject_id: number;
  teacher_id: number;
  day: string;
  start_time: string;
  end_time: string;
  room?: string;
}

interface UpdateTimetableRequest {
  class_id?: number;
  subject_id?: number;
  teacher_id?: number;
  day?: string;
  start_time?: string;
  end_time?: string;
  room?: string;
}

export const timetableService = {
  getTimetable: async (params?: GetTimetableParams): Promise<TimetableListResponse> => {
    const response = await apiClient.get('/timetable', { params });
    return response.data;
  },

  getTimetableById: async (id: number): Promise<TimetableEntry> => {
    const response = await apiClient.get(`/timetable/${id}`);
    return response.data;
  },

  getClassTimetable: async (classId: number): Promise<TimetableListResponse> => {
    const response = await apiClient.get(`/timetable/class/${classId}`);
    return response.data;
  },

  getTeacherTimetable: async (teacherId: number): Promise<TimetableListResponse> => {
    const response = await apiClient.get(`/timetable/teacher/${teacherId}`);
    return response.data;
  },

  getMyTimetable: async (): Promise<{
    student: { id: number; name: string; admission_number: string };
    class: { id: number; name: string };
    timetable: Array<{
      day: string;
      periods: Array<{
        period: number;
        time: string;
        subject: string;
        teacher: string;
        room?: string;
      }>;
    }>;
  }> => {
    const response = await apiClient.get('/timetable/student/me');
    return response.data;
  },

  createTimetable: async (data: CreateTimetableRequest): Promise<{ message: string; timetable: TimetableEntry }> => {
    const response = await apiClient.post('/timetable', data);
    return response.data;
  },

  updateTimetable: async ({ id, data }: { id: number; data: UpdateTimetableRequest }): Promise<{ message: string; timetable: TimetableEntry }> => {
    const response = await apiClient.put(`/timetable/${id}`, data);
    return response.data;
  },

  deleteTimetable: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/timetable/${id}`);
    return response.data;
  },
};

// 2. TanStack Query Hooks

export const useTimetable = (params?: GetTimetableParams) => {
  return useQuery({
    queryKey: ['timetable', params],
    queryFn: () => timetableService.getTimetable(params),
  });
};

export const useTimetableEntry = (id: number) => {
  return useQuery({
    queryKey: ['timetable', id],
    queryFn: () => timetableService.getTimetableById(id),
    enabled: !!id,
  });
};

export const useClassTimetable = (classId: number) => {
  return useQuery({
    queryKey: ['classTimetable', classId],
    queryFn: () => timetableService.getClassTimetable(classId),
    enabled: !!classId,
  });
};

export const useTeacherTimetable = (teacherId: number) => {
  return useQuery({
    queryKey: ['teacherTimetable', teacherId],
    queryFn: () => timetableService.getTeacherTimetable(teacherId),
    enabled: !!teacherId,
  });
};

export const useMyTimetable = () => {
  return useQuery({
    queryKey: ['myTimetable'],
    queryFn: () => timetableService.getMyTimetable(),
  });
};

export const useCreateTimetable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: timetableService.createTimetable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetable'] });
    },
  });
};

export const useUpdateTimetable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: timetableService.updateTimetable,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['timetable'] });
      queryClient.invalidateQueries({ queryKey: ['timetable', variables.id] });
    },
  });
};

export const useDeleteTimetable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: timetableService.deleteTimetable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetable'] });
    },
  });
};

