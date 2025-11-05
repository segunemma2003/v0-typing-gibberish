import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// 1. Service Functions

interface HealthResponse {
  status: string;
  timestamp: string;
  version: string;
}

export const healthService = {
  getHealth: async (): Promise<HealthResponse> => {
    // Health check endpoint is at /api/health (not /api/v1/health)
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://31.97.155.60:8078'}/api/health`);
    return response.data;
  },
};

// 2. TanStack Query Hooks

export const useHealth = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: healthService.getHealth,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });
};

