import apiClient from './apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 1. Service Functions

interface StudentInfo {
  id: number;
  name: string;
  admission_number: string;
}

interface Fee {
  id: number;
  student: StudentInfo;
  fee_type: string;
  amount: number;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue'; // Assuming statuses
  created_at: string;
}

interface FeeListResponse {
  data: Fee[];
}

interface CreateFeeRequest {
  student_id: number;
  fee_type: string;
  amount: number;
  due_date: string;
  description?: string;
}

interface PayFeeRequest {
  amount: number;
  payment_method: string;
  reference: string;
}

interface PaymentResponse {
  id: number;
  amount: number;
  method: string;
  reference: string;
  status: string;
  paid_at: string;
}

export const financeService = {
  // Fees Management
  getFees: async (): Promise<FeeListResponse> => {
    const response = await apiClient.get('/fees');
    return response.data;
  },

  createFee: async (data: CreateFeeRequest): Promise<{ message: string; fee: Fee }> => {
    const response = await apiClient.post('/fees', data);
    return response.data;
  },

  payFee: async ({ id, data }: { id: number; data: PayFeeRequest }): Promise<{ message: string; payment: PaymentResponse }> => {
    const response = await apiClient.post(`/fees/${id}/pay`, data);
    return response.data;
  },
};

// 2. TanStack Query Hooks

export const useFees = () => {
  return useQuery({
    queryKey: ['fees'],
    queryFn: financeService.getFees,
  });
};

export const useCreateFee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: financeService.createFee,
    onSuccess: (data) => {
      console.log('Fee created successfully', data);
      queryClient.invalidateQueries({ queryKey: ['fees'] });
    },
  });
};

export const usePayFee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: financeService.payFee,
    onSuccess: (data, variables) => {
      console.log('Payment successful', data);
      queryClient.invalidateQueries({ queryKey: ['fees'] });
      queryClient.invalidateQueries({ queryKey: ['fee', variables.id] });
    },
  });
};
