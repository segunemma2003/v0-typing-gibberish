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
  getMessages: async (params?: { page?: number; per_page?: number; search?: string }): Promise<MessageListResponse> => {
    const response = await apiClient.get('/communication/messages', { params });
    return response.data;
  },

  getMyMessages: async (params?: { page?: number; per_page?: number; search?: string }): Promise<MessageListResponse> => {
    const response = await apiClient.get('/messages/my-messages', { params });
    return response.data;
  },

  getMessageById: async (id: number): Promise<Message> => {
    const response = await apiClient.get(`/communication/messages/${id}`);
    return response.data;
  },

  sendMessage: async (data: SendMessageRequest): Promise<{ message: string }> => {
    const response = await apiClient.post('/communication/messages', data);
    return response.data;
  },

  // Parent/Guardian specific - Send message to teacher
  sendMessageToTeacher: async (data: {
    recipient_id: number;
    recipient_type: 'teacher';
    subject: string;
    message: string;
    regarding_student_id?: number;
  }): Promise<{ message: string }> => {
    const response = await apiClient.post('/messages/send', data);
    return response.data;
  },

  updateMessage: async ({ id, data }: { id: number; data: Partial<SendMessageRequest> }): Promise<{ message: string; updated_message: Message }> => {
    const response = await apiClient.put(`/communication/messages/${id}`, data);
    return response.data;
  },

  deleteMessage: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/communication/messages/${id}`);
    return response.data;
  },

  markMessageAsRead: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.put(`/communication/messages/${id}/read`);
    return response.data;
  },

  // Notifications
  getNotifications: async (params?: { page?: number; per_page?: number; read?: boolean }): Promise<NotificationListResponse> => {
    const response = await apiClient.get('/communication/notifications', { params });
    return response.data;
  },

  getNotificationById: async (id: number): Promise<Notification> => {
    const response = await apiClient.get(`/communication/notifications/${id}`);
    return response.data;
  },

  createNotification: async (data: { title: string; message: string; type: string; recipient_ids?: number[] }): Promise<{ message: string; notification: Notification }> => {
    const response = await apiClient.post('/communication/notifications', data);
    return response.data;
  },

  updateNotification: async ({ id, data }: { id: number; data: Partial<{ title: string; message: string; type: string }> }): Promise<{ message: string; notification: Notification }> => {
    const response = await apiClient.put(`/communication/notifications/${id}`, data);
    return response.data;
  },

  deleteNotification: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/communication/notifications/${id}`);
    return response.data;
  },

  markNotificationAsRead: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.put(`/communication/notifications/${id}/read`);
    return response.data;
  },

  markAllNotificationsAsRead: async (): Promise<{ message: string }> => {
    const response = await apiClient.put('/communication/notifications/read-all');
    return response.data;
  },

  // SMS
  sendSMS: async (data: { phone: string; message: string; recipient_ids?: number[] }): Promise<{ message: string }> => {
    const response = await apiClient.post('/communication/sms/send', data);
    return response.data;
  },

  // Email
  sendEmail: async (data: { email: string; subject: string; message: string; recipient_ids?: number[] }): Promise<{ message: string }> => {
    const response = await apiClient.post('/communication/email/send', data);
    return response.data;
  },

  // School Admin - Communication APIs
  listMessages: async (params?: {
    type?: string;
  }): Promise<{
    data: Array<{
      id: number;
      from_user_id: number;
      to_user_id: number;
      subject: string;
      message: string;
      is_read: boolean;
      sent_at: string;
    }>;
  }> => {
    const response = await apiClient.get('/communication/messages', { params });
    return response.data;
  },

  createMessage: async (data: {
    to_user_id: number;
    subject: string;
    message: string;
    priority?: string;
  }): Promise<{
    message: string;
    data: any;
  }> => {
    const response = await apiClient.post('/communication/messages', data);
    return response.data;
  },

  getMessage: async (id: number): Promise<{
    data: any;
  }> => {
    const response = await apiClient.get(`/communication/messages/${id}`);
    return response.data;
  },

  updateMessage: async ({ id, data }: {
    id: number;
    data: Partial<{
      subject: string;
      message: string;
    }>;
  }): Promise<{
    message: string;
    data: any;
  }> => {
    const response = await apiClient.put(`/communication/messages/${id}`, data);
    return response.data;
  },

  deleteMessage: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/communication/messages/${id}`);
    return response.data;
  },

  markMessageAsRead: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.put(`/communication/messages/${id}/read`);
    return response.data;
  },

  listNotifications: async (params?: {
    is_read?: boolean;
  }): Promise<{
    data: Array<{
      id: number;
      title: string;
      message: string;
      type: string;
      is_read: boolean;
      created_at: string;
    }>;
  }> => {
    const response = await apiClient.get('/communication/notifications', { params });
    return response.data;
  },

  createNotification: async (data: {
    title: string;
    message: string;
    type: string;
    recipient_ids?: number[];
  }): Promise<{
    message: string;
    data: any;
  }> => {
    const response = await apiClient.post('/communication/notifications', data);
    return response.data;
  },

  getNotification: async (id: number): Promise<{
    data: any;
  }> => {
    const response = await apiClient.get(`/communication/notifications/${id}`);
    return response.data;
  },

  updateNotification: async ({ id, data }: {
    id: number;
    data: Partial<{
      title: string;
      message: string;
      type: string;
    }>;
  }): Promise<{
    message: string;
    data: any;
  }> => {
    const response = await apiClient.put(`/communication/notifications/${id}`, data);
    return response.data;
  },

  deleteNotification: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/communication/notifications/${id}`);
    return response.data;
  },

  markNotificationAsReadAdmin: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.put(`/communication/notifications/${id}/read`);
    return response.data;
  },

  markAllNotificationsAsRead: async (): Promise<{ message: string }> => {
    const response = await apiClient.put('/communication/notifications/read-all');
    return response.data;
  },

  sendSMS: async (data: {
    recipients: string[];
    message: string;
  }): Promise<{
    message: string;
  }> => {
    const response = await apiClient.post('/communication/sms/send', data);
    return response.data;
  },

  sendEmailAdmin: async (data: {
    recipients: string[];
    subject: string;
    body: string;
  }): Promise<{
    message: string;
  }> => {
    const response = await apiClient.post('/communication/email/send', data);
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

export const useMyMessages = (params?: { page?: number; per_page?: number; search?: string }) => {
  return useQuery({
    queryKey: ['myMessages', params],
    queryFn: () => communicationService.getMyMessages(params),
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

// Parent/Guardian hook - Send message to teacher
export const useSendMessageToTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: communicationService.sendMessageToTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['myMessages'] });
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
