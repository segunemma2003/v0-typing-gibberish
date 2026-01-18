import apiClient from './apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 1. Service Functions

interface Arm {
  id: number;
  name: string;
  class_teacher?: { id: number; name: string };
}

interface Class {
  id: number;
  name: string;
  level: string;
  arms: Arm[];
  student_count: number;
}

interface SubjectTeacher {
  id: number;
  name: string;
}

interface Subject {
  id: number;
  name: string;
  code: string;
  description: string;
  teachers: SubjectTeacher[];
}

interface ClassListResponse {
  data: Class[];
}

interface SubjectListResponse {
  data: Subject[];
}

interface CreateClassRequest {
  name: string;
  level: string;
  arms: string[];
  academic_year_id: number;
  term_id: number;
}

interface CreateSubjectRequest {
  name: string;
  code: string;
  description: string;
  department_id: number;
  teacher_ids: number[];
}

interface AcademicYear {
  id: number;
  school_id: number;
  name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  status: 'pending' | 'active' | 'completed';
  total_terms?: number;
  created_at: string;
  updated_at?: string;
}

interface Term {
  id: number;
  school_id: number;
  academic_year_id: number;
  name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  status: 'pending' | 'active' | 'completed';
  created_at: string;
  updated_at?: string;
  academic_year?: {
    id: number;
    name: string;
    start_date?: string;
    end_date?: string;
  };
}

interface CreateAcademicYearRequest {
  name: string;
  start_date: string;
  end_date: string;
  is_current?: boolean;
  status?: 'pending' | 'active' | 'completed';
}

interface CreateTermRequest {
  academic_year_id: number;
  name: string;
  start_date: string;
  end_date: string;
  is_current?: boolean;
  status?: 'pending' | 'active' | 'completed';
}

