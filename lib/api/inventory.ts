import apiClient from './apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 1. Service Functions

interface InventoryItem {
  id: number;
  name: string;
  description?: string;
  category_id: number;
  category: {
    id: number;
    name: string;
  };
  quantity: number;
  unit: string;
  min_stock_level: number;
  location?: string;
  status: 'available' | 'low_stock' | 'out_of_stock';
  created_at: string;
}

interface InventoryCategory {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

interface InventoryTransaction {
  id: number;
  item_id: number;
  item: InventoryItem;
  type: 'checkout' | 'return' | 'adjustment';
  quantity: number;
  user_id: number;
  notes?: string;
  created_at: string;
}

interface ItemListResponse {
  data: InventoryItem[];
}

interface CategoryListResponse {
  data: InventoryCategory[];
}

interface TransactionListResponse {
  data: InventoryTransaction[];
}

interface GetItemsParams {
  page?: number;
  per_page?: number;
  category_id?: number;
  search?: string;
  status?: string;
}

interface CreateItemRequest {
  name: string;
  description?: string;
  category_id: number;
  quantity: number;
  unit: string;
  min_stock_level: number;
  location?: string;
}

interface CheckoutItemRequest {
  item_id: number;
  quantity: number;
  user_id: number;
  notes?: string;
}

interface ReturnItemRequest {
  transaction_id: number;
  quantity: number;
  notes?: string;
}

export const inventoryService = {
  getItems: async (params?: GetItemsParams): Promise<ItemListResponse> => {
    const response = await apiClient.get('/inventory/items', { params });
    return response.data;
  },

  getItemById: async (id: number): Promise<InventoryItem> => {
    const response = await apiClient.get(`/inventory/items/${id}`);
    return response.data;
  },

  createItem: async (data: CreateItemRequest): Promise<{ message: string; item: InventoryItem }> => {
    const response = await apiClient.post('/inventory/items', data);
    return response.data;
  },

  updateItem: async ({ id, data }: { id: number; data: Partial<CreateItemRequest> }): Promise<{ message: string; item: InventoryItem }> => {
    const response = await apiClient.put(`/inventory/items/${id}`, data);
    return response.data;
  },

  deleteItem: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/inventory/items/${id}`);
    return response.data;
  },

  getCategories: async (): Promise<CategoryListResponse> => {
    const response = await apiClient.get('/inventory/categories');
    return response.data;
  },

  getCategoryById: async (id: number): Promise<InventoryCategory> => {
    const response = await apiClient.get(`/inventory/categories/${id}`);
    return response.data;
  },

  createCategory: async (data: { name: string; description?: string }): Promise<{ message: string; category: InventoryCategory }> => {
    const response = await apiClient.post('/inventory/categories', data);
    return response.data;
  },

  updateCategory: async ({ id, data }: { id: number; data: Partial<{ name: string; description?: string }> }): Promise<{ message: string; category: InventoryCategory }> => {
    const response = await apiClient.put(`/inventory/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/inventory/categories/${id}`);
    return response.data;
  },

  getTransactions: async (params?: { item_id?: number; type?: string }): Promise<TransactionListResponse> => {
    const response = await apiClient.get('/inventory/transactions', { params });
    return response.data;
  },

  checkoutItem: async (data: CheckoutItemRequest): Promise<{ message: string; transaction: InventoryTransaction }> => {
    const response = await apiClient.post('/inventory/checkout', data);
    return response.data;
  },

  returnItem: async (data: ReturnItemRequest): Promise<{ message: string; transaction: InventoryTransaction }> => {
    const response = await apiClient.post('/inventory/return', data);
    return response.data;
  },
};

// 2. TanStack Query Hooks

export const useInventoryItems = (params?: GetItemsParams) => {
  return useQuery({
    queryKey: ['inventoryItems', params],
    queryFn: () => inventoryService.getItems(params),
  });
};

export const useInventoryItem = (id: number) => {
  return useQuery({
    queryKey: ['inventoryItem', id],
    queryFn: () => inventoryService.getItemById(id),
    enabled: !!id,
  });
};

export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryService.createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryItems'] });
    },
  });
};

export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryService.updateItem,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inventoryItems'] });
      queryClient.invalidateQueries({ queryKey: ['inventoryItem', variables.id] });
    },
  });
};

export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryService.deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryItems'] });
    },
  });
};

export const useInventoryCategories = () => {
  return useQuery({
    queryKey: ['inventoryCategories'],
    queryFn: inventoryService.getCategories,
  });
};

export const useCreateInventoryCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryCategories'] });
    },
  });
};

export const useCheckoutItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryService.checkoutItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryItems'] });
      queryClient.invalidateQueries({ queryKey: ['inventoryTransactions'] });
    },
  });
};

export const useReturnItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryService.returnItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryItems'] });
      queryClient.invalidateQueries({ queryKey: ['inventoryTransactions'] });
    },
  });
};

