import apiClient from './apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 1. Service Functions

interface House {
  id: number;
  name: string;
  color: string;
  description?: string;
  total_points: number;
  member_count: number;
  created_at: string;
}

interface HouseMember {
  id: number;
  house_id: number;
  student_id: number;
  student: {
    id: number;
    name: string;
    admission_number: string;
  };
  role?: string;
  joined_at: string;
}

interface HousePoint {
  id: number;
  house_id: number;
  student_id?: number;
  points: number;
  reason: string;
  awarded_by: number;
  created_at: string;
}

interface HouseCompetition {
  id: number;
  name: string;
  description: string;
  date: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  results?: {
    house_id: number;
    house_name: string;
    position: number;
    points: number;
  }[];
}

interface HouseListResponse {
  data: House[];
}

interface GetHousesParams {
  search?: string;
}

interface CreateHouseRequest {
  name: string;
  color: string;
  description?: string;
}

interface UpdateHouseRequest {
  name?: string;
  color?: string;
  description?: string;
}

interface AddHousePointsRequest {
  student_id?: number;
  points: number;
  reason: string;
}

export const houseService = {
  getHouses: async (params?: GetHousesParams): Promise<HouseListResponse> => {
    const response = await apiClient.get('/houses', { params });
    return response.data;
  },

  getHouseById: async (id: number): Promise<House> => {
    const response = await apiClient.get(`/houses/${id}`);
    return response.data;
  },

  createHouse: async (data: CreateHouseRequest): Promise<{ message: string; house: House }> => {
    const response = await apiClient.post('/houses', data);
    return response.data;
  },

  updateHouse: async ({ id, data }: { id: number; data: UpdateHouseRequest }): Promise<{ message: string; house: House }> => {
    const response = await apiClient.put(`/houses/${id}`, data);
    return response.data;
  },

  deleteHouse: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/houses/${id}`);
    return response.data;
  },

  getHouseMembers: async (id: number): Promise<{ data: HouseMember[] }> => {
    const response = await apiClient.get(`/houses/${id}/members`);
    return response.data;
  },

  addHousePoints: async ({ id, data }: { id: number; data: AddHousePointsRequest }): Promise<{ message: string; point: HousePoint }> => {
    const response = await apiClient.post(`/houses/${id}/points`, data);
    return response.data;
  },

  getHousePoints: async (id: number, params?: { start_date?: string; end_date?: string }): Promise<{ data: HousePoint[] }> => {
    const response = await apiClient.get(`/houses/${id}/points`, { params });
    return response.data;
  },

  getHouseCompetitions: async (): Promise<{ data: HouseCompetition[] }> => {
    const response = await apiClient.get('/houses/competitions');
    return response.data;
  },
};

// 2. TanStack Query Hooks

export const useHouses = (params?: GetHousesParams) => {
  return useQuery({
    queryKey: ['houses', params],
    queryFn: () => houseService.getHouses(params),
  });
};

export const useHouse = (id: number) => {
  return useQuery({
    queryKey: ['house', id],
    queryFn: () => houseService.getHouseById(id),
    enabled: !!id,
  });
};

export const useCreateHouse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: houseService.createHouse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['houses'] });
    },
  });
};

export const useUpdateHouse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: houseService.updateHouse,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['houses'] });
      queryClient.invalidateQueries({ queryKey: ['house', variables.id] });
    },
  });
};

export const useDeleteHouse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: houseService.deleteHouse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['houses'] });
    },
  });
};

export const useHouseMembers = (id: number) => {
  return useQuery({
    queryKey: ['houseMembers', id],
    queryFn: () => houseService.getHouseMembers(id),
    enabled: !!id,
  });
};

export const useAddHousePoints = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: houseService.addHousePoints,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['house', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['housePoints', variables.id] });
    },
  });
};

export const useHousePoints = (id: number, params?: { start_date?: string; end_date?: string }) => {
  return useQuery({
    queryKey: ['housePoints', id, params],
    queryFn: () => houseService.getHousePoints(id, params),
    enabled: !!id,
  });
};

export const useHouseCompetitions = () => {
  return useQuery({
    queryKey: ['houseCompetitions'],
    queryFn: houseService.getHouseCompetitions,
  });
};

