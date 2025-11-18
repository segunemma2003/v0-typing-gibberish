import apiClient from './apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 1. Service Functions

interface TransportRoute {
  id: number;
  name: string;
  start_location: string;
  end_location: string;
  distance?: number;
  estimated_time?: string;
  fare?: number;
  status: 'active' | 'inactive';
  created_at: string;
}

interface Vehicle {
  id: number;
  registration_number: string;
  make: string;
  model: string;
  year?: number;
  capacity: number;
  driver_id?: number;
  route_id?: number;
  status: 'active' | 'maintenance' | 'inactive';
  created_at: string;
}

interface Driver {
  id: number;
  name: string;
  license_number: string;
  phone: string;
  email?: string;
  vehicle_id?: number;
  status: 'active' | 'inactive';
  created_at: string;
}

interface StudentTransport {
  id: number;
  student_id: number;
  student: {
    id: number;
    name: string;
    admission_number: string;
  };
  route_id: number;
  route: TransportRoute;
  vehicle_id?: number;
  pickup_location?: string;
  dropoff_location?: string;
  status: 'active' | 'inactive';
  created_at: string;
}

interface RouteListResponse {
  data: TransportRoute[];
}

interface VehicleListResponse {
  data: Vehicle[];
}

interface DriverListResponse {
  data: Driver[];
}

interface StudentTransportListResponse {
  data: StudentTransport[];
}

interface CreateRouteRequest {
  name: string;
  start_location: string;
  end_location: string;
  distance?: number;
  estimated_time?: string;
  fare?: number;
}

interface CreateVehicleRequest {
  registration_number: string;
  make: string;
  model: string;
  year?: number;
  capacity: number;
  driver_id?: number;
  route_id?: number;
}

interface CreateDriverRequest {
  name: string;
  license_number: string;
  phone: string;
  email?: string;
}

interface AssignStudentRequest {
  student_id: number;
  route_id: number;
  vehicle_id?: number;
  pickup_location?: string;
  dropoff_location?: string;
}

export const transportService = {
  getRoutes: async (): Promise<RouteListResponse> => {
    const response = await apiClient.get('/transport/routes');
    return response.data;
  },

  getRouteById: async (id: number): Promise<TransportRoute> => {
    const response = await apiClient.get(`/transport/routes/${id}`);
    return response.data;
  },

  createRoute: async (data: CreateRouteRequest): Promise<{ message: string; route: TransportRoute }> => {
    const response = await apiClient.post('/transport/routes', data);
    return response.data;
  },

  updateRoute: async ({ id, data }: { id: number; data: Partial<CreateRouteRequest> }): Promise<{ message: string; route: TransportRoute }> => {
    const response = await apiClient.put(`/transport/routes/${id}`, data);
    return response.data;
  },

  deleteRoute: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/transport/routes/${id}`);
    return response.data;
  },

  getVehicles: async (): Promise<VehicleListResponse> => {
    const response = await apiClient.get('/transport/vehicles');
    return response.data;
  },

  getVehicleById: async (id: number): Promise<Vehicle> => {
    const response = await apiClient.get(`/transport/vehicles/${id}`);
    return response.data;
  },

  createVehicle: async (data: CreateVehicleRequest): Promise<{ message: string; vehicle: Vehicle }> => {
    const response = await apiClient.post('/transport/vehicles', data);
    return response.data;
  },

  updateVehicle: async ({ id, data }: { id: number; data: Partial<CreateVehicleRequest> }): Promise<{ message: string; vehicle: Vehicle }> => {
    const response = await apiClient.put(`/transport/vehicles/${id}`, data);
    return response.data;
  },

  deleteVehicle: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/transport/vehicles/${id}`);
    return response.data;
  },

  getDrivers: async (): Promise<DriverListResponse> => {
    const response = await apiClient.get('/transport/drivers');
    return response.data;
  },

  getDriverById: async (id: number): Promise<Driver> => {
    const response = await apiClient.get(`/transport/drivers/${id}`);
    return response.data;
  },

  createDriver: async (data: CreateDriverRequest): Promise<{ message: string; driver: Driver }> => {
    const response = await apiClient.post('/transport/drivers', data);
    return response.data;
  },

  updateDriver: async ({ id, data }: { id: number; data: Partial<CreateDriverRequest> }): Promise<{ message: string; driver: Driver }> => {
    const response = await apiClient.put(`/transport/drivers/${id}`, data);
    return response.data;
  },

  deleteDriver: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/transport/drivers/${id}`);
    return response.data;
  },

  getStudentTransport: async (params?: { student_id?: number; route_id?: number }): Promise<StudentTransportListResponse> => {
    const response = await apiClient.get('/transport/students', { params });
    return response.data;
  },

  assignStudent: async (data: AssignStudentRequest): Promise<{ message: string; transport: StudentTransport }> => {
    const response = await apiClient.post('/transport/assign', data);
    return response.data;
  },

  getSecurePickup: async (): Promise<{ data: any }> => {
    const response = await apiClient.get('/transport/pickup/secure');
    return response.data;
  },
};

// 2. TanStack Query Hooks

export const useTransportRoutes = () => {
  return useQuery({
    queryKey: ['transportRoutes'],
    queryFn: transportService.getRoutes,
  });
};

export const useTransportRoute = (id: number) => {
  return useQuery({
    queryKey: ['transportRoute', id],
    queryFn: () => transportService.getRouteById(id),
    enabled: !!id,
  });
};

export const useCreateTransportRoute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: transportService.createRoute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transportRoutes'] });
    },
  });
};

export const useVehicles = () => {
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: transportService.getVehicles,
  });
};

export const useVehicle = (id: number) => {
  return useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => transportService.getVehicleById(id),
    enabled: !!id,
  });
};

export const useCreateVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: transportService.createVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};

export const useDrivers = () => {
  return useQuery({
    queryKey: ['drivers'],
    queryFn: transportService.getDrivers,
  });
};

export const useCreateDriver = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: transportService.createDriver,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
    },
  });
};

export const useStudentTransport = (params?: { student_id?: number; route_id?: number }) => {
  return useQuery({
    queryKey: ['studentTransport', params],
    queryFn: () => transportService.getStudentTransport(params),
  });
};

export const useAssignStudentTransport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: transportService.assignStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentTransport'] });
    },
  });
};

