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
  category_id?: number;
  category?: string;
  publisher?: string;
  publication_year?: number;
  copies?: number;
  total_copies?: number;
  shelf_location?: string;
  description?: string;
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

  // Book borrowing by book ID
  borrowBookById: async (bookId: number, data: { student_id: number; due_date: string }): Promise<{ message: string; borrowed_book: BorrowedBook }> => {
    const response = await apiClient.post(`/library/books/${bookId}/borrow`, data);
    return response.data;
  },

  // Return book by book ID
  returnBookById: async (bookId: number, data: { borrow_id: number; condition?: string; fine?: number }): Promise<{ message: string }> => {
    const response = await apiClient.post(`/library/books/${bookId}/return`, data);
    return response.data;
  },

  // Get overdue books
  getOverdueBooks: async (): Promise<{ data: BorrowedBook[] }> => {
    const response = await apiClient.get('/library/books/overdue');
    return response.data;
  },

  // Get popular books
  getPopularBooks: async (limit?: number): Promise<{ data: Book[] }> => {
    const response = await apiClient.get('/library/books/popular', { params: { limit } });
    return response.data;
  },

  // Member management
  getBorrowingHistory: async (studentId: number): Promise<{ data: BorrowedBook[] }> => {
    const response = await apiClient.get(`/library/members/${studentId}/history`);
    return response.data;
  },

  getActiveBorrows: async (studentId: number): Promise<{ data: BorrowedBook[] }> => {
    const response = await apiClient.get(`/library/members/${studentId}/active-borrows`);
    return response.data;
  },

  blockMember: async (studentId: number, data?: { reason?: string }): Promise<{ message: string }> => {
    const response = await apiClient.post(`/library/members/${studentId}/block`, data || {});
    return response.data;
  },

  unblockMember: async (studentId: number): Promise<{ message: string }> => {
    const response = await apiClient.post(`/library/members/${studentId}/unblock`);
    return response.data;
  },

  // Reports
  getMonthlyReport: async (params?: { month?: number; year?: number }): Promise<{ data: any }> => {
    const response = await apiClient.get('/library/reports/monthly', { params });
    return response.data;
  },

  getMostBorrowedBooks: async (): Promise<{ data: Book[] }> => {
    const response = await apiClient.get('/library/reports/most-borrowed');
    return response.data;
  },

  getFineCollectionReport: async (params?: { from?: string; to?: string }): Promise<{ data: any }> => {
    const response = await apiClient.get('/library/reports/fines', { params });
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

export const useBorrowBookById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookId, data }: { bookId: number; data: { student_id: number; due_date: string } }) =>
      libraryService.borrowBookById(bookId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['borrowedBooks'] });
      queryClient.invalidateQueries({ queryKey: ['librarianDashboard'] });
    },
  });
};

export const useReturnBookById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookId, data }: { bookId: number; data: { borrow_id: number; condition?: string; fine?: number } }) =>
      libraryService.returnBookById(bookId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['borrowedBooks'] });
      queryClient.invalidateQueries({ queryKey: ['librarianDashboard'] });
    },
  });
};

export const useOverdueBooks = () => {
  return useQuery({
    queryKey: ['overdueBooks'],
    queryFn: libraryService.getOverdueBooks,
  });
};

export const usePopularBooks = (limit?: number) => {
  return useQuery({
    queryKey: ['popularBooks', limit],
    queryFn: () => libraryService.getPopularBooks(limit),
  });
};

export const useBorrowingHistory = (studentId: number) => {
  return useQuery({
    queryKey: ['borrowingHistory', studentId],
    queryFn: () => libraryService.getBorrowingHistory(studentId),
    enabled: !!studentId,
  });
};

export const useActiveBorrows = (studentId: number) => {
  return useQuery({
    queryKey: ['activeBorrows', studentId],
    queryFn: () => libraryService.getActiveBorrows(studentId),
    enabled: !!studentId,
  });
};

export const useBlockMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ studentId, data }: { studentId: number; data?: { reason?: string } }) =>
      libraryService.blockMember(studentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['libraryMembers'] });
    },
  });
};

export const useUnblockMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (studentId: number) => libraryService.unblockMember(studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['libraryMembers'] });
    },
  });
};

export const useMonthlyReport = (params?: { month?: number; year?: number }) => {
  return useQuery({
    queryKey: ['monthlyReport', params],
    queryFn: () => libraryService.getMonthlyReport(params),
  });
};

export const useMostBorrowedBooks = () => {
  return useQuery({
    queryKey: ['mostBorrowedBooks'],
    queryFn: libraryService.getMostBorrowedBooks,
  });
};

export const useFineCollectionReport = (params?: { from?: string; to?: string }) => {
  return useQuery({
    queryKey: ['fineCollectionReport', params],
    queryFn: () => libraryService.getFineCollectionReport(params),
  });
};

