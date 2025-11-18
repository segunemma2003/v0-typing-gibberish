import apiClient from './apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 1. Service Functions

interface Book {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  category: string;
  available_copies: number;
  total_copies: number;
  status: 'available' | 'unavailable';
  created_at: string;
}

interface BorrowedBook {
  id: number;
  book_id: number;
  book: Book;
  student_id: number;
  borrowed_at: string;
  due_date: string;
  returned_at?: string;
  status: 'borrowed' | 'returned' | 'overdue';
}

interface DigitalResource {
  id: number;
  title: string;
  type: 'ebook' | 'audiobook' | 'video' | 'document';
  category: string;
  author?: string;
  format: string;
  size: string;
  url: string;
  downloads: number;
  rating: number;
  description: string;
}

interface LibraryMember {
  id: number;
  user_id: number;
  name: string;
  email: string;
  role: string;
  borrowed_count: number;
  membership_status: 'active' | 'inactive';
}

interface BookListResponse {
  books: Book[];
}

interface GetBooksParams {
  page?: number;
  per_page?: number;
  category?: string;
  search?: string;
  status?: string;
}

interface CreateBookRequest {
  title: string;
  author: string;
  isbn?: string;
  category: string;
  total_copies: number;
}

interface BorrowBookRequest {
  book_id: number;
  student_id: number;
  due_date: string;
}

export const libraryService = {
  getBooks: async (params?: GetBooksParams): Promise<BookListResponse> => {
    const response = await apiClient.get('/library/books', { params });
    return response.data;
  },

  getBookById: async (id: number): Promise<Book> => {
    const response = await apiClient.get(`/library/books/${id}`);
    return response.data;
  },

  createBook: async (data: CreateBookRequest): Promise<{ message: string; book: Book }> => {
    const response = await apiClient.post('/library/books', data);
    return response.data;
  },

  updateBook: async ({ id, data }: { id: number; data: Partial<CreateBookRequest> }): Promise<{ message: string; book: Book }> => {
    const response = await apiClient.put(`/library/books/${id}`, data);
    return response.data;
  },

  deleteBook: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/library/books/${id}`);
    return response.data;
  },

  getBorrowedBooks: async (params?: { student_id?: number; status?: string }): Promise<{ data: BorrowedBook[] }> => {
    const response = await apiClient.get('/library/borrowed', { params });
    return response.data;
  },

  borrowBook: async (data: BorrowBookRequest): Promise<{ message: string; borrowed_book: BorrowedBook }> => {
    const response = await apiClient.post('/library/borrow', data);
    return response.data;
  },

  returnBook: async (borrowedBookId: number): Promise<{ message: string }> => {
    const response = await apiClient.post('/library/return', { borrowed_book_id: borrowedBookId });
    return response.data;
  },

  getDigitalResources: async (params?: { type?: string; category?: string }): Promise<{ data: DigitalResource[] }> => {
    const response = await apiClient.get('/library/digital-resources', { params });
    return response.data;
  },

  createDigitalResource: async (data: Partial<DigitalResource>): Promise<{ message: string; resource: DigitalResource }> => {
    const response = await apiClient.post('/library/digital-resources', data);
    return response.data;
  },

  getLibraryMembers: async (): Promise<{ data: LibraryMember[] }> => {
    const response = await apiClient.get('/library/members');
    return response.data;
  },

  getLibraryStats: async (): Promise<{
    total_books: number;
    available_books: number;
    borrowed_books: number;
    total_members: number;
    popular_books: Book[];
  }> => {
    const response = await apiClient.get('/library/stats');
    return response.data;
  },
};

// 2. TanStack Query Hooks

export const useBooks = (params?: GetBooksParams) => {
  return useQuery({
    queryKey: ['books', params],
    queryFn: () => libraryService.getBooks(params),
  });
};

export const useBook = (id: number) => {
  return useQuery({
    queryKey: ['book', id],
    queryFn: () => libraryService.getBookById(id),
    enabled: !!id,
  });
};

export const useCreateBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: libraryService.createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};

export const useUpdateBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: libraryService.updateBook,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['book', variables.id] });
    },
  });
};

export const useDeleteBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: libraryService.deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};

export const useBorrowedBooks = (params?: { student_id?: number; status?: string }) => {
  return useQuery({
    queryKey: ['borrowedBooks', params],
    queryFn: () => libraryService.getBorrowedBooks(params),
  });
};

export const useBorrowBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: libraryService.borrowBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['borrowedBooks'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};

export const useReturnBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: libraryService.returnBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['borrowedBooks'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};

export const useDigitalResources = (params?: { type?: string; category?: string }) => {
  return useQuery({
    queryKey: ['digitalResources', params],
    queryFn: () => libraryService.getDigitalResources(params),
  });
};

export const useCreateDigitalResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: libraryService.createDigitalResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['digitalResources'] });
    },
  });
};

export const useLibraryMembers = () => {
  return useQuery({
    queryKey: ['libraryMembers'],
    queryFn: libraryService.getLibraryMembers,
  });
};

export const useLibraryStats = () => {
  return useQuery({
    queryKey: ['libraryStats'],
    queryFn: libraryService.getLibraryStats,
  });
};

