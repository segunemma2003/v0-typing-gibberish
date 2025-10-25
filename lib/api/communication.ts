import apiClient from './apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 1. Service Functions

interface MessageSenderRecipient {
  id: number;
  name: string;
}

interface Message {
  id: number;
  sender: MessageSenderRecipient;
  recipient: MessageSenderRecipient;
  subject: string;
  message: string;
  type: string;
  status: string;
  created_at: string;
}

interface MessageListResponse {
  data: Message[];
}

interface SendMessageRequest {
  recipient_id: number;
  subject: string;
  message: string;
  type: string;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

interface NotificationListResponse {
  data: Notification[];
}

export const communicationService = {
  // Messages
  getMessages: async (): Promise<MessageListResponse> => {
    const response = await apiClient.get('/messages');
    return response.data;
  },

  sendMessage: async (data: SendMessageRequest): Promise<{ message: string }> => {
    const response = await apiClient.post('/messages', data);
    return response.data;
  },

  // Notifications
  getNotifications: async (): Promise<NotificationListResponse> => {
    const response = await apiClient.get('/notifications');
    return response.data;
  },

  markNotificationAsRead: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.put(`/notifications/${id}/read`);
    return response.data;
  },
};

// 2. TanStack Query Hooks

// Messages
export const useMessages = () => {
  return useQuery({
    queryKey: ['messages'],
    queryFn: communicationService.getMessages,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: communicationService.sendMessage,
    onSuccess: (data) => {
      console.log('Message sent successfully', data);
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
};

// Notifications
export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: communicationService.getNotifications,
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: communicationService.markNotificationAsRead,
    onSuccess: (data, variables) => {
      console.log('Notification marked as read', data);
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.setQueryData(['notification', variables], (oldData: Notification | undefined) => {
        if (oldData) {
          return { ...oldData, read: true };
        }
        return oldData;
      });
    },
  });
};
