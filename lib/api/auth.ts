import apiClient from './apiClient';
import { useMutation, useQuery } from '@tanstack/react-query';

// 1. Service Functions

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status?: string;
  tenant?: { id: number; name: string; domain?: string };
}

interface AuthResponse {
  message: string;
  user: User;
  token: string;
  token_type: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest extends LoginRequest {
  name: string;
  password_confirmation: string;
  phone: string;
  role: string;
  tenant_id: number;
  school_id: number;
}

export const authService = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', data);
    // Store token on successful login
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  me: async (): Promise<User> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/logout');
    // Clear token on logout
    localStorage.removeItem('token');
    return response.data;
  },
};

// 2. TanStack Query Hooks

export const useRegister = () => {
  return useMutation({
    mutationFn: authService.register,
    // Optional: Invalidate queries or redirect on success
    onSuccess: (data) => {
      // For example, if you want to automatically log in after registration
      // queryClient.setQueryData(['user'], data.user);
      // localStorage.setItem('token', data.token);
      console.log('Registration successful', data);
    },
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: authService.login,
    // Optional: Invalidate queries or redirect on success
    onSuccess: (data) => {
      // queryClient.setQueryData(['user'], data.user);
      console.log('Login successful', data);
    },
  });
};

export const useMe = () => {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: authService.me,
    staleTime: 1000 * 60 * 5, // 5 minutes
    // You might want to enable this query only if a token exists
    enabled: !!localStorage.getItem('token'),
    // Optional: Handle redirection if unauthorized (e.g., in apiClient interceptor)
    onError: (error) => {
      console.error('Failed to fetch user data', error);
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Invalidate all queries related to user data after logout
      // queryClient.invalidateQueries(['user']);
      console.log('Logout successful');
      // Optionally, redirect to login page
      // window.location.href = '/login';
    },
  });
};
