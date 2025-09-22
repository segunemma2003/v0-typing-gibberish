export type UserRole =
  | "super_admin" // Added super admin role
  | "admin"
  | "teacher"
  | "head_teacher"
  | "head_tutor"
  | "class_teacher"
  | "student"
  | "parent"
  | "librarian"
  | "house_master"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  schoolId: string // For super_admin, this will be null or "global"
  avatar?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

// Mock authentication for demo purposes
export const mockUsers: User[] = [
  {
    id: "0",
    email: "superadmin@compasse.com",
    name: "Super Administrator",
    role: "super_admin",
    schoolId: "global",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Demo Elementary School users
  {
    id: "1",
    email: "admin@school.edu",
    name: "John Administrator",
    role: "admin",
    schoolId: "school-demo",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    email: "teacher@school.edu",
    name: "Sarah Teacher",
    role: "teacher",
    schoolId: "school-demo",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    email: "student@school.edu",
    name: "Mike Student",
    role: "student",
    schoolId: "school-demo",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    email: "parent@school.edu",
    name: "Lisa Parent",
    role: "parent",
    schoolId: "school-demo",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Test High School users
  {
    id: "5",
    email: "admin@test.edu",
    name: "Test Administrator",
    role: "admin",
    schoolId: "school-test",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "6",
    email: "teacher@test.edu",
    name: "Test Teacher",
    role: "teacher",
    schoolId: "school-test",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "7",
    email: "student@test.edu",
    name: "Test Student",
    role: "student",
    schoolId: "school-test",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Greenwood High School users
  {
    id: "8",
    email: "admin@greenwood.edu",
    name: "Greenwood Administrator",
    role: "admin",
    schoolId: "school-1",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "9",
    email: "teacher@greenwood.edu",
    name: "Greenwood Teacher",
    role: "teacher",
    schoolId: "school-1",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "10",
    email: "student@greenwood.edu",
    name: "Greenwood Student",
    role: "student",
    schoolId: "school-1",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Riverside Academy users
  {
    id: "11",
    email: "admin@riverside.edu",
    name: "Riverside Administrator",
    role: "admin",
    schoolId: "school-2",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "12",
    email: "teacher@riverside.edu",
    name: "Riverside Teacher",
    role: "teacher",
    schoolId: "school-2",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "13",
    email: "student@riverside.edu",
    name: "Riverside Student",
    role: "student",
    schoolId: "school-2",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  // Mock authentication - in real app, this would call your backend
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

  const user = mockUsers.find((u) => u.email === email)
  if (user && password === "password123") {
    return user
  }
  return null
}

export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    super_admin: "Super Administrator", // Added super admin display name
    admin: "Administrator",
    teacher: "Teacher",
    head_teacher: "Head Teacher",
    head_tutor: "Head Tutor",
    class_teacher: "Class Teacher",
    student: "Student",
    parent: "Parent",
    librarian: "Librarian",
    house_master: "House Master",
  }
  return roleNames[role]
}

export const getPortalRoute = (role: UserRole): string => {
  const routes: Record<UserRole, string> = {
    super_admin: "/super-admin", // Added super admin route
    admin: "/admin",
    teacher: "/teacher",
    head_teacher: "/teacher",
    head_tutor: "/teacher",
    class_teacher: "/teacher",
    student: "/student",
    parent: "/parent",
    librarian: "/library",
    house_master: "/house",
  }
  return routes[role]
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
