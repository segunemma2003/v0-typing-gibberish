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

