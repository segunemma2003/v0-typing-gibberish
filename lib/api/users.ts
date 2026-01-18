import apiClient from './apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 1. Service Functions

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  phone?: string;
  profile_picture?: string;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

interface UserListResponse {
  data: User[];
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

interface GetUsersParams {
  page?: number;
  per_page?: number;
  role?: string;
  status?: 'active' | 'inactive' | 'suspended';
  search?: string;
}

interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  status?: 'active' | 'inactive' | 'suspended';
}

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: string;
  phone?: string;
}

interface AssignRoleRequest {
  role: string;
}

interface RemoveRoleRequest {
  role: string;
}

export const userService = {
  getUsers: async (params?: GetUsersParams): Promise<UserListResponse> => {
    const response = await apiClient.get('/users', { params });
    return response.data;
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (data: CreateUserRequest): Promise<{ message: string; data: User }> => {
    const response = await apiClient.post('/users', data);
    return response.data;
  },

  updateUser: async ({ id, data }: { id: number; data: UpdateUserRequest }): Promise<{ message: string; user: User }> => {
    const response = await apiClient.put(`/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },

  activateUser: async (id: number): Promise<{ message: string; user: User }> => {
    const response = await apiClient.post(`/users/${id}/activate`);
    return response.data;
  },

  suspendUser: async (id: number): Promise<{ message: string; user: User }> => {
    const response = await apiClient.post(`/users/${id}/suspend`);
    return response.data;
  },

  // Role Management
  getAvailableRoles: async (): Promise<{ roles: Record<string, string> }> => {
    const response = await apiClient.get('/roles');
    return response.data;
  },

  assignRole: async ({ id, data }: { id: number; data: AssignRoleRequest }): Promise<{ message: string }> => {
    const response = await apiClient.post(`/users/${id}/assign-role`, data);
    return response.data;
  },

  removeRole: async ({ id, data }: { id: number; data: RemoveRoleRequest }): Promise<{ message: string }> => {
    const response = await apiClient.post(`/users/${id}/remove-role`, data);
    return response.data;
  },

  // Profile Picture Management
  uploadProfilePicture: async (file: File): Promise<{ message: string; profile_picture: string }> => {
    const formData = new FormData();
    formData.append('profile_picture', file);
    const response = await apiClient.post('/users/me/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  uploadUserProfilePicture: async ({ id, file }: { id: number; file: File }): Promise<{ message: string; profile_picture: string }> => {
    const formData = new FormData();
    formData.append('profile_picture', file);
    const response = await apiClient.post(`/users/${id}/profile-picture`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteProfilePicture: async (): Promise<{ message: string }> => {
    const response = await apiClient.delete('/users/me/profile-picture');
    return response.data;
  },

  deleteUserProfilePicture: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/users/${id}/profile-picture`);
    return response.data;
  },
};

// 2. TanStack Query Hooks

export const useUsers = (params?: GetUsersParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userService.getUsers(params),
  });
};

export const useUser = (id: number) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getUserById(id),
    enabled: !!id, // Only run query if ID is provided
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.updateUser,
    onSuccess: (data, variables) => {
      console.log('User updated successfully', data);
      // Invalidate relevant queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      console.log('User deleted successfully');
      // Invalidate relevant queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useActivateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.activateUser,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables] });
    },
  });
};

export const useSuspendUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.suspendUser,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables] });
    },
  });
};

// Role Management Hooks
export const useAvailableRoles = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: () => userService.getAvailableRoles(),
  });
};

export const useAssignRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.assignRole,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
    },
  });
};

export const useRemoveRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.removeRole,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
    },
  });
};

// Profile Picture Hooks
export const useUploadProfilePicture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.uploadProfilePicture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
    },
  });
};

export const useUploadUserProfilePicture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.uploadUserProfilePicture,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
    },
  });
};

export const useDeleteProfilePicture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.deleteProfilePicture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
    },
  });
};

export const useDeleteUserProfilePicture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.deleteUserProfilePicture,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables] });
    },
  });
};
