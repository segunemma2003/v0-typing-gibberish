import apiClient from './apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 1. Service Functions

interface Guardian {
  id: number;
  school_id?: number;
  user_id?: number;
  first_name: string;
  last_name: string;
  middle_name?: string;
  name?: string; // Full name (computed)
  email: string;
  phone: string;
  address?: string;
  occupation?: string;
  employer?: string;
  relationship?: string;
  status?: 'active' | 'inactive';
  created_at: string;
  updated_at?: string;
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  students?: Array<{
    id: number;
    first_name: string;
    last_name: string;
    name?: string;
    admission_number?: string;
    email?: string;
    class?: {
      id: number;
      name: string;
    };
    arm?: {
      id: number;
      name: string;
    };
    user?: {
      id: number;
      name: string;
      email: string;
    };
    pivot?: {
      relationship: string;
      is_primary: boolean;
      emergency_contact: boolean;
    };
  }>;
}

interface GuardianListResponse {
  data: Guardian[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

interface GetGuardiansParams {
  page?: number;
  per_page?: number;
  search?: string;
  student_id?: number;
  status?: string;
}

interface CreateGuardianRequest {
  first_name: string;
  last_name: string;
  middle_name?: string;
  email: string;
  phone?: string;
  address?: string;
  occupation?: string;
  employer?: string;
  relationship_to_student?: string;
  emergency_contact?: string;
  // Legacy support
  name?: string;
  relationship?: string;
  student_ids?: number[];
}

interface UpdateGuardianRequest {
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  occupation?: string;
  employer?: string;
  status?: 'active' | 'inactive';
  // Legacy support
  name?: string;
  relationship?: string;
}

interface AssignStudentRequest {
  student_id: number;
  relationship: string;
  is_primary?: boolean;
  emergency_contact?: boolean;
}

interface GuardianListResponseWrapper {
  guardians?: GuardianListResponse;
  data?: Guardian[];
  current_page?: number;
  per_page?: number;
  total?: number;
}

export const guardianService = {
  getGuardians: async (params?: GetGuardiansParams): Promise<GuardianListResponse> => {
    const response = await apiClient.get('/guardians', { params });
    return response.data;
  },

  getGuardianById: async (id: number): Promise<Guardian> => {
    const response = await apiClient.get(`/guardians/${id}`);
    return response.data;
  },

  createGuardian: async (data: CreateGuardianRequest): Promise<{ message: string; guardian: Guardian }> => {
    const response = await apiClient.post('/guardians', data);
    return response.data;
  },

  updateGuardian: async ({ id, data }: { id: number; data: UpdateGuardianRequest }): Promise<{ message: string; guardian: Guardian }> => {
    const response = await apiClient.put(`/guardians/${id}`, data);
    return response.data;
  },

  deleteGuardian: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/guardians/${id}`);
    return response.data;
  },

  assignStudent: async ({ guardian_id, data }: { guardian_id: number; data: AssignStudentRequest }): Promise<{ message: string }> => {
    const response = await apiClient.post(`/guardians/${guardian_id}/assign-student`, data);
    return response.data;
  },

  removeStudent: async ({ guardian_id, student_id }: { guardian_id: number; student_id: number }): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/guardians/${guardian_id}/remove-student`, {
      data: { student_id }
    });
    return response.data;
  },

  getGuardianStudents: async (guardian_id: number): Promise<{ students: any[] }> => {
    const response = await apiClient.get(`/guardians/${guardian_id}/students`);
    return response.data;
  },

  getGuardianNotifications: async (guardian_id: number, params?: { page?: number; per_page?: number }): Promise<any> => {
    const response = await apiClient.get(`/guardians/${guardian_id}/notifications`, { params });
    return response.data;
  },

  getGuardianMessages: async (guardian_id: number, params?: { page?: number; per_page?: number }): Promise<any> => {
    const response = await apiClient.get(`/guardians/${guardian_id}/messages`, { params });
    return response.data;
  },

  getGuardianPayments: async (guardian_id: number, params?: { page?: number; per_page?: number }): Promise<any> => {
    const response = await apiClient.get(`/guardians/${guardian_id}/payments`, { params });
    return response.data;
  },

  // Legacy methods for backward compatibility
  linkStudentToGuardian: async ({ guardian_id, student_id }: { guardian_id: number; student_id: number }): Promise<{ message: string }> => {
    const response = await apiClient.post(`/guardians/${guardian_id}/students/${student_id}`);
    return response.data;
  },

