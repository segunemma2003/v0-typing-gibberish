import apiClient from './apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 1. Service Functions

interface MedicalRecord {
  id: number;
  student_id: number;
  visit_date: string;
  complaint: string;
  diagnosis?: string;
  treatment?: string;
  temperature?: number;
  blood_pressure?: string;
  notes?: string;
  created_at: string;
  student?: {
    id: number;
    name: string;
    admission_number: string;
    class?: string;
  };
}

interface Medication {
  id: number;
  student_id: number;
  medication_name: string;
  dosage: string;
  frequency: string;
  start_date: string;
  end_date?: string;
  times: string[]; // e.g., ["08:00", "14:00", "20:00"]
  status: 'active' | 'completed' | 'cancelled';
  notes?: string;
  student?: {
    id: number;
    name: string;
    admission_number: string;
  };
}

interface Vaccination {
  id: number;
  student_id: number;
  vaccine_name: string;
  dose_number: number;
  vaccination_date: string;
  next_dose_date?: string;
  administered_by: string;
  batch_number?: string;
  notes?: string;
  student?: {
    id: number;
    name: string;
    admission_number: string;
  };
}

interface MedicalSupply {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  min_quantity: number;
  expiry_date?: string;
  location?: string;
  supplier?: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

interface CreateMedicalRecordRequest {
  student_id: number;
  visit_date: string;
  complaint: string;
  diagnosis?: string;
  treatment?: string;
  temperature?: number;
  blood_pressure?: string;
  notes?: string;
}

interface CreateMedicationRequest {
  student_id: number;
  medication_name: string;
  dosage: string;
  frequency: string;
  start_date: string;
  end_date?: string;
  times: string[];
  notes?: string;
}

interface CreateVaccinationRequest {
  student_id: number;
  vaccine_name: string;
  dose_number: number;
  vaccination_date: string;
  next_dose_date?: string;
  batch_number?: string;
  notes?: string;
}

interface UseSupplyRequest {
  supply_id: number;
  quantity: number;
  reason: string;
  used_by: string;
}

interface RequestSupplyRequest {
  supply_name: string;
  quantity: number;
  priority: 'low' | 'medium' | 'high';
  reason: string;
}

export const healthService = {
  // Medical Records
  createMedicalRecord: async (data: CreateMedicalRecordRequest): Promise<{ message: string; record: MedicalRecord }> => {
    const response = await apiClient.post('/health/records', data);
    return response.data;
  },

  getStudentMedicalHistory: async (studentId: number): Promise<{
    student: {
      id: number;
      name: string;
      admission_number: string;
    };
    records: MedicalRecord[];
  }> => {
    const response = await apiClient.get(`/health/records/student/${studentId}`);
    return response.data;
  },

  getChronicConditions: async (): Promise<Array<{
    student: {
      id: number;
      name: string;
      admission_number: string;
      class?: string;
    };
    conditions: string[];
    medications?: string[];
    last_visit?: string;
  }>> => {
    const response = await apiClient.get('/health/students/chronic-conditions');
    return Array.isArray(response.data) ? response.data : (response.data?.data || []);
  },

  // Medication Management
  scheduleMedication: async (data: CreateMedicationRequest): Promise<{ message: string; medication: Medication }> => {
    const response = await apiClient.post('/health/medications', data);
    return response.data;
  },

  getTodayMedications: async (): Promise<Array<Medication & {
    due_times: string[];
    status: 'pending' | 'administered' | 'missed';
  }>> => {
    const response = await apiClient.get('/health/medications/today');
    return Array.isArray(response.data) ? response.data : (response.data?.data || []);
  },

  administerMedication: async (medicationId: number, data: {
    administered_at: string;
    notes?: string;
  }): Promise<{ message: string; medication: Medication }> => {
    const response = await apiClient.post(`/health/medications/${medicationId}/administer`, data);
    return response.data;
  },

  // Vaccination Management
  recordVaccination: async (data: CreateVaccinationRequest): Promise<{ message: string; vaccination: Vaccination }> => {
    const response = await apiClient.post('/health/vaccinations', data);
    return response.data;
  },

  getVaccinationSchedule: async (params?: { student_id?: number; upcoming?: boolean }): Promise<Array<Vaccination>> => {
    const response = await apiClient.get('/health/vaccinations/schedule', { params });
    return Array.isArray(response.data) ? response.data : (response.data?.data || []);
  },

  // Medical Supplies
  getSupplies: async (params?: { category?: string; status?: string }): Promise<Array<MedicalSupply>> => {
    const response = await apiClient.get('/health/supplies', { params });
    return Array.isArray(response.data) ? response.data : (response.data?.data || []);
  },

  useSupply: async (data: UseSupplyRequest): Promise<{ message: string; supply: MedicalSupply }> => {
    const response = await apiClient.post('/health/supplies/use', data);
    return response.data;
  },

  requestSupply: async (data: RequestSupplyRequest): Promise<{ message: string; request: any }> => {
    const response = await apiClient.post('/health/supplies/request', data);
    return response.data;
  },
};

// 2. TanStack Query Hooks

// Medical Records
export const useCreateMedicalRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: healthService.createMedicalRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicalRecords'] });
      queryClient.invalidateQueries({ queryKey: ['nurseDashboard'] });
    },
  });
};

export const useStudentMedicalHistory = (studentId: number) => {
  return useQuery({
    queryKey: ['studentMedicalHistory', studentId],
    queryFn: () => healthService.getStudentMedicalHistory(studentId),
    enabled: !!studentId,
  });
};

export const useChronicConditions = () => {
  return useQuery({
    queryKey: ['chronicConditions'],
    queryFn: healthService.getChronicConditions,
  });
};

// Medication Management
export const useScheduleMedication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: healthService.scheduleMedication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      queryClient.invalidateQueries({ queryKey: ['todayMedications'] });
    },
  });
};

export const useTodayMedications = () => {
  return useQuery({
    queryKey: ['todayMedications'],
    queryFn: healthService.getTodayMedications,
    refetchInterval: 60000, // Refetch every minute
  });
};

export const useAdministerMedication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ medicationId, data }: { medicationId: number; data: { administered_at: string; notes?: string } }) =>
      healthService.administerMedication(medicationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      queryClient.invalidateQueries({ queryKey: ['todayMedications'] });
    },
  });
};

// Vaccination Management
export const useRecordVaccination = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: healthService.recordVaccination,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaccinations'] });
      queryClient.invalidateQueries({ queryKey: ['vaccinationSchedule'] });
    },
  });
};

export const useVaccinationSchedule = (params?: { student_id?: number; upcoming?: boolean }) => {
  return useQuery({
    queryKey: ['vaccinationSchedule', params],
    queryFn: () => healthService.getVaccinationSchedule(params),
  });
};

// Medical Supplies
export const useSupplies = (params?: { category?: string; status?: string }) => {
  return useQuery({
    queryKey: ['medicalSupplies', params],
    queryFn: () => healthService.getSupplies(params),
  });
};

export const useUseSupply = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: healthService.useSupply,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicalSupplies'] });
    },
  });
};

export const useRequestSupply = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: healthService.requestSupply,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicalSupplies'] });
    },
  });
};
