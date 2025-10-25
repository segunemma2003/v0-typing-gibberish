import apiClient from './apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 1. Service Functions

interface PrincipalInfo {
  id: number;
  name: string;
}

interface School {
  id: number;
  name: string;
  domain: string;
  address: string;
  phone: string;
  email: string;
  principal: PrincipalInfo;
  student_count: number;
  teacher_count: number;
  status: string;
}

interface SchoolListResponse {
  data: School[];
}

interface CreateSchoolRequest {
  name: string;
  domain: string;
  address: string;
  phone: string;
  email: string;
  principal_id: number;
}

interface BulkStudentRegistrationRequest {
  students: Array<{ // Simplified for example, full student create request fields would go here
    name: string;
    class_id: number;
    arm_id: number;
    guardian_id: number;
    date_of_birth: string;
    gender: string;
  }>;
}

interface BulkStudentRegistrationResult {
  name: string;
  admission_number: string;
  email: string;
  username: string;
  status: string;
}

interface BulkStudentRegistrationResponse {
  message: string;
  results: {
    successful: number;
    failed: number;
    students: BulkStudentRegistrationResult[];
  };
}

export const adminService = {
  // Schools Management
  getSchools: async (): Promise<SchoolListResponse> => {
    const response = await apiClient.get('/schools');
    return response.data;
  },

  createSchool: async (data: CreateSchoolRequest): Promise<{ message: string; school: School }> => {
    const response = await apiClient.post('/schools', data);
    return response.data;
  },

  // Bulk Operations
  bulkStudentRegistration: async (data: BulkStudentRegistrationRequest): Promise<BulkStudentRegistrationResponse> => {
    const response = await apiClient.post('/bulk/students', data);
    return response.data;
  },
};

// 2. TanStack Query Hooks

// Schools
export const useSchools = () => {
  return useQuery({
    queryKey: ['schools'],
    queryFn: adminService.getSchools,
  });
};

export const useCreateSchool = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminService.createSchool,
    onSuccess: (data) => {
      console.log('School created successfully', data);
      queryClient.invalidateQueries({ queryKey: ['schools'] });
    },
  });
};

// Bulk Operations
export const useBulkStudentRegistration = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminService.bulkStudentRegistration,
    onSuccess: (data) => {
      console.log('Bulk student registration completed', data);
      // Invalidate students list as new students might have been added
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};
