import apiClient from './apiClient';
import { useQuery } from '@tanstack/react-query';

// 1. Service Functions

interface AdminDashboard {
  dashboard: {
    overview: {
      total_students: number;
      total_teachers: number;
      total_classes: number;
      attendance_rate: number;
    };
    recent_activities: Array<{
      id: number;
      type: string;
      description: string;
      timestamp: string;
      user: string;
    }>;
    upcoming_events: Array<{
      id: number;
      title: string;
      date: string;
      type: string;
    }>;
  };
}

interface TeacherDashboard {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    profile_picture?: string;
  };
  teacher: {
    id: number;
    employee_id: string;
    department_id: number;
    qualification?: string;
    specialization?: string;
  };
  stats: {
    my_classes: number;
    my_subjects: number;
    my_students: number;
    pending_assignments: number;
    upcoming_exams: number;
  };
  role: string;
}

interface StudentDashboard {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    profile_picture?: string;
  };
  student: {
    id: number;
    admission_number: string;
    first_name: string;
    last_name: string;
    class: {
      id: number;
      name: string;
    };
    arm: {
      id: number;
      name: string;
    };
  };
  stats: {
    my_class: {
      id: number;
      name: string;
      class_teacher?: string;
    };
    my_subjects: number;
    pending_assignments: number;
    upcoming_exams: number;
    recent_grades: Array<{
      subject: string;
      score: number;
      grade: string;
    }>;
    attendance_rate: number;
  };
  role: string;
}

interface ParentDashboard {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    profile_picture?: string;
  };
  guardian: {
    id: number;
    first_name: string;
    last_name: string;
    phone: string;
    occupation?: string;
    relationship: string;
  };
  children: Array<{
    id: number;
    name: string;
    admission_number: string;
    class: string;
    profile_picture?: string;
    stats: {
      average_score: number;
      attendance_rate: number;
      rank: number;
      pending_assignments: number;
    };
  }>;
  stats: {
    total_children: number;
    upcoming_events: number;
    pending_fees: number;
    unread_messages: number;
  };
  role: string;
}

interface SuperAdminDashboard {
  dashboard: {
    total_tenants: number;
    active_tenants: number;
    total_schools: number;
    total_users: number;
    system_health: string;
    recent_activities: Array<{
      id: number;
      type: string;
      description: string;
      timestamp: string;
    }>;
  };
}

interface StaffDashboard {
  dashboard: {
    total_tasks?: number;
    completed_tasks?: number;
    pending_tasks?: number;
    recent_activities?: Array<{
      id: number;
      type: string;
      description: string;
      timestamp: string;
    }>;
  };
}

interface FinanceDashboard {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  stats: {
    total_revenue: {
      today: number;
      this_month: number;
      this_term: number;
      this_year: number;
    };
    pending_fees: {
      amount: number;
      students: number;
    };
    expenses: {
      today: number;
      this_month: number;
      this_term: number;
    };
    payroll: {
      pending: number;
      paid_this_month: number;
    };
    outstanding_invoices: number;
    overdue_payments: number;
    profit_margin: number;
  };
  recent_transactions: Array<{
    id: number;
    type: string;
    description: string;
    amount: number;
    date: string;
    status: string;
  }>;
  pending_approvals: Array<{
    id: number;
    type: string;
    description: string;
    amount: number;
    requested_by: string;
    date: string;
  }>;
  role: string;
}

interface LibrarianDashboard {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  stats: {
    total_books: number;
    available_books: number;
    borrowed_books: number;
    overdue_books: number;
    total_members: number;
    active_members: number;
    books_added_this_month: number;
    popular_categories: Array<{
      id: number;
      name: string;
      count: number;
    }>;
  };
  recent_borrows: Array<{
    id: number;
    book: {
      id: number;
      title: string;
      author: string;
    };
    student: {
      id: number;
      name: string;
      admission_number: string;
    };
    borrowed_at: string;
    due_date: string;
    status: string;
  }>;
  overdue_list: Array<{
    id: number;
    book: {
      id: number;
      title: string;
      author: string;
    };
    student: {
      id: number;
      name: string;
      admission_number: string;
    };
    borrowed_at: string;
    due_date: string;
    days_overdue: number;
    fine?: number;
  }>;
  pending_requests: Array<{
    id: number;
    book: {
      id: number;
      title: string;
    };
    student: {
      id: number;
      name: string;
    };
    requested_at: string;
    status: string;
  }>;
  role: string;
}

