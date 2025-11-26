import apiClient from './apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 1. Service Functions

interface Visitor {
  id: number;
  name: string;
  phone: string;
  purpose: string;
  person_to_see: string;
  id_type?: string;
  id_number?: string;
  vehicle_number?: string;
  entry_time: string;
  exit_time?: string;
  status: 'active' | 'checked_out';
  checked_out_by?: string;
}

interface GatePass {
  id: number;
  code: string;
  student_id: number;
  student?: {
    id: number;
    name: string;
    admission_number: string;
    class?: string;
  };
  reason: string;
  exit_time: string;
  expected_return?: string;
  actual_return?: string;
  guardian_phone?: string;
  status: 'active' | 'used' | 'expired';
  issued_by: string;
  issued_at: string;
}

interface Incident {
  id: number;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  description: string;
  reported_time: string;
  reported_by: string;
  witnesses?: string[];
  action_taken?: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  resolved_at?: string;
}

interface Vehicle {
  id: number;
  vehicle_number: string;
  owner_name?: string;
  owner_phone?: string;
  vehicle_type?: string;
  entry_time: string;
  exit_time?: string;
  status: 'on_campus' | 'exited';
  purpose?: string;
}

interface PatrolCheck {
  id: number;
  checkpoint: string;
  location: string;
  checked_at: string;
  checked_by: string;
  status: 'normal' | 'issue';
  notes?: string;
}

interface PatrolSchedule {
  id: number;
  checkpoint: string;
  location: string;
  scheduled_time: string;
  frequency: string;
  assigned_to: string;
  status: 'pending' | 'completed' | 'missed';
}

interface LostAndFound {
  id: number;
  item_name: string;
  description: string;
  location_found: string;
  found_date: string;
  found_by: string;
  claimed_by?: string;
  claimed_date?: string;
  status: 'lost' | 'found' | 'claimed';
  category?: string;
}

interface RegisterVisitorRequest {
  name: string;
  phone: string;
  purpose: string;
  person_to_see: string;
  id_type?: string;
  id_number?: string;
  vehicle_number?: string;
  entry_time: string;
}

interface IssueGatePassRequest {
  student_id: number;
  reason: string;
  exit_time: string;
  expected_return?: string;
  guardian_phone?: string;
}

interface ReportIncidentRequest {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  description: string;
  reported_time: string;
  witnesses?: string[];
  action_taken?: string;
}

interface LogVehicleEntryRequest {
  vehicle_number: string;
  owner_name?: string;
  owner_phone?: string;
  vehicle_type?: string;
  purpose?: string;
  entry_time: string;
}

interface LogVehicleExitRequest {
  vehicle_id: number;
  exit_time: string;
}

interface RecordPatrolCheckRequest {
  checkpoint: string;
  location: string;
  checked_at: string;
  status: 'normal' | 'issue';
  notes?: string;
}

interface RegisterLostItemRequest {
  item_name: string;
  description: string;
  location_found: string;
  found_date: string;
  category?: string;
}

export const securityService = {
  // Visitor Management
  registerVisitor: async (data: RegisterVisitorRequest): Promise<{ message: string; visitor: Visitor }> => {
    const response = await apiClient.post('/security/visitors', data);
    return response.data;
  },

  getActiveVisitors: async (): Promise<Array<Visitor>> => {
    const response = await apiClient.get('/security/visitors/active');
    return Array.isArray(response.data) ? response.data : (response.data?.data || []);
  },

  checkoutVisitor: async (visitorId: number, data?: { exit_time?: string }): Promise<{ message: string; visitor: Visitor }> => {
    const response = await apiClient.post(`/security/visitors/${visitorId}/checkout`, data);
    return response.data;
  },

  // Gate Pass Management
  issueGatePass: async (data: IssueGatePassRequest): Promise<{ message: string; gate_pass: GatePass }> => {
    const response = await apiClient.post('/security/gate-passes', data);
    return response.data;
  },

  verifyGatePass: async (code: string): Promise<{ valid: boolean; gate_pass: GatePass }> => {
    const response = await apiClient.get(`/security/gate-passes/${code}/verify`);
    return response.data;
  },

  // Incident Management
  reportIncident: async (data: ReportIncidentRequest): Promise<{ message: string; incident: Incident }> => {
    const response = await apiClient.post('/security/incidents', data);
    return response.data;
  },

  getIncidents: async (params?: { status?: string; severity?: string; from?: string; to?: string }): Promise<Array<Incident>> => {
    const response = await apiClient.get('/security/incidents', { params });
    return Array.isArray(response.data) ? response.data : (response.data?.data || []);
  },

  // Vehicle Management
  logVehicleEntry: async (data: LogVehicleEntryRequest): Promise<{ message: string; vehicle: Vehicle }> => {
    const response = await apiClient.post('/security/vehicles/entry', data);
    return response.data;
  },

  logVehicleExit: async (data: LogVehicleExitRequest): Promise<{ message: string; vehicle: Vehicle }> => {
    const response = await apiClient.post('/security/vehicles/exit', data);
    return response.data;
  },

  getVehiclesOnCampus: async (): Promise<Array<Vehicle>> => {
    const response = await apiClient.get('/security/vehicles/on-campus');
    return Array.isArray(response.data) ? response.data : (response.data?.data || []);
  },

  // Patrol Management
  recordPatrolCheck: async (data: RecordPatrolCheckRequest): Promise<{ message: string; patrol: PatrolCheck }> => {
    const response = await apiClient.post('/security/patrols/check', data);
    return response.data;
  },

  getPatrolSchedule: async (): Promise<Array<PatrolSchedule>> => {
    const response = await apiClient.get('/security/patrols/schedule');
    return Array.isArray(response.data) ? response.data : (response.data?.data || []);
  },

  // Lost and Found
  registerLostItem: async (data: RegisterLostItemRequest): Promise<{ message: string; item: LostAndFound }> => {
    const response = await apiClient.post('/security/lost-and-found', data);
    return response.data;
  },

  getLostItems: async (params?: { status?: string; category?: string }): Promise<Array<LostAndFound>> => {
    const response = await apiClient.get('/security/lost-and-found', { params });
    return Array.isArray(response.data) ? response.data : (response.data?.data || []);
  },

  markItemAsFound: async (itemId: number, data: { claimed_by: string; claimed_date: string }): Promise<{ message: string; item: LostAndFound }> => {
    const response = await apiClient.post(`/security/lost-and-found/${itemId}/found`, data);
    return response.data;
  },
};

