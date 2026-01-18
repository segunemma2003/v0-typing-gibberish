import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// SuperAdmin API Client - Does NOT add X-Subdomain header
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.compasse.net';

const getBaseURL = () => {
  const base = API_BASE_URL.replace(/\/$/, '');
  if (!base.includes('/api/v1')) {
    return `${base}/api/v1`;
  }
  return base;
};

// Create a separate API client for SuperAdmin that doesn't add X-Subdomain header
const superAdminApiClient = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for SuperAdmin - NO X-Subdomain header
superAdminApiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      // SuperAdmin does NOT use X-Subdomain header
      // Do NOT add X-Tenant-ID or X-Subdomain headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
superAdminApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // Handle unauthorized - redirect to login
        console.error('SuperAdmin unauthorized - redirecting to login');
      }
    }
    return Promise.reject(error);
  }
);

// 1. Service Functions

interface SuperAdminUser {
  id: number;
  tenant_id: null;
  name: string;
  email: string;
  role: 'super_admin';
  status: 'active';
  last_login_at: string;
}

interface LoginResponse {
  message: string;
  user: SuperAdminUser;
  token: string;
  token_type: 'Bearer';
}

interface School {
  id: number;
  tenant_id: string;
  name: string;
  code: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo?: string;
  status: 'active' | 'suspended' | 'inactive';
  created_at: string;
  updated_at: string;
  tenant?: {
    id: string;
    name: string;
    subdomain: string;
    database_name: string;
    status: string;
    created_at: string;
  };
}

interface SchoolListResponse {
  current_page: number;
  data: School[];
  first_page_url: string;
  last_page: number;
  per_page: number;
  total: number;
}

interface CreateSchoolRequest {
  name: string;
  subdomain: string;
  email: string;
  phone?: string;
  address?: string;
  admin_name: string;
  admin_email: string;
  admin_password: string;
}

interface CreateSchoolResponse {
  message: string;
  school: School;
  tenant: {
    id: string;
    subdomain: string;
    database_name: string;
  };
  admin: {
    name: string;
    email: string;
    password: string;
  };
}

interface SchoolStats {
  stats: {
    school_name: string;
    status: string;
    subdomain: string;
    created_at: string;
    updated_at: string;
    tenant_status: string;
    database_name: string;
  };
}

interface SchoolDashboard {
  school: School;
  tenant: {
    id: string;
    subdomain: string;
    database_name: string;
    status: string;
    created_at: string;
  };
}

interface SuspendSchoolRequest {
  reason?: string;
}

interface SendEmailRequest {
  subject: string;
  message: string;
  recipients: string[] | 'admin' | 'all';
}

interface SendEmailResponse {
  message: string;
  sent_to: string[];
  failed: string[];
}

interface UsersCountResponse {
  users_count: number;
  breakdown: {
    total: number;
    admins: number;
    teachers: number;
    students: number;
    parents: number;
    active: number;
    inactive: number;
  };
}

interface ActivityLog {
  action: string;
  timestamp: string;
  details: string;
}

interface ActivityLogsResponse {
  school_id: number;
  logs: ActivityLog[];
  total: number;
}

interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  database_name: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface TenantListResponse {
  data: Tenant[];
}

interface VerifyTenantResponse {
  tenant: {
    id: string;
    subdomain: string;
    status: string;
  };
  exists: boolean;
}

interface SuperAdminAnalytics {
  total_schools: number;
  active_schools: number;
  suspended_schools: number;
  total_users: number;
  total_students: number;
  total_teachers: number;
  revenue: {
    this_month: number;
    last_month: number;
    growth: number;
  };
  recent_signups: Array<{
    school: string;
    date: string;
  }>;
}

interface DatabaseStatus {
  status: string;
  connections: {
    main: string;
    tenants: number;
  };
}

interface SecurityInfo {
  security_logs: any[];
  active_sessions: number;
  failed_login_attempts: number;
}

interface DashboardResponse {
  total_schools: number;
  active_schools: number;
  suspended_schools: number;
  recent_activities: any[];
}

interface GetSchoolsParams {
  page?: number;
  per_page?: number;
  status?: 'active' | 'suspended' | 'inactive';
  search?: string;
}