interface DriverDashboard {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  vehicle: {
    id: number;
    name: string;
    plate_number: string;
    capacity: number;
    status: string;
  };
  route: {
    id: number;
    name: string;
    students_count: number;
    pickup_points: number;
  };
  stats: {
    today_trips: number;
    students_today: number;
    total_trips_this_month: number;
    pending_maintenance: boolean;
    fuel_status: string;
  };
  today_schedule: Array<{
    id: number;
    time: string;
    location: string;
    students_count: number;
    type: 'pickup' | 'dropoff';
  }>;
  students_list: Array<{
    id: number;
    name: string;
    admission_number: string;
    pickup_point: string;
    pickup_time: string;
    status: string;
  }>;
  role: string;
}

interface SecurityDashboard {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    profile_picture?: string;
  };
  stats: {
    visitors_today: number;
    vehicles_in_campus: number;
    gate_passes_issued: number;
    incidents_this_week: number;
    patrol_checkpoints: number;
    cctv_cameras_active: number;
    cctv_cameras_inactive: number;
  };
  current_visitors?: Array<{
    id: number;
    name: string;
    purpose: string;
    person_to_see: string;
    entry_time: string;
  }>;
  recent_incidents?: Array<{
    id: number;
    type: string;
    severity: string;
    location: string;
    reported_time: string;
    status: string;
  }>;
  patrol_schedule?: Array<{
    id: number;
    checkpoint: string;
    location: string;
    scheduled_time: string;
    status: string;
  }>;
  role: string;
}

interface NurseDashboard {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    profile_picture?: string;
  };
  stats: {
    clinic_visits_today: number;
    students_with_chronic_conditions: number;
    medications_due_today: number;
    pending_vaccinations: number;
    first_aid_cases_this_week: number;
    medical_supplies_low: number;
  };
  today_appointments?: Array<{
    id: number;
    student_id: number;
    student_name: string;
    appointment_time: string;
    reason: string;
    status: string;
  }>;
  medication_schedule?: Array<{
    id: number;
    student_id: number;
    student_name: string;
    medication_name: string;
    time: string;
    status: string;
  }>;
  recent_cases?: Array<{
    id: number;
    student_id: number;
    student_name: string;
    complaint: string;
    visit_date: string;
    status: string;
  }>;
  role: string;
}

interface HODDashboard {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    profile_picture?: string;
  };
  department: {
    id: number;
    name: string;
    total_teachers: number;
    total_subjects: number;
    total_students: number;
  };
  stats: {
    department_average: number;
    teachers_present_today: number;
    subjects_taught: number;
    pending_approvals: number;
  };
  teacher_performance?: Array<{
    id: number;
    name: string;
    average_score: number;
    student_count: number;
    attendance_rate: number;
  }>;
  subject_statistics?: Array<{
    id: number;
    name: string;
    average_score: number;
    pass_rate: number;
    student_count: number;
  }>;
  recent_activities?: Array<{
    id: number;
    type: string;
    description: string;
    timestamp: string;
    user?: string;
  }>;
  role: string;
}

interface PrincipalDashboard {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  school_overview: {
    total_students: number;
    total_teachers: number;
    total_staff: number;
    total_classes: number;
    student_teacher_ratio: number;
  };
  academic_performance: {
    overall_average: number;
    top_performing_class: string;
    pass_rate: number;
  };
  attendance: {
    student_attendance_today: number;
    teacher_attendance_today: number;
    absent_students: number;
    absent_teachers: number;
  };
  pending_approvals: {
    leave_requests: number;
    disciplinary_cases: number;
    expense_approvals: number;
  };
  recent_activities: Array<{
    id: number;
    type: string;
    description: string;
    timestamp: string;
    user?: string;
  }>;
  role: string;
}