// 2. TanStack Query Hooks

// Visitor Management
export const useRegisterVisitor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: securityService.registerVisitor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeVisitors'] });
      queryClient.invalidateQueries({ queryKey: ['securityDashboard'] });
    },
  });
};

export const useActiveVisitors = () => {
  return useQuery({
    queryKey: ['activeVisitors'],
    queryFn: securityService.getActiveVisitors,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useCheckoutVisitor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ visitorId, data }: { visitorId: number; data?: { exit_time?: string } }) =>
      securityService.checkoutVisitor(visitorId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeVisitors'] });
      queryClient.invalidateQueries({ queryKey: ['securityDashboard'] });
    },
  });
};

// Gate Pass Management
export const useIssueGatePass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: securityService.issueGatePass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gatePasses'] });
      queryClient.invalidateQueries({ queryKey: ['securityDashboard'] });
    },
  });
};

export const useVerifyGatePass = (code: string) => {
  return useQuery({
    queryKey: ['verifyGatePass', code],
    queryFn: () => securityService.verifyGatePass(code),
    enabled: !!code && code.length > 0,
  });
};

// Incident Management
export const useReportIncident = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: securityService.reportIncident,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      queryClient.invalidateQueries({ queryKey: ['securityDashboard'] });
    },
  });
};

export const useIncidents = (params?: { status?: string; severity?: string; from?: string; to?: string }) => {
  return useQuery({
    queryKey: ['incidents', params],
    queryFn: () => securityService.getIncidents(params),
  });
};

// Vehicle Management
export const useLogVehicleEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: securityService.logVehicleEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehiclesOnCampus'] });
      queryClient.invalidateQueries({ queryKey: ['securityDashboard'] });
    },
  });
};

export const useLogVehicleExit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: securityService.logVehicleExit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehiclesOnCampus'] });
      queryClient.invalidateQueries({ queryKey: ['securityDashboard'] });
    },
  });
};

export const useVehiclesOnCampus = () => {
  return useQuery({
    queryKey: ['vehiclesOnCampus'],
    queryFn: securityService.getVehiclesOnCampus,
    refetchInterval: 60000, // Refetch every minute
  });
};

// Patrol Management
export const useRecordPatrolCheck = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: securityService.recordPatrolCheck,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patrolSchedule'] });
      queryClient.invalidateQueries({ queryKey: ['securityDashboard'] });
    },
  });
};

export const usePatrolSchedule = () => {
  return useQuery({
    queryKey: ['patrolSchedule'],
    queryFn: securityService.getPatrolSchedule,
  });
};

// Lost and Found
export const useRegisterLostItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: securityService.registerLostItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lostAndFound'] });
    },
  });
};

export const useLostItems = (params?: { status?: string; category?: string }) => {
  return useQuery({
    queryKey: ['lostAndFound', params],
    queryFn: () => securityService.getLostItems(params),
  });
};

export const useMarkItemAsFound = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, data }: { itemId: number; data: { claimed_by: string; claimed_date: string } }) =>
      securityService.markItemAsFound(itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lostAndFound'] });
    },
  });
};