  unlinkStudentFromGuardian: async ({ guardian_id, student_id }: { guardian_id: number; student_id: number }): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/guardians/${guardian_id}/students/${student_id}`);
    return response.data;
  },

  // Parent/Guardian specific endpoints
  getMyChildren: async (): Promise<{ guardian: any; children: any[] }> => {
    const response = await apiClient.get('/guardians/me/children');
    return response.data;
  },

  getMyProfile: async (): Promise<Guardian> => {
    const response = await apiClient.get('/guardians/me');
    return response.data;
  },

  updateMyProfile: async (data: UpdateGuardianRequest): Promise<{ message: string; guardian: Guardian }> => {
    const response = await apiClient.put('/guardians/me', data);
    return response.data;
  },

  uploadProfilePicture: async (data: { profile_picture: string }): Promise<{ message: string }> => {
    const response = await apiClient.post('/users/me/profile-picture', data);
    return response.data;
  },

  deleteProfilePicture: async (): Promise<{ message: string }> => {
    const response = await apiClient.delete('/users/me/profile-picture');
    return response.data;
  },
};

// 2. TanStack Query Hooks

export const useGuardians = (params?: GetGuardiansParams) => {
  return useQuery({
    queryKey: ['guardians', params],
    queryFn: async () => {
      const response = await guardianService.getGuardians(params);
      // Handle both response formats
      if (response.guardians) {
        return response.guardians;
      }
      return response;
    },
  });
};

export const useGuardian = (id: number) => {
  return useQuery({
    queryKey: ['guardian', id],
    queryFn: () => guardianService.getGuardianById(id),
    enabled: !!id,
  });
};

export const useCreateGuardian = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: guardianService.createGuardian,
    onSuccess: (data) => {
      console.log('Guardian created successfully', data);
      queryClient.invalidateQueries({ queryKey: ['guardians'] });
    },
  });
};

export const useUpdateGuardian = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: guardianService.updateGuardian,
    onSuccess: (data, variables) => {
      console.log('Guardian updated successfully', data);
      queryClient.invalidateQueries({ queryKey: ['guardians'] });
      queryClient.invalidateQueries({ queryKey: ['guardian', variables.id] });
    },
  });
};

export const useDeleteGuardian = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: guardianService.deleteGuardian,
    onSuccess: () => {
      console.log('Guardian deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['guardians'] });
    },
  });
};

export const useLinkStudentToGuardian = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: guardianService.linkStudentToGuardian,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guardians'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

export const useUnlinkStudentFromGuardian = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: guardianService.unlinkStudentFromGuardian,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guardians'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

export const useAssignStudentToGuardian = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: guardianService.assignStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guardians'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

export const useRemoveStudentFromGuardian = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: guardianService.removeStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guardians'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

export const useGuardianStudents = (guardian_id: number) => {
  return useQuery({
    queryKey: ['guardianStudents', guardian_id],
    queryFn: () => guardianService.getGuardianStudents(guardian_id),
    enabled: !!guardian_id,
  });
};

export const useGuardianNotifications = (guardian_id: number, params?: { page?: number; per_page?: number }) => {
  return useQuery({
    queryKey: ['guardianNotifications', guardian_id, params],
    queryFn: () => guardianService.getGuardianNotifications(guardian_id, params),
    enabled: !!guardian_id,
  });
};

export const useGuardianMessages = (guardian_id: number, params?: { page?: number; per_page?: number }) => {
  return useQuery({
    queryKey: ['guardianMessages', guardian_id, params],
    queryFn: () => guardianService.getGuardianMessages(guardian_id, params),
    enabled: !!guardian_id,
  });
};

export const useGuardianPayments = (guardian_id: number, params?: { page?: number; per_page?: number }) => {
  return useQuery({
    queryKey: ['guardianPayments', guardian_id, params],
    queryFn: () => guardianService.getGuardianPayments(guardian_id, params),
    enabled: !!guardian_id,
  });
};

// Parent/Guardian specific hooks
export const useMyChildren = () => {
  return useQuery({
    queryKey: ['myChildren'],
    queryFn: guardianService.getMyChildren,
  });
};

export const useMyProfile = () => {
  return useQuery({
    queryKey: ['myProfile'],
    queryFn: guardianService.getMyProfile,
  });
};

export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: guardianService.updateMyProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      queryClient.invalidateQueries({ queryKey: ['parentDashboard'] });
    },
  });
};

export const useUploadProfilePicture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: guardianService.uploadProfilePicture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      queryClient.invalidateQueries({ queryKey: ['parentDashboard'] });
    },
  });
};

export const useDeleteProfilePicture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: guardianService.deleteProfilePicture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      queryClient.invalidateQueries({ queryKey: ['parentDashboard'] });
    },
  });
};

