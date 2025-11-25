export type UserRole =
  | "super_admin" // Added super admin role
  | "admin"
  | "teacher"
  | "head_teacher" // HOD (Head of Department)
  | "head_tutor" // Year Tutor
  | "class_teacher"
  | "subject_teacher"
  | "principal"
  | "vice_principal"
  | "student"
  | "parent"
  | "librarian"
  | "house_master"
  | "finance"
  | "accountant" // Keep for backward compatibility
  | "staff" // General staff
  | "driver"
  | "security"
  | "cleaner"
  | "caterer"
  | "nurse"

export interface User {
  id: string | number
  email: string
  name: string
  role: UserRole
  schoolId?: string | null // For super_admin, this will be null or "global"
  avatar?: string
  status?: string | null
  tenant?: {
    id: number | string
    name: string
    domain?: string | null
  } | null
  isActive?: boolean
  createdAt?: string | Date | null
  updatedAt?: string | Date | null
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    super_admin: "Super Administrator",
    admin: "Administrator",
    teacher: "Teacher",
    head_teacher: "Head of Department (HOD)",
    head_tutor: "Year Tutor",
    class_teacher: "Class Teacher",
    subject_teacher: "Subject Teacher",
    principal: "Principal",
    vice_principal: "Vice Principal",
    student: "Student",
    parent: "Parent",
    librarian: "Librarian",
    house_master: "House Master",
    finance: "Finance",
    accountant: "Accountant",
    staff: "General Staff",
    driver: "Driver",
    security: "Security",
    cleaner: "Cleaner",
    caterer: "Caterer",
    nurse: "Nurse",
  }
  return roleNames[role] || role
}

export const getPortalRoute = (role: UserRole): string => {
  const routes: Record<UserRole, string> = {
    super_admin: "/super-admin",
    admin: "/admin",
    teacher: "/teacher",
    head_teacher: "/teacher",
    head_tutor: "/teacher",
    class_teacher: "/teacher",
    subject_teacher: "/teacher",
    principal: "/teacher",
    vice_principal: "/teacher",
    student: "/student",
    parent: "/parent",
    librarian: "/library",
    house_master: "/house",
    finance: "/finance",
    accountant: "/finance",
    staff: "/staff",
    driver: "/staff/driver",
    security: "/staff/security",
    cleaner: "/staff/cleaner",
    caterer: "/staff/caterer",
    nurse: "/staff/nurse",
  }
  return routes[role] || "/admin" // Default fallback
}

// School interface for multi-tenancy
export interface School {
  id: string
  name: string
  subdomain: string
  domain?: string
  logo?: string
  address: string
  phone: string
  email: string
  principalName: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  settings: {
    timezone: string
    currency: string
    academicYearStart: string
    academicYearEnd: string
  }
}

export const mockSchools: School[] = [
  {
    id: "school-1",
    name: "Greenwood High School",
    subdomain: "greenwood",
    address: "123 Education St, Learning City",
    phone: "+1-555-0123",
    email: "info@greenwood.edu",
    principalName: "Dr. Sarah Johnson",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    settings: {
      timezone: "America/New_York",
      currency: "USD",
      academicYearStart: "2024-09-01",
      academicYearEnd: "2025-06-30",
    },
  },
  {
    id: "school-2",
    name: "Riverside Academy",
    subdomain: "riverside",
    address: "456 Knowledge Ave, Study Town",
    phone: "+1-555-0456",
    email: "contact@riverside.edu",
    principalName: "Mr. Michael Chen",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    settings: {
      timezone: "America/Los_Angeles",
      currency: "USD",
      academicYearStart: "2024-08-15",
      academicYearEnd: "2025-05-30",
    },
  },
  {
    id: "school-demo",
    name: "Demo Elementary School",
    subdomain: "demo",
    address: "789 Demo Drive, Example City",
    phone: "+1-555-DEMO",
    email: "info@demo.edu",
    principalName: "Ms. Jane Demo",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    settings: {
      timezone: "America/New_York",
      currency: "USD",
      academicYearStart: "2024-09-01",
      academicYearEnd: "2025-06-30",
    },
  },
  {
    id: "school-test",
    name: "Test High School",
    subdomain: "test",
    address: "321 Test Street, Sample City",
    phone: "+1-555-TEST",
    email: "admin@test.edu",
    principalName: "Dr. Test Administrator",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    settings: {
      timezone: "America/Chicago",
      currency: "USD",
      academicYearStart: "2024-08-20",
      academicYearEnd: "2025-06-15",
    },
  },
]

export const getSchoolBySubdomain = (subdomain: string): School | null => {
  return mockSchools.find((school) => school.subdomain === subdomain) || null
}

export const isSuperAdminDomain = (hostname: string): boolean => {
  // In production, this would check against your base domain
  // For development, we'll check if it's localhost without subdomain
  return !hostname.includes(".") || hostname === "localhost"
}