export const superAdminService = {
  // 1. Authentication
  login: async (data: { email: string; password: string }): Promise<LoginResponse> => {
    const response = await superAdminApiClient.post('/auth/login', data);
    return response.data;
  },

  // 2. School Management
  getSchools: async (params?: GetSchoolsParams): Promise<SchoolListResponse> => {
    const response = await superAdminApiClient.get('/schools', { params });
    return response.data;
  },

  createSchool: async (data: CreateSchoolRequest): Promise<CreateSchoolResponse> => {
    const response = await superAdminApiClient.post('/schools', data);
    return response.data;
  },

  getSchoolById: async (schoolId: number): Promise<School> => {
    const response = await superAdminApiClient.get(`/admin/schools/${schoolId}`);
    return response.data;
  },

  updateSchool: async ({ schoolId, data }: { schoolId: number; data: Partial<CreateSchoolRequest> }): Promise<{ message: string; school: School }> => {
    const response = await superAdminApiClient.put(`/admin/schools/${schoolId}`, data);
    return response.data;
  },

  getSchoolStats: async (schoolId: number): Promise<SchoolStats> => {
    const response = await superAdminApiClient.get(`/admin/schools/${schoolId}/stats`);
    return response.data;
  },

  getSchoolDashboard: async (schoolId: number): Promise<SchoolDashboard> => {
    const response = await superAdminApiClient.get(`/admin/schools/${schoolId}/dashboard`);
    return response.data;
  },

  deleteSchool: async (schoolId: number, options?: { force?: boolean; delete_database?: boolean }): Promise<{ message: string; deleted: { school: boolean; tenant_database: boolean } }> => {
    const params = new URLSearchParams();
    if (options?.force) params.append('force', 'true');
    if (options?.delete_database) params.append('delete_database', 'true');
    const response = await superAdminApiClient.delete(`/schools/${schoolId}?${params.toString()}`);
    return response.data;
  },

  // 3. School Control Actions
  suspendSchool: async ({ schoolId, data }: { schoolId: number; data?: SuspendSchoolRequest }): Promise<{ message: string; school: School }> => {
    const response = await superAdminApiClient.post(`/admin/schools/${schoolId}/suspend`, data || {});
    return response.data;
  },

  activateSchool: async (schoolId: number): Promise<{ message: string; school: School }> => {
    const response = await superAdminApiClient.post(`/admin/schools/${schoolId}/activate`);
    return response.data;
  },

  sendEmailToSchool: async ({ schoolId, data }: { schoolId: number; data: SendEmailRequest }): Promise<SendEmailResponse> => {
    const response = await superAdminApiClient.post(`/admin/schools/${schoolId}/send-email`, data);
    return response.data;
  },

  getSchoolUsersCount: async (schoolId: number): Promise<UsersCountResponse> => {
    const response = await superAdminApiClient.get(`/admin/schools/${schoolId}/users-count`);
    return response.data;
  },

  getSchoolActivityLogs: async (schoolId: number): Promise<ActivityLogsResponse> => {
    const response = await superAdminApiClient.get(`/admin/schools/${schoolId}/activity-logs`);
    return response.data;
  },

  // 4. Tenant Management
  getTenants: async (): Promise<TenantListResponse> => {
    const response = await superAdminApiClient.get('/tenants');
    return response.data;
  },

  verifyTenant: async (subdomain: string): Promise<VerifyTenantResponse> => {
    const response = await superAdminApiClient.get(`/tenants/verify?subdomain=${subdomain}`);
    return response.data;
  },

  // 5. Dashboard & Analytics
  getAnalytics: async (): Promise<SuperAdminAnalytics> => {
    const response = await superAdminApiClient.get('/super-admin/analytics');
    return response.data;
  },

  getDatabaseStatus: async (): Promise<DatabaseStatus> => {
    const response = await superAdminApiClient.get('/super-admin/database');
    return response.data;
  },

  getSecurityInfo: async (): Promise<SecurityInfo> => {
    const response = await superAdminApiClient.get('/super-admin/security');
    return response.data;
  },

  getDashboard: async (): Promise<DashboardResponse> => {
    const response = await superAdminApiClient.get('/dashboard/super-admin');
    return response.data;
  },

  // 6. Search & Filtering
  getSchoolBySubdomain: async (subdomain: string): Promise<School> => {
    const response = await superAdminApiClient.get(`/schools/by-subdomain/${subdomain}`);
    return response.data;
  },

  getSchoolBySubdomainAlt: async (subdomain: string): Promise<School> => {
    const response = await superAdminApiClient.get(`/schools/subdomain/${subdomain}`);
    return response.data;
  },
};

// 2. TanStack Query Hooks

// Authentication
export const useSuperAdminLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: superAdminService.login,
    onSuccess: (data) => {
      // Store token and user info
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      queryClient.setQueryData(['superAdminUser'], data.user);
    },
  });
};

// School Management
export const useSuperAdminSchools = (params?: GetSchoolsParams) => {
  return useQuery({
    queryKey: ['superAdminSchools', params],
    queryFn: () => superAdminService.getSchools(params),
  });
};

export const useCreateSchool = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: superAdminService.createSchool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superAdminSchools'] });
      queryClient.invalidateQueries({ queryKey: ['superAdminAnalytics'] });
      queryClient.invalidateQueries({ queryKey: ['superAdminDashboard'] });
    },
  });
};

