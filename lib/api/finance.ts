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
    const response = await apiClient.get(`/financial/payments/${id}/receipt`, {
      responseType: 'blob',
    });
    return response.data;
  },

  getDailyCollections: async (date?: string): Promise<{ data: any[] }> => {
    const response = await apiClient.get('/financial/payments/daily-collections', {
      params: { date },
    });
    return response.data;
  },

  // Fee Structure
  getOutstandingFees: async (params?: { class_id?: number }): Promise<{ data: any[] }> => {
    const response = await apiClient.get('/financial/fees/outstanding', { params });
    return response.data;
  },

  sendFeeReminder: async (data: { student_id?: number; fee_id?: number }): Promise<{ message: string }> => {
    const response = await apiClient.post('/financial/fees/send-reminder', data);
    return response.data;
  },

  // Expenses
  createExpense: async (data: {
    category: string;
    description: string;
    amount: number;
    expense_date: string;
    vendor?: string;
    payment_method?: string;
    reference?: string;
    attachments?: Array<{ name: string; url: string }>;
  }): Promise<{ message: string; expense: any }> => {
    const response = await apiClient.post('/financial/expenses', data);
    return response.data;
  },

  getExpenseCategories: async (): Promise<{ categories: any[] }> => {
    const response = await apiClient.get('/financial/expenses/categories');
    return response.data;
  },

  getExpenseReport: async (params?: { from?: string; to?: string }): Promise<{ data: any }> => {
    const response = await apiClient.get('/financial/expenses/report', { params });
    return response.data;
  },

  // Payroll
  createPayroll: async (data: {
    month: string;
    year: number;
    employees: Array<{
      employee_id: number;
      basic_salary: number;
      allowances?: Record<string, number>;
      deductions?: Record<string, number>;
      net_salary: number;
    }>;
  }): Promise<{ message: string; payroll: any }> => {
    const response = await apiClient.post('/financial/payroll', data);
    return response.data;
  },

  getPayrollHistory: async (params?: { month?: number; year?: number }): Promise<{ data: any[] }> => {
    const response = await apiClient.get('/financial/payroll', { params });
    return response.data;
  },

  getPayslip: async (payrollId: number, employeeId: number): Promise<Blob> => {
    const response = await apiClient.get(`/financial/payroll/${payrollId}/payslip/${employeeId}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  processBulkSalaryPayment: async (payrollId: number): Promise<{ message: string }> => {
    const response = await apiClient.post(`/financial/payroll/${payrollId}/process`);
    return response.data;
  },

  // Financial Reports
  getIncomeStatement: async (params?: { from?: string; to?: string; format?: string }): Promise<{ data: any }> => {
    const response = await apiClient.get('/financial/reports/income-statement', { params });
    return response.data;
  },

  getCashFlowStatement: async (params?: { from?: string; to?: string }): Promise<{ data: any }> => {
    const response = await apiClient.get('/financial/reports/cash-flow', { params });
    return response.data;
  },

  getBalanceSheet: async (params?: { from?: string; to?: string }): Promise<{ data: any }> => {
    const response = await apiClient.get('/financial/reports/balance-sheet', { params });
    return response.data;
  },

  getFeeCollectionReport: async (params?: { from?: string; to?: string }): Promise<{ data: any }> => {
    const response = await apiClient.get('/financial/reports/fee-collections', { params });
    return response.data;
  },

  getExpenseAnalysis: async (params?: { from?: string; to?: string }): Promise<{ data: any }> => {
    const response = await apiClient.get('/financial/reports/expense-analysis', { params });
    return response.data;
  },

  // Budget Management
  createBudget: async (data: {
    name: string;
    academic_year_id: number;
    categories: Array<{
      name: string;
      allocated_amount: number;
      priority: string;
    }>;
    total_budget: number;
  }): Promise<{ message: string; budget: any }> => {
    const response = await apiClient.post('/financial/budgets', data);
    return response.data;
  },

  getBudgetVsActual: async (id: number): Promise<{ data: any }> => {
    const response = await apiClient.get(`/financial/budgets/${id}/vs-actual`);
    return response.data;
  },

  updateBudget: async ({ id, data }: { id: number; data: any }): Promise<{ message: string; budget: any }> => {
    const response = await apiClient.put(`/financial/budgets/${id}`, data);
    return response.data;
  },

  // Invoice Management
  createInvoice: async (data: {
    student_id: number;
    invoice_number: string;
    issue_date: string;
    due_date: string;
    items: Array<{ description: string; amount: number }>;
    total: number;
    tax?: number;
    grand_total: number;
  }): Promise<{ message: string; invoice: any }> => {
    const response = await apiClient.post('/financial/invoices', data);
    return response.data;
  },

  sendInvoice: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.post(`/financial/invoices/${id}/send`);
    return response.data;
  },

  getOutstandingInvoices: async (): Promise<{ data: any[] }> => {
    const response = await apiClient.get('/financial/invoices/outstanding');
    return response.data;
  },

  markInvoiceAsPaid: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.post(`/financial/invoices/${id}/mark-paid`);
    return response.data;
  },

  // Parent/Guardian endpoints - Child fees
  getChildFeeStatus: async (childId: number): Promise<{
    student: {
      id: number;
      name: string;
      admission_number: string;
      class: string;
    };
    fees: Array<{
      id: number;
      name: string;
      amount: number;
      paid: number;
      balance: number;
      status: string;
      due_date: string;
      paid_date?: string;
    }>;
    summary: {
      total_fees: number;
      total_paid: number;
      total_balance: number;
      next_due_date?: string;
    };
  }> => {
    const response = await apiClient.get(`/financial/fees/student/${childId}`);
    return response.data;
  },

  getChildPaymentHistory: async (childId: number): Promise<{
    student: {
      id: number;
      name: string;
    };
    payments: Array<{
      id: number;
      amount: number;
      payment_method: string;
      reference: string;
      paid_date: string;
      fee: string;
      receipt_url?: string;
    }>;
    total_paid: number;
  }> => {
    const response = await apiClient.get(`/financial/payments/student/${childId}`);
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

export const usePayments = (params?: { page?: number; per_page?: number; student_id?: number; class_id?: number; payment_method?: string; from?: string; to?: string }) => {
  return useQuery({
    queryKey: ['payments', params],
    queryFn: () => financeService.getPayments(params),
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: financeService.createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['financeDashboard'] });
    },
  });
};

export const useDailyCollections = (date?: string) => {
  return useQuery({
    queryKey: ['dailyCollections', date],
    queryFn: () => financeService.getDailyCollections(date),
  });
};

export const useOutstandingFees = (params?: { class_id?: number }) => {
  return useQuery({
    queryKey: ['outstandingFees', params],
    queryFn: () => financeService.getOutstandingFees(params),
  });
};

export const useSendFeeReminder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: financeService.sendFeeReminder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fees'] });
    },
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: financeService.createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['financeDashboard'] });
    },
  });
};

export const useExpenseCategories = () => {
  return useQuery({
    queryKey: ['expenseCategories'],
    queryFn: financeService.getExpenseCategories,
  });
};

export const useExpenseReport = (params?: { from?: string; to?: string }) => {
  return useQuery({
    queryKey: ['expenseReport', params],
    queryFn: () => financeService.getExpenseReport(params),
  });
};

export const useCreatePayroll = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: financeService.createPayroll,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
      queryClient.invalidateQueries({ queryKey: ['financeDashboard'] });
    },
  });
};

export const usePayrollHistory = (params?: { month?: number; year?: number }) => {
  return useQuery({
    queryKey: ['payrollHistory', params],
    queryFn: () => financeService.getPayrollHistory(params),
  });
};

export const useProcessBulkSalaryPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: financeService.processBulkSalaryPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
      queryClient.invalidateQueries({ queryKey: ['financeDashboard'] });
    },
  });
};

export const useIncomeStatement = (params?: { from?: string; to?: string; format?: string }) => {
  return useQuery({
    queryKey: ['incomeStatement', params],
    queryFn: () => financeService.getIncomeStatement(params),
  });
};

export const useCashFlowStatement = (params?: { from?: string; to?: string }) => {
  return useQuery({
    queryKey: ['cashFlowStatement', params],
    queryFn: () => financeService.getCashFlowStatement(params),
  });
};

export const useBalanceSheet = (params?: { from?: string; to?: string }) => {
  return useQuery({
    queryKey: ['balanceSheet', params],
    queryFn: () => financeService.getBalanceSheet(params),
  });
};

export const useFeeCollectionReport = (params?: { from?: string; to?: string }) => {
  return useQuery({
    queryKey: ['feeCollectionReport', params],
    queryFn: () => financeService.getFeeCollectionReport(params),
  });
};

export const useExpenseAnalysis = (params?: { from?: string; to?: string }) => {
  return useQuery({
    queryKey: ['expenseAnalysis', params],
    queryFn: () => financeService.getExpenseAnalysis(params),
  });
};

export const useCreateBudget = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: financeService.createBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
};

export const useBudgetVsActual = (id: number) => {
  return useQuery({
    queryKey: ['budgetVsActual', id],
    queryFn: () => financeService.getBudgetVsActual(id),
    enabled: !!id,
  });
};

export const useUpdateBudget = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: financeService.updateBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: financeService.createInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
};

export const useSendInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: financeService.sendInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
};

export const useOutstandingInvoices = () => {
  return useQuery({
    queryKey: ['outstandingInvoices'],
    queryFn: financeService.getOutstandingInvoices,
  });
};

export const useMarkInvoiceAsPaid = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: financeService.markInvoiceAsPaid,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['financeDashboard'] });
    },
  });
};

// Parent/Guardian hooks - Child fees and payments
export const useChildFeeStatus = (childId: number) => {
  return useQuery({
    queryKey: ['childFeeStatus', childId],
    queryFn: () => financeService.getChildFeeStatus(childId),
    enabled: !!childId,
  });
};

export const useChildPaymentHistory = (childId: number) => {
  return useQuery({
    queryKey: ['childPaymentHistory', childId],
    queryFn: () => financeService.getChildPaymentHistory(childId),
    enabled: !!childId,
  });
};
