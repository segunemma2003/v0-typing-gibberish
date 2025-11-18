import apiClient from "./apiClient";
import { useMutation, useQuery } from "@tanstack/react-query";

// 1. Service Functions

export interface ApiTenantSummary {
  id: number;
  name: string;
  domain?: string | null;
}

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status?: string | null;
  avatar?: string | null;
  tenant?: ApiTenantSummary | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface AuthResponse {
  message: string;
  user: ApiUser;
  token: string;
  token_type: string;
}

export interface LoginRequest {
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
    const response = await apiClient.post("/auth/register", data);
    // Store token on successful registration
    if (response.data.token) {
      if (typeof window !== "undefined") {
        localStorage.setItem("token", response.data.token);
        console.log("✅ Token stored after registration");
      }
    }
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/login", data);
    // Store token on successful login
    if (response.data.token) {
      if (typeof window !== "undefined") {
        localStorage.setItem("token", response.data.token);
        console.log(
          "✅ Token stored in localStorage:",
          response.data.token.substring(0, 20) + "...",
        );
      }
    } else {
      console.warn("⚠️ No token in login response");
    }
    return response.data;
  },

  me: async (): Promise<ApiUser> => {
    const response = await apiClient.get("/auth/me");
    // API returns { user: {...} } but we want just the user object
    return response.data.user || response.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await apiClient.post("/auth/logout");
    // Clear token on logout
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      console.log("✅ Token cleared from localStorage");
    }
    return response.data;
  },

  forgotPassword: async (data: { email: string; tenant_id?: string }): Promise<{ message: string; token?: string }> => {
    const response = await apiClient.post("/auth/forgot-password", data);
    return response.data;
  },

  resetPassword: async (data: { email: string; token: string; password: string; password_confirmation: string; tenant_id?: string }): Promise<{ message: string }> => {
    const response = await apiClient.post("/auth/reset-password", data);
    return response.data;
  },

  refreshToken: async (): Promise<{ token: string; token_type: string }> => {
    const response = await apiClient.post("/auth/refresh-token");
    // Update token if refresh successful
    if (response.data.token) {
      if (typeof window !== "undefined") {
        localStorage.setItem("token", response.data.token);
      }
    }
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
      console.log("Registration successful", data);
    },
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: authService.login,
    // Optional: Invalidate queries or redirect on success
    onSuccess: (data) => {
      // queryClient.setQueryData(['user'], data.user);
      console.log("Login successful", data);
    },
  });
};

export const useMe = () => {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: authService.me,
    staleTime: 1000 * 60 * 5, // 5 minutes
    // You might want to enable this query only if a token exists
    enabled: typeof window !== "undefined" ? !!localStorage.getItem("token") : false,
    retry: false, // Don't retry on error to avoid infinite loops
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Invalidate all queries related to user data after logout
      // queryClient.invalidateQueries(['user']);
      console.log("Logout successful");
      // Optionally, redirect to login page
      // window.location.href = '/login';
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authService.forgotPassword,
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: authService.resetPassword,
  });
};

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: authService.refreshToken,
  });
};