export const dashboardService = {
  getAdminDashboard: async (): Promise<AdminDashboard> => {
    const response = await apiClient.get('/dashboard/admin');
    // API returns { dashboard: {...} }
    return response.data;
  },

  getTeacherDashboard: async (): Promise<TeacherDashboard> => {
    const response = await apiClient.get('/dashboard/teacher');
    // API returns { dashboard: {...} }
    return response.data;
  },

  getStudentDashboard: async (): Promise<StudentDashboard> => {
    const response = await apiClient.get('/dashboard/student');
    // API returns { dashboard: {...} }
    return response.data;
  },

  getParentDashboard: async (): Promise<ParentDashboard> => {
    const response = await apiClient.get('/dashboard/parent');
    // API returns { dashboard: {...} }
    return response.data;
  },

  getSuperAdminDashboard: async (): Promise<SuperAdminDashboard> => {
    const response = await apiClient.get('/dashboard/super-admin');
    // API returns { dashboard: {...} } or { analytics: {...} }
    return response.data;
  },

  getStaffDashboard: async (role?: string): Promise<StaffDashboard> => {
    const endpoint = role ? `/dashboard/staff/${role}` : '/dashboard/staff';
    const response = await apiClient.get(endpoint);
    return response.data;
  },

  getFinanceDashboard: async (): Promise<FinanceDashboard> => {
    const response = await apiClient.get('/dashboard/finance');
    return response.data;
  },

  getLibrarianDashboard: async (): Promise<LibrarianDashboard> => {
    const response = await apiClient.get('/dashboard/librarian');
    return response.data;
  },

  getDriverDashboard: async (): Promise<DriverDashboard> => {
    const response = await apiClient.get('/dashboard/driver');
    return response.data;
  },

  getPrincipalDashboard: async (): Promise<PrincipalDashboard> => {
    const response = await apiClient.get('/dashboard/principal');
    return response.data;
  },

  getHODDashboard: async (): Promise<HODDashboard> => {
    const response = await apiClient.get('/dashboard/hod');
    return response.data;
  },

  getNurseDashboard: async (): Promise<NurseDashboard> => {
    const response = await apiClient.get('/dashboard/nurse');
    return response.data;
  },

  getSecurityDashboard: async (): Promise<SecurityDashboard> => {
    const response = await apiClient.get('/dashboard/security');
    return response.data;
  },

  // School Admin Dashboard APIs
  getDashboard: async (): Promise<{
    summary: {
      students: number;
      teachers: number;
      staff: number;
      classes: number;
    };
    recent_activities: Array<{
      id: number;
      type: string;
      description: string;
      timestamp: string;
      user?: string;
    }>;
    upcoming_events: Array<{
      id: number;
      title: string;
      date: string;
      type: string;
    }>;
  }> => {
    const response = await apiClient.get('/dashboard');
    return response.data;
  },

  getDashboardStats: async (): Promise<{
    users: number;
    students: number;
    teachers: number;
    classes: number;
    subjects: number;
  }> => {
    const response = await apiClient.get('/dashboard/stats');
    return response.data;
  },
};

// 2. TanStack Query Hooks

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['adminDashboard'],
    queryFn: dashboardService.getAdminDashboard,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useTeacherDashboard = () => {
  return useQuery({
    queryKey: ['teacherDashboard'],
    queryFn: dashboardService.getTeacherDashboard,
    staleTime: 1000 * 60 * 5,
  });
};

export const useStudentDashboard = () => {
  return useQuery({
    queryKey: ['studentDashboard'],
    queryFn: dashboardService.getStudentDashboard,
    staleTime: 1000 * 60 * 5,
  });
};

export const useParentDashboard = () => {
  return useQuery({
    queryKey: ['parentDashboard'],
    queryFn: dashboardService.getParentDashboard,
    staleTime: 1000 * 60 * 5,
  });
};

export const useSuperAdminDashboard = () => {
  return useQuery({
    queryKey: ['superAdminDashboard'],
    queryFn: dashboardService.getSuperAdminDashboard,
    staleTime: 1000 * 60 * 5,
  });
};

export const useStaffDashboard = (role?: string) => {
  return useQuery({
    queryKey: ['staffDashboard', role],
    queryFn: () => dashboardService.getStaffDashboard(role),
    staleTime: 1000 * 60 * 5,
  });
};

export const useFinanceDashboard = () => {
  return useQuery({
    queryKey: ['financeDashboard'],
    queryFn: dashboardService.getFinanceDashboard,
    staleTime: 1000 * 60 * 5,
  });
};

export const useLibrarianDashboard = () => {
  return useQuery({
    queryKey: ['librarianDashboard'],
    queryFn: dashboardService.getLibrarianDashboard,
    staleTime: 1000 * 60 * 5,
  });
};

export const useDriverDashboard = () => {
  return useQuery({
    queryKey: ['driverDashboard'],
    queryFn: dashboardService.getDriverDashboard,
    staleTime: 1000 * 60 * 2, // 2 minutes for real-time updates
  });
};

export const usePrincipalDashboard = () => {
  return useQuery({
    queryKey: ['principalDashboard'],
    queryFn: dashboardService.getPrincipalDashboard,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useHODDashboard = () => {
  return useQuery({
    queryKey: ['hodDashboard'],
    queryFn: dashboardService.getHODDashboard,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useNurseDashboard = () => {
  return useQuery({
    queryKey: ['nurseDashboard'],
    queryFn: dashboardService.getNurseDashboard,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useSecurityDashboard = () => {
  return useQuery({
    queryKey: ['securityDashboard'],
    queryFn: dashboardService.getSecurityDashboard,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// School Admin Dashboard Hooks
export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardService.getDashboard,
    staleTime: 1000 * 60 * 5,
  });
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: dashboardService.getDashboardStats,
    staleTime: 1000 * 60 * 5,
  });
};

