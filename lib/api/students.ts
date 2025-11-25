import apiClient from './apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 1. Service Functions

interface ClassInfo {
  id: number;
  name: string;
}

interface ArmInfo {
  id: number;
  name: string;
}

interface GuardianInfo {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface Student {
  id: number;
  admission_number: string;
  name: string;
  email: string;
  username: string;
  class: ClassInfo;
  arm: ArmInfo;
  guardian?: GuardianInfo;
  status: 'active' | 'inactive' | 'suspended';
  date_of_birth?: string;
  gender?: string;
  address?: string;
  phone?: string;
  created_at?: string;
}

interface StudentListResponse {
  data: Student[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

interface GetStudentsParams {
  page?: number;
  per_page?: number;
  class_id?: number;
  arm_id?: number;
  search?: string;
}

interface GuardianInput {
  first_name: string;
  last_name: string;
  middle_name?: string;
  email: string;
  phone?: string;
  address?: string;
  occupation?: string;
  employer?: string;
  relationship: string; // e.g., "Father", "Mother", "Guardian"
  is_primary?: boolean; // Default: first guardian is primary
  emergency_contact?: boolean;
}

interface CreateStudentRequest {
  school_id: number;
  first_name: string;
  last_name: string;
  middle_name?: string;
  date_of_birth?: string;
  gender?: string;
  class_id?: number;
  arm_id?: number;
  address?: string;
  phone?: string;
  email?: string; // Optional - will be auto-generated if not provided
  username?: string; // Optional - will be auto-generated if not provided
  blood_group?: string;
  emergency_contact?: string;
  medical_info?: {
    allergies?: string[];
    conditions?: string[];
  };
  guardians?: GuardianInput[]; // Max 2 guardians
}

interface UpdateStudentRequest {
  name?: string;
  class_id?: number;
  arm_id?: number;
  address?: string;
}

interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'late';
  time_in: string;
  time_out: string;
}

interface StudentAttendanceResponse {
  student: { id: number; name: string; admission_number: string };
  attendance: AttendanceRecord[];
  summary: {
    total_days: number;
    present_days: number;
    absent_days: number;
    attendance_percentage: number;
  };
}

interface SubjectResult {
  subject: { id: number; name: string };
  ca_score: number;
  exam_score: number;
  total_score: number;
  grade: string;
  position: number;
}

interface StudentResultsResponse {
  student: { id: number; name: string; admission_number: string };
  results: SubjectResult[];
  summary: {
    total_subjects: number;
    average_score: number;
    overall_grade: string;
    class_position: number;
  };
}

interface GetStudentAttendanceParams {
  start_date?: string; // YYYY-MM-DD
  end_date?: string; // YYYY-MM-DD
  month?: number; // 1-12
  year?: number;
}

interface GetStudentResultsParams {
  term_id?: number;
  session_id?: number;
  subject_id?: number;
}

interface GenerateAdmissionNumberRequest {
  school_id: number;
  class_id: number;
}

interface GenerateAdmissionNumberResponse {
  admission_number: string;
  format: string;
  explanation: string;
}

interface GenerateStudentCredentialsRequest {
  first_name: string;
  last_name: string;
  school_id: number;
}

interface GenerateStudentCredentialsResponse {
  email: string;
  username: string;
  explanation: {
    email: string;
    username: string;
  };
}

interface LoginCredentials {
  email: string;
  password: string;
  note?: string;
}

interface CreateStudentResponse {
  message: string;
  student: Student & {
    first_name: string;
    last_name: string;
    middle_name?: string;
    admission_date: string;
    user: {
      id: number;
      email: string;
      role: string;
    };
    guardians?: Array<{
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      phone?: string;
      user_id: number;
      pivot: {
        relationship: string;
        is_primary: boolean;
        emergency_contact: boolean;
      };
    }>;
  };
  login_credentials?: LoginCredentials;
}

export const studentService = {
  getStudents: async (params?: GetStudentsParams): Promise<StudentListResponse> => {
    const response = await apiClient.get('/students', { params });
    return response.data;
  },

  getStudentById: async (id: number): Promise<Student> => {
    const response = await apiClient.get(`/students/${id}`);
    return response.data;
  },

  getMyProfile: async (): Promise<Student & {
    first_name: string;
    last_name: string;
    middle_name?: string;
    email: string;
    class: ClassInfo;
    arm?: ArmInfo;
    guardians: Array<{
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      phone?: string;
      relationship: string;
      is_primary: boolean;
    }>;
    performance_summary: {
      average_score: number;
      rank: number;
      total_students: number;
    };
  }> => {
    const response = await apiClient.get('/students/me');
    return response.data;
  },

  updateMyProfile: async (data: { phone?: string; address?: string; emergency_contact?: string }): Promise<{ message: string; student: Student }> => {
    const response = await apiClient.put('/students/me', data);
    return response.data;
  },

  createStudent: async (data: CreateStudentRequest): Promise<CreateStudentResponse> => {
    const response = await apiClient.post('/students', data);
    return response.data;
  },

  generateAdmissionNumber: async (data: GenerateAdmissionNumberRequest): Promise<GenerateAdmissionNumberResponse> => {
    const response = await apiClient.post('/students/generate-admission-number', data);
    return response.data;
  },

  generateStudentCredentials: async (data: GenerateStudentCredentialsRequest): Promise<GenerateStudentCredentialsResponse> => {
    const response = await apiClient.post('/students/generate-credentials', data);
    return response.data;
  },

  updateStudent: async ({ id, data }: { id: number; data: UpdateStudentRequest }): Promise<{ message: string; student: Student }> => {
    const response = await apiClient.put(`/students/${id}`, data);
    return response.data;
  },

  deleteStudent: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/students/${id}`);
    return response.data;
  },

  getStudentAttendance: async (id: number, params?: GetStudentAttendanceParams): Promise<StudentAttendanceResponse> => {
    const response = await apiClient.get(`/students/${id}/attendance`, { params });
    return response.data;
  },

  getStudentResults: async (id: number, params?: GetStudentResultsParams): Promise<StudentResultsResponse> => {
    const response = await apiClient.get(`/students/${id}/results`, { params });
    return response.data;
  },
};

// 2. TanStack Query Hooks

export const useStudents = (params?: GetStudentsParams) => {
  return useQuery({
    queryKey: ['students', params],
    queryFn: () => studentService.getStudents(params),
  });
};

export const useStudent = (id: number) => {
  return useQuery({
    queryKey: ['student', id],
    queryFn: () => studentService.getStudentById(id),
    enabled: !!id,
  });
};

export const useMyProfile = () => {
  return useQuery({
    queryKey: ['myProfile'],
    queryFn: () => studentService.getMyProfile(),
  });
};

export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: studentService.updateMyProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
    },
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: studentService.createStudent,
    onSuccess: (data) => {
      console.log('Student created successfully', data);
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

export const useGenerateAdmissionNumber = () => {
  return useMutation({
    mutationFn: studentService.generateAdmissionNumber,
  });
};

export const useGenerateStudentCredentials = () => {
  return useMutation({
    mutationFn: studentService.generateStudentCredentials,
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: studentService.updateStudent,
    onSuccess: (data, variables) => {
      console.log('Student updated successfully', data);
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['student', variables.id] });
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: studentService.deleteStudent,
    onSuccess: () => {
      console.log('Student deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

export const useStudentAttendance = (id: number, params?: GetStudentAttendanceParams) => {
  return useQuery({
    queryKey: ['studentAttendance', id, params],
    queryFn: () => studentService.getStudentAttendance(id, params),
    enabled: !!id,
  });
};

export const useStudentResults = (id: number, params?: GetStudentResultsParams) => {
  return useQuery({
    queryKey: ['studentResults', id, params],
    queryFn: () => studentService.getStudentResults(id, params),
    enabled: !!id,
  });
};
