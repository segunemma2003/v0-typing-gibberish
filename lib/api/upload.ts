import apiClient from './apiClient';
import { useMutation } from '@tanstack/react-query';

// 1. Service Functions

interface UploadResponse {
  url: string;
  path: string;
  filename: string;
  size: number;
  mime_type: string;
}

interface UploadProgress {
  loaded: number;
  total: number;
}

export const uploadService = {
  uploadFile: async (
    file: File,
    type: 'profile' | 'document' | 'logo' | 'image' | 'other',
    onUploadProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          onUploadProgress({
            loaded: progressEvent.loaded,
            total: progressEvent.total,
          });
        }
      },
    });

    return response.data;
  },

  uploadMultipleFiles: async (
    files: File[],
    type: 'profile' | 'document' | 'logo' | 'image' | 'other',
    onUploadProgress?: (progress: UploadProgress) => void
  ): Promise<{ files: UploadResponse[] }> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files[]', file);
    });
    formData.append('type', type);

    const response = await apiClient.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          onUploadProgress({
            loaded: progressEvent.loaded,
            total: progressEvent.total,
          });
        }
      },
    });

    return response.data;
  },

  deleteFile: async (path: string): Promise<{ message: string }> => {
    const response = await apiClient.delete('/upload', {
      data: { path },
    });
    return response.data;
  },

  // School Admin - File Uploads APIs
  getPresignedURLs: async (params?: {
    files: Array<{
      filename: string;
      content_type: string;
    }>;
  }): Promise<{
    urls: Array<{
      filename: string;
      url: string;
      key: string;
    }>;
  }> => {
    const response = await apiClient.get('/uploads/presigned-urls', { params });
    return response.data;
  },

  uploadFile: async (file: File): Promise<{
    message: string;
    file: {
      url: string;
      key: string;
    };
  }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/uploads/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  uploadMultipleFiles: async (files: File[]): Promise<{
    message: string;
    files: Array<{
      url: string;
      key: string;
    }>;
  }> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files[]', file);
    });
    const response = await apiClient.post('/uploads/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteFile: async (key: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/uploads/${key}`);
    return response.data;
  },
};

// 2. TanStack Query Hooks

export const useUploadFile = () => {
  return useMutation({
    mutationFn: ({ file, type, onUploadProgress }: { file: File; type: 'profile' | 'document' | 'logo' | 'image' | 'other'; onUploadProgress?: (progress: UploadProgress) => void }) =>
      uploadService.uploadFile(file, type, onUploadProgress),
  });
};

export const useUploadMultipleFiles = () => {
  return useMutation({
    mutationFn: ({ files, type, onUploadProgress }: { files: File[]; type: 'profile' | 'document' | 'logo' | 'image' | 'other'; onUploadProgress?: (progress: UploadProgress) => void }) =>
      uploadService.uploadMultipleFiles(files, type, onUploadProgress),
  });
};

export const useDeleteFile = () => {
  return useMutation({
    mutationFn: uploadService.deleteFile,
  });
};

