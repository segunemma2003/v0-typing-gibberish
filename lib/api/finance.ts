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
  getFees: async (params?: { page?: number; per_page?: number; student_id?: number; status?: string }): Promise<FeeListResponse> => {
    const response = await apiClient.get('/financial/fees', { params });
    return response.data;
  },

  getFeeById: async (id: number): Promise<Fee> => {
    const response = await apiClient.get(`/financial/fees/${id}`);
    return response.data;
  },

  createFee: async (data: CreateFeeRequest): Promise<{ message: string; fee: Fee }> => {
    const response = await apiClient.post('/financial/fees', data);
    return response.data;
  },

  updateFee: async ({ id, data }: { id: number; data: Partial<CreateFeeRequest> }): Promise<{ message: string; fee: Fee }> => {
    const response = await apiClient.put(`/financial/fees/${id}`, data);
    return response.data;
  },

  deleteFee: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/financial/fees/${id}`);
    return response.data;
  },

  payFee: async ({ id, data }: { id: number; data: PayFeeRequest }): Promise<{ message: string; payment: PaymentResponse }> => {
    const response = await apiClient.post(`/financial/fees/${id}/pay`, data);
    return response.data;
  },

  getStudentFees: async (studentId: number): Promise<FeeListResponse> => {
    const response = await apiClient.get(`/financial/fees/student/${studentId}`);
    return response.data;
  },

  getFeeStructure: async (): Promise<{ data: any[] }> => {
    const response = await apiClient.get('/financial/fees/structure');
    return response.data;
  },

  createFeeStructure: async (data: any): Promise<{ message: string; structure: any }> => {
    const response = await apiClient.post('/financial/fees/structure', data);
    return response.data;
  },

  updateFeeStructure: async ({ id, data }: { id: number; data: any }): Promise<{ message: string; structure: any }> => {
    const response = await apiClient.put(`/financial/fees/structure/${id}`, data);
    return response.data;
  },

  // Payments
  getPayments: async (params?: { page?: number; per_page?: number; student_id?: number }): Promise<{ data: PaymentResponse[] }> => {
    const response = await apiClient.get('/financial/payments', { params });
    return response.data;
  },

  getPaymentById: async (id: number): Promise<PaymentResponse> => {
    const response = await apiClient.get(`/financial/payments/${id}`);
    return response.data;
  },

  createPayment: async (data: PayFeeRequest & { fee_id: number }): Promise<{ message: string; payment: PaymentResponse }> => {
    const response = await apiClient.post('/financial/payments', data);
    return response.data;
  },

  getStudentPayments: async (studentId: number): Promise<{ data: PaymentResponse[] }> => {
    const response = await apiClient.get(`/financial/payments/student/${studentId}`);
    return response.data;
  },

  getPaymentReceipt: async (id: number): Promise<Blob> => {
    const response = await apiClient.get(`/financial/payments/receipt/${id}`, {
      responseType: 'blob',
    });
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