export const useSuperAdminSchool = (schoolId: number) => {
  return useQuery({
    queryKey: ['superAdminSchool', schoolId],
    queryFn: () => superAdminService.getSchoolById(schoolId),
    enabled: !!schoolId,
  });
};

export const useUpdateSchool = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: superAdminService.updateSchool,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['superAdminSchools'] });
      queryClient.invalidateQueries({ queryKey: ['superAdminSchool', variables.schoolId] });
      queryClient.invalidateQueries({ queryKey: ['superAdminAnalytics'] });
    },
  });
};

export const useSchoolStats = (schoolId: number) => {
  return useQuery({
    queryKey: ['schoolStats', schoolId],
    queryFn: () => superAdminService.getSchoolStats(schoolId),
    enabled: !!schoolId,
  });
};

export const useSchoolDashboard = (schoolId: number) => {
  return useQuery({
    queryKey: ['schoolDashboard', schoolId],
    queryFn: () => superAdminService.getSchoolDashboard(schoolId),
    enabled: !!schoolId,
  });
};

export const useDeleteSchool = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ schoolId, options }: { schoolId: number; options?: { force?: boolean; delete_database?: boolean } }) =>
      superAdminService.deleteSchool(schoolId, options),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superAdminSchools'] });
      queryClient.invalidateQueries({ queryKey: ['superAdminAnalytics'] });
      queryClient.invalidateQueries({ queryKey: ['superAdminDashboard'] });
    },
  });
};

// School Control Actions
export const useSuspendSchool = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: superAdminService.suspendSchool,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['superAdminSchools'] });
      queryClient.invalidateQueries({ queryKey: ['superAdminSchool', variables.schoolId] });
      queryClient.invalidateQueries({ queryKey: ['superAdminAnalytics'] });
    },
  });
};

export const useActivateSchool = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: superAdminService.activateSchool,
    onSuccess: (data, schoolId) => {
      queryClient.invalidateQueries({ queryKey: ['superAdminSchools'] });
      queryClient.invalidateQueries({ queryKey: ['superAdminSchool', schoolId] });
      queryClient.invalidateQueries({ queryKey: ['superAdminAnalytics'] });
    },
  });
};

export const useSendEmailToSchool = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: superAdminService.sendEmailToSchool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schoolActivityLogs'] });
    },
  });
};

export const useSchoolUsersCount = (schoolId: number) => {
  return useQuery({
    queryKey: ['schoolUsersCount', schoolId],
    queryFn: () => superAdminService.getSchoolUsersCount(schoolId),
    enabled: !!schoolId,
  });
};

export const useSchoolActivityLogs = (schoolId: number) => {
  return useQuery({
    queryKey: ['schoolActivityLogs', schoolId],
    queryFn: () => superAdminService.getSchoolActivityLogs(schoolId),
    enabled: !!schoolId,
  });
};

// Tenant Management
export const useTenants = () => {
  return useQuery({
    queryKey: ['tenants'],
    queryFn: () => superAdminService.getTenants(),
  });
};

export const useVerifyTenant = (subdomain: string) => {
  return useQuery({
    queryKey: ['verifyTenant', subdomain],
    queryFn: () => superAdminService.verifyTenant(subdomain),
    enabled: !!subdomain,
  });
};

// Dashboard & Analytics
export const useSuperAdminAnalytics = () => {
  return useQuery({
    queryKey: ['superAdminAnalytics'],
    queryFn: () => superAdminService.getAnalytics(),
  });
};

export const useDatabaseStatus = () => {
  return useQuery({
    queryKey: ['databaseStatus'],
    queryFn: () => superAdminService.getDatabaseStatus(),
  });
};

export const useSecurityInfo = () => {
  return useQuery({
    queryKey: ['securityInfo'],
    queryFn: () => superAdminService.getSecurityInfo(),
  });
};

export const useSuperAdminDashboard = () => {
  return useQuery({
    queryKey: ['superAdminDashboard'],
    queryFn: () => superAdminService.getDashboard(),
  });
};

// Search & Filtering
export const useSchoolBySubdomain = (subdomain: string) => {
  return useQuery({
    queryKey: ['schoolBySubdomain', subdomain],
    queryFn: () => superAdminService.getSchoolBySubdomain(subdomain),
    enabled: !!subdomain,
  });
};

export const useSchoolBySubdomainAlt = (subdomain: string) => {
  return useQuery({
    queryKey: ['schoolBySubdomainAlt', subdomain],
    queryFn: () => superAdminService.getSchoolBySubdomainAlt(subdomain),
    enabled: !!subdomain,
  });
};