export const academicService = {
  // Classes
  getClasses: async (): Promise<Class[] | ClassListResponse> => {
    const response = await apiClient.get('/classes');
    // API may return direct array or wrapped in { data: [...] }
    return response.data;
  },

  createClass: async (data: CreateClassRequest): Promise<{ message: string; class: Class }> => {
    const response = await apiClient.post('/classes', data);
    return response.data;
  },

  // Subjects
  getSubjects: async (): Promise<Subject[] | SubjectListResponse> => {
    const response = await apiClient.get('/subjects');
    // API may return direct array or wrapped in { data: [...] }
    return response.data;
  },

  createSubject: async (data: CreateSubjectRequest): Promise<{ message: string; subject: Subject }> => {
    const response = await apiClient.post('/subjects', data);
    return response.data;
  },

  updateClass: async ({ id, data }: { id: number; data: Partial<CreateClassRequest> }): Promise<{ message: string; class: Class }> => {
    const response = await apiClient.put(`/classes/${id}`, data);
    return response.data;
  },

  deleteClass: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/classes/${id}`);
    return response.data;
  },

  updateSubject: async ({ id, data }: { id: number; data: Partial<CreateSubjectRequest> }): Promise<{ message: string; subject: Subject }> => {
    const response = await apiClient.put(`/subjects/${id}`, data);
    return response.data;
  },

  deleteSubject: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/subjects/${id}`);
    return response.data;
  },

  // Academic Years
  getAcademicYears: async (params?: { per_page?: number; page?: number; status?: string; is_current?: boolean }): Promise<AcademicYear[] | { data: AcademicYear[]; current_page?: number; per_page?: number; total?: number; last_page?: number }> => {
    const response = await apiClient.get('/academic-years', { params });
    // API returns direct array, so return it directly
    return response.data;
  },

  getAcademicYearById: async (id: number): Promise<{ academic_year: AcademicYear & { terms?: Term[]; statistics?: any } }> => {
    const response = await apiClient.get(`/academic-years/${id}`);
    return response.data;
  },

  createAcademicYear: async (data: CreateAcademicYearRequest): Promise<{ message: string; academic_year: AcademicYear }> => {
    const response = await apiClient.post('/academic-years', data);
    return response.data;
  },

  updateAcademicYear: async ({ id, data }: { id: number; data: Partial<CreateAcademicYearRequest> }): Promise<{ message: string; academic_year: AcademicYear }> => {
    const response = await apiClient.put(`/academic-years/${id}`, data);
    return response.data;
  },

  deleteAcademicYear: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/academic-years/${id}`);
    return response.data;
  },

  // Terms
  getTerms: async (params?: { per_page?: number; page?: number; academic_year_id?: number; status?: string; is_current?: boolean }): Promise<Term[] | { data: Term[]; current_page?: number; per_page?: number; total?: number; last_page?: number }> => {
    const response = await apiClient.get('/terms', { params });
    // API returns direct array, so return it directly
    return response.data;
  },

  getTermById: async (id: number): Promise<{ term: Term & { academic_year?: AcademicYear; statistics?: any } }> => {
    const response = await apiClient.get(`/terms/${id}`);
    return response.data;
  },

  createTerm: async (data: CreateTermRequest): Promise<{ message: string; term: Term }> => {
    const response = await apiClient.post('/terms', data);
    return response.data;
  },

  updateTerm: async ({ id, data }: { id: number; data: Partial<CreateTermRequest> }): Promise<{ message: string; term: Term }> => {
    const response = await apiClient.put(`/terms/${id}`, data);
    return response.data;
  },

  deleteTerm: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/terms/${id}`);
    return response.data;
  },

  // Student-specific endpoints
  getMyClass: async (): Promise<{
    id: number;
    name: string;
    description?: string;
    capacity: number;
    students_count: number;
    class_teacher: {
      id: number;
      name: string;
      email: string;
      phone?: string;
    };
    subjects: Array<{
      id: number;
      name: string;
      code?: string;
      teacher: {
        id: number;
        name: string;
        email: string;
        phone?: string;
      };
    }>;
  }> => {
    const response = await apiClient.get('/classes/my-class');
    return response.data;
  },

  getMySubjects: async (): Promise<Array<{
    id: number;
    name: string;
    code: string;
    description?: string;
    teacher: {
      name: string;
      email: string;
      phone?: string;
    };
    my_performance: {
      average_score: number;
      total_assignments: number;
      completed_assignments: number;
      total_exams: number;
      exam_average: number;
    };
  }>> => {
    const response = await apiClient.get('/subjects/my-subjects');
    return response.data;
  },

  // HOD-specific endpoints
  getSubjectPerformance: async (subjectId: number): Promise<{
    subject: {
      id: number;
      name: string;
      code?: string;
    };
    statistics: {
      total_students: number;
      average_score: number;
      pass_rate: number;
      highest_score: number;
      lowest_score: number;
    };
    class_performance: Array<{
      class_id: number;
      class_name: string;
      average_score: number;
      student_count: number;
    }>;
  }> => {
    const response = await apiClient.get(`/subjects/${subjectId}/performance`);
    return response.data;
  },

  getCurriculumProgress: async (subjectId: number): Promise<{
    subject: {
      id: number;
      name: string;
    };
    curriculum: Array<{
      topic: string;
      planned_date: string;
      completed_date?: string;
      status: 'pending' | 'in_progress' | 'completed';
      completion_percentage: number;
    }>;
    overall_progress: number;
  }> => {
    const response = await apiClient.get(`/subjects/${subjectId}/curriculum-progress`);
    return response.data;
  },

  // Get Class with students
  getClass: async (id: number): Promise<{
    id: number;
    name: string;
    students: Array<{
      id: number;
      first_name: string;
      last_name: string;
      admission_number: string;
    }>;
  }> => {
    const response = await apiClient.get(`/classes/${id}`);
    return response.data;
  },

  // Get Class Students
  getClassStudents: async (id: number): Promise<{
    class: {
      id: number;
      name: string;
    };
    students: Array<{
      id: number;
      first_name: string;
      last_name: string;
      admission_number: string;
    }>;
  }> => {
    const response = await apiClient.get(`/classes/${id}/students`);
    return response.data;
  },

  // Arms (Class Sections) Management
  getArms: async (): Promise<{
    arms: Array<{
      id: number;
      name: string;
      description?: string;
      status: 'active' | 'inactive';
    }>;
  }> => {
    const response = await apiClient.get('/arms');
    return response.data;
  },

  getArm: async (id: number): Promise<{
    id: number;
    name: string;
    description?: string;
    status: 'active' | 'inactive';
  }> => {
    const response = await apiClient.get(`/arms/${id}`);
    return response.data;
  },

  createArm: async (data: {
    name: string;
    description?: string;
  }): Promise<{
    message: string;
    arm: {
      id: number;
      name: string;
      description?: string;
      status: 'active';
    };
  }> => {
    const response = await apiClient.post('/arms', data);
    return response.data;
  },

  updateArm: async ({ id, data }: {
    id: number;
    data: {
      name?: string;
      description?: string;
      status?: 'active' | 'inactive';
    };
  }): Promise<{
    message: string;
    arm: {
      id: number;
      name: string;
      description?: string;
      status: 'active' | 'inactive';
    };
  }> => {
    const response = await apiClient.put(`/arms/${id}`, data);
    return response.data;
  },

  deleteArm: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/arms/${id}`);
    return response.data;
  },

  assignArmToClass: async (data: {
    arm_id: number;
    class_id: number;
  }): Promise<{ message: string }> => {
    const response = await apiClient.post('/arms/assign-to-class', data);
    return response.data;
  },

  removeArmFromClass: async (data: {
    arm_id: number;
    class_id: number;
  }): Promise<{ message: string }> => {
    const response = await apiClient.post('/arms/remove-from-class', data);
    return response.data;
  },

  getClassArms: async (classId: number): Promise<{
    class: {
      id: number;
      name: string;
    };
    arms: Array<{
      id: number;
      name: string;
      description?: string;
      status: 'active' | 'inactive';
    }>;
  }> => {
    const response = await apiClient.get(`/arms/class/${classId}`);
    return response.data;
  },

  getArmStudents: async (armId: number): Promise<{
    arm: {
      id: number;
      name: string;
    };
    students: Array<{
      id: number;
      first_name: string;
      last_name: string;
      admission_number: string;
    }>;
  }> => {
    const response = await apiClient.get(`/arms/${armId}/students`);
    return response.data;
  },
};

// 2. TanStack Query Hooks

// Classes
export const useClasses = () => {
  return useQuery({
    queryKey: ['classes'],
    queryFn: academicService.getClasses,
  });
};

export const useCreateClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: academicService.createClass,
    onSuccess: (data) => {
      console.log('Class created successfully', data);
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
};

// Subjects
export const useSubjects = () => {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: academicService.getSubjects,
  });
};

export const useCreateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: academicService.createSubject,
    onSuccess: (data) => {
      console.log('Subject created successfully', data);
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });
};

export const useUpdateClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: academicService.updateClass,
    onSuccess: (data, variables) => {
      console.log('Class updated successfully', data);
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      queryClient.invalidateQueries({ queryKey: ['class', variables.id] });
    },
  });
};

export const useDeleteClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: academicService.deleteClass,
    onSuccess: () => {
      console.log('Class deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
};

export const useUpdateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: academicService.updateSubject,
    onSuccess: (data, variables) => {
      console.log('Subject updated successfully', data);
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      queryClient.invalidateQueries({ queryKey: ['subject', variables.id] });
    },
  });
};

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: academicService.deleteSubject,
    onSuccess: () => {
      console.log('Subject deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });
};

// Academic Years
export const useAcademicYears = (params?: { per_page?: number; page?: number; status?: string; is_current?: boolean }) => {
  return useQuery({
    queryKey: ['academicYears', params],
    queryFn: () => academicService.getAcademicYears(params),
  });
};

export const useAcademicYear = (id: number) => {
  return useQuery({
    queryKey: ['academicYear', id],
    queryFn: () => academicService.getAcademicYearById(id),
    enabled: !!id,
  });
};

export const useCreateAcademicYear = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: academicService.createAcademicYear,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academicYears'] });
    },
  });
};

export const useUpdateAcademicYear = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: academicService.updateAcademicYear,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['academicYears'] });
      queryClient.invalidateQueries({ queryKey: ['academicYear', variables.id] });
    },
  });
};

export const useDeleteAcademicYear = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: academicService.deleteAcademicYear,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academicYears'] });
    },
  });
};

// Terms
export const useTerms = (params?: { per_page?: number; page?: number; academic_year_id?: number; status?: string; is_current?: boolean }) => {
  return useQuery({
    queryKey: ['terms', params],
    queryFn: () => academicService.getTerms(params),
  });
};

export const useTerm = (id: number) => {
  return useQuery({
    queryKey: ['term', id],
    queryFn: () => academicService.getTermById(id),
    enabled: !!id,
  });
};

export const useCreateTerm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: academicService.createTerm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terms'] });
      queryClient.invalidateQueries({ queryKey: ['academicYears'] }); // Refresh academic years to update term counts
    },
  });
};

export const useUpdateTerm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: academicService.updateTerm,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['terms'] });
      queryClient.invalidateQueries({ queryKey: ['term', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['academicYears'] });
    },
  });
};

export const useDeleteTerm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: academicService.deleteTerm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terms'] });
      queryClient.invalidateQueries({ queryKey: ['academicYears'] });
    },
  });
};

// Student-specific hooks
export const useMyClass = () => {
  return useQuery({
    queryKey: ['myClass'],
    queryFn: academicService.getMyClass,
  });
};

export const useMySubjects = () => {
  return useQuery({
    queryKey: ['mySubjects'],
    queryFn: academicService.getMySubjects,
  });
};

// HOD-specific hooks
export const useSubjectPerformance = (subjectId: number) => {
  return useQuery({
    queryKey: ['subjectPerformance', subjectId],
    queryFn: () => academicService.getSubjectPerformance(subjectId),
    enabled: !!subjectId,
  });
};

export const useCurriculumProgress = (subjectId: number) => {
  return useQuery({
    queryKey: ['curriculumProgress', subjectId],
    queryFn: () => academicService.getCurriculumProgress(subjectId),
    enabled: !!subjectId,
  });
};

// Class Hooks
export const useClass = (id: number) => {
  return useQuery({
    queryKey: ['class', id],
    queryFn: () => academicService.getClass(id),
    enabled: !!id,
  });
};

export const useClassStudents = (id: number) => {
  return useQuery({
    queryKey: ['classStudents', id],
    queryFn: () => academicService.getClassStudents(id),
    enabled: !!id,
  });
};

// Arms (Class Sections) Hooks
export const useArms = () => {
  return useQuery({
    queryKey: ['arms'],
    queryFn: () => academicService.getArms(),
  });
};

export const useArm = (id: number) => {
  return useQuery({
    queryKey: ['arm', id],
    queryFn: () => academicService.getArm(id),
    enabled: !!id,
  });
};

export const useCreateArm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: academicService.createArm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['arms'] });
    },
  });
};

export const useUpdateArm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: academicService.updateArm,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['arms'] });
      queryClient.invalidateQueries({ queryKey: ['arm', variables.id] });
    },
  });
};

export const useDeleteArm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: academicService.deleteArm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['arms'] });
    },
  });
};

export const useAssignArmToClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: academicService.assignArmToClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['arms'] });
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
};

export const useRemoveArmFromClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: academicService.removeArmFromClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['arms'] });
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
};

export const useClassArms = (classId: number) => {
  return useQuery({
    queryKey: ['classArms', classId],
    queryFn: () => academicService.getClassArms(classId),
    enabled: !!classId,
  });
};

export const useArmStudents = (armId: number) => {
  return useQuery({
    queryKey: ['armStudents', armId],
    queryFn: () => academicService.getArmStudents(armId),
    enabled: !!armId,
  });
};
