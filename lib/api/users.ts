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
  phone?: string;
  status?: 'active' | 'inactive' | 'suspended
';
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

  updateUser: async ({ id, data }: { id: number; data: UpdateUserRequest }): Promise<{ message: string; user: User }> => {
    const response = await apiClient.put(`/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/users/${id}`);
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
