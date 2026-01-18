import apiClient from './apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 1. Service Functions

interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration_months: number;
  features: string[];
  max_students: number;
  max_teachers: number;
  max_schools: number;
  status: 'active' | 'inactive';
}

interface Subscription {
  id: number;
  tenant_id: number;
  plan_id: number;
  plan: SubscriptionPlan;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  start_date: string;
  end_date: string;
  auto_renew: boolean;
  created_at: string;
  updated_at?: string;
}

interface CreateSubscriptionRequest {
  tenant_id: number;
  plan_id: number;
  auto_renew?: boolean;
}

interface UpdateSubscriptionRequest {
  plan_id?: number;
  auto_renew?: boolean;
}

export const subscriptionService = {
  getPlans: async (): Promise<{ data: SubscriptionPlan[] }> => {
    const response = await apiClient.get('/subscriptions/plans');
    return response.data;
  },

  getSubscriptions: async (tenant_id?: number): Promise<{ data: Subscription[] }> => {
    const params = tenant_id ? { tenant_id } : {};
    const response = await apiClient.get('/subscriptions', { params });
    return response.data;
  },

  getSubscriptionById: async (id: number): Promise<Subscription> => {
    const response = await apiClient.get(`/subscriptions/${id}`);
    return response.data;
  },

  createSubscription: async (data: CreateSubscriptionRequest): Promise<{ message: string; subscription: Subscription }> => {
    const response = await apiClient.post('/subscriptions', data);
    return response.data;
  },

  updateSubscription: async ({ id, data }: { id: number; data: UpdateSubscriptionRequest }): Promise<{ message: string; subscription: Subscription }> => {
    const response = await apiClient.put(`/subscriptions/${id}`, data);
    return response.data;
  },

  cancelSubscription: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.post(`/subscriptions/${id}/cancel`);
    return response.data;
  },

  renewSubscription: async (id: number): Promise<{ message: string; subscription: Subscription }> => {
    const response = await apiClient.post(`/subscriptions/${id}/renew`);
    return response.data;
  },

  // School Admin - Subscriptions & Modules APIs
  listSubscriptions: async (): Promise<{
    data: Array<{
      id: number;
      plan_id: number;
      status: string;
      start_date: string;
      end_date: string;
    }>;
  }> => {
    const response = await apiClient.get('/subscriptions');
    return response.data;
  },

  getSubscriptionPlans: async (): Promise<{
    plans: Array<any>;
  }> => {
    const response = await apiClient.get('/subscriptions/plans');
    return response.data;
  },

  getAvailableModules: async (): Promise<{
    modules: Array<any>;
  }> => {
    const response = await apiClient.get('/subscriptions/modules');
    return response.data;
  },

  getSubscriptionStatus: async (): Promise<{
    subscription: {
      status: string;
      plan: any;
      modules: Array<any>;
      message?: string;
    };
  }> => {
    const response = await apiClient.get('/subscriptions/status');
    return response.data;
  },

  getSubscriptionDetails: async (id: number): Promise<{
    subscription: any;
  }> => {
    const response = await apiClient.get(`/subscriptions/${id}`);
    return response.data;
  },

  createSubscription: async (data: {
    plan_id: number;
    auto_renew?: boolean;
  }): Promise<{
    message: string;
    subscription: any;
  }> => {
    const response = await apiClient.post('/subscriptions/create', data);
    return response.data;
  },

  upgradeSubscription: async ({ id, data }: {
    id: number;
    data: {
      plan_id: number;
    };
  }): Promise<{
    message: string;
    subscription: any;
  }> => {
    const response = await apiClient.put(`/subscriptions/${id}/upgrade`, data);
    return response.data;
  },

  renewSubscription: async (id: number): Promise<{
    message: string;
    subscription: any;
  }> => {
    const response = await apiClient.post(`/subscriptions/${id}/renew`);
    return response.data;
  },

  cancelSubscription: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/subscriptions/${id}/cancel`);
    return response.data;
  },

  checkModuleAccess: async (module: string): Promise<{
    has_access: boolean;
    message?: string;
  }> => {
    const response = await apiClient.get(`/subscriptions/modules/${module}/access`);
    return response.data;
  },

  checkFeatureAccess: async (feature: string): Promise<{
    has_access: boolean;
    message?: string;
  }> => {
    const response = await apiClient.get(`/subscriptions/features/${feature}/access`);
    return response.data;
  },

  getSchoolModules: async (): Promise<{
    modules: string[];
  }> => {
    const response = await apiClient.get('/subscriptions/school/modules');
    return response.data;
  },

  getSchoolLimits: async (): Promise<{
    limits: {
      students: number;
      teachers: number;
      storage: number;
    };
  }> => {
    const response = await apiClient.get('/subscriptions/school/limits');
    return response.data;
  },
};

// 2. TanStack Query Hooks

export const useSubscriptionPlans = () => {
  return useQuery({
    queryKey: ['subscriptionPlans'],
    queryFn: subscriptionService.getPlans,
  });
};

export const useSubscriptions = (tenant_id?: number) => {
  return useQuery({
    queryKey: ['subscriptions', tenant_id],
    queryFn: () => subscriptionService.getSubscriptions(tenant_id),
  });
};

export const useSubscription = (id: number) => {
  return useQuery({
    queryKey: ['subscription', id],
    queryFn: () => subscriptionService.getSubscriptionById(id),
    enabled: !!id,
  });
};

export const useCreateSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subscriptionService.createSubscription,
    onSuccess: (data) => {
      console.log('Subscription created successfully', data);
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
  });
};

export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subscriptionService.updateSubscription,
    onSuccess: (data, variables) => {
      console.log('Subscription updated successfully', data);
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscription', variables.id] });
    },
  });
};

export const useCancelSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subscriptionService.cancelSubscription,
    onSuccess: (data, variables) => {
      console.log('Subscription cancelled successfully', data);
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscription', variables] });
    },
  });
};

export const useRenewSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subscriptionService.renewSubscription,
    onSuccess: (data, variables) => {
      console.log('Subscription renewed successfully', data);
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscription', variables] });
    },
  });
};

// School Admin - Subscriptions & Modules Hooks
export const useListSubscriptions = () => {
  return useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => subscriptionService.listSubscriptions(),
  });
};

export const useSubscriptionPlans = () => {
  return useQuery({
    queryKey: ['subscriptionPlans'],
    queryFn: () => subscriptionService.getSubscriptionPlans(),
  });
};

export const useAvailableModules = () => {
  return useQuery({
    queryKey: ['availableModules'],
    queryFn: () => subscriptionService.getAvailableModules(),
  });
};

export const useSubscriptionStatus = () => {
  return useQuery({
    queryKey: ['subscriptionStatus'],
    queryFn: () => subscriptionService.getSubscriptionStatus(),
  });
};

export const useSubscriptionDetails = (id: number) => {
  return useQuery({
    queryKey: ['subscriptionDetails', id],
    queryFn: () => subscriptionService.getSubscriptionDetails(id),
    enabled: !!id,
  });
};

export const useCreateSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subscriptionService.createSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscriptionStatus'] });
    },
  });
};

export const useUpgradeSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subscriptionService.upgradeSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscriptionStatus'] });
    },
  });
};

export const useRenewSubscriptionAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subscriptionService.renewSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscriptionStatus'] });
    },
  });
};

export const useCancelSubscriptionAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subscriptionService.cancelSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscriptionStatus'] });
    },
  });
};

export const useCheckModuleAccess = (module: string) => {
  return useQuery({
    queryKey: ['moduleAccess', module],
    queryFn: () => subscriptionService.checkModuleAccess(module),
    enabled: !!module,
  });
};

export const useCheckFeatureAccess = (feature: string) => {
  return useQuery({
    queryKey: ['featureAccess', feature],
    queryFn: () => subscriptionService.checkFeatureAccess(feature),
    enabled: !!feature,
  });
};

export const useSchoolModules = () => {
  return useQuery({
    queryKey: ['schoolModules'],
    queryFn: () => subscriptionService.getSchoolModules(),
  });
};

export const useSchoolLimits = () => {
  return useQuery({
    queryKey: ['schoolLimits'],
    queryFn: () => subscriptionService.getSchoolLimits(),
  });
};
