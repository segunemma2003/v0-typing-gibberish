// Dynamic school management for multitenancy
export interface DynamicSchool {
  id: string
  name: string
  subdomain: string
  domain?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// In-memory storage for demo (in production, use database)
let dynamicSchools: DynamicSchool[] = [
  {
    id: "school-demo",
    name: "Demo Elementary School",
    subdomain: "demo",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "school-test",
    name: "Test High School",
    subdomain: "test",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "school-1",
    name: "Greenwood High School",
    subdomain: "greenwood",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "school-2",
    name: "Riverside Academy",
    subdomain: "riverside",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export const getDynamicSchools = (): DynamicSchool[] => {
  return dynamicSchools.filter(school => school.isActive)
}

export const getDynamicSchoolBySubdomain = (subdomain: string): DynamicSchool | null => {
  return dynamicSchools.find(school => 
    school.subdomain === subdomain && school.isActive
  ) || null
}

export const registerNewSchool = (schoolData: Omit<DynamicSchool, 'id' | 'createdAt' | 'updatedAt'>): DynamicSchool => {
  const newSchool: DynamicSchool = {
    ...schoolData,
    id: `school-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  
  dynamicSchools.push(newSchool)
  return newSchool
}

export const updateSchoolStatus = (subdomain: string, isActive: boolean): boolean => {
  const school = dynamicSchools.find(s => s.subdomain === subdomain)
  if (school) {
    school.isActive = isActive
    school.updatedAt = new Date()
    return true
  }
  return false
}

export const validateSchoolSubdomain = (subdomain: string): boolean => {
  // Check if subdomain is valid (alphanumeric, lowercase, no special chars)
  const subdomainRegex = /^[a-z0-9-]+$/
  if (!subdomainRegex.test(subdomain)) return false
  
  // Check if subdomain is not reserved
  const reservedSubdomains = ['www', 'api', 'admin', 'app', 'mail', 'ftp', 'blog', 'shop', 'support', 'help']
  if (reservedSubdomains.includes(subdomain)) return false
  
  // Check if subdomain is not already taken
  const existingSchool = dynamicSchools.find(s => s.subdomain === subdomain)
  if (existingSchool) return false
  
  return true
}

export const generateSchoolUrl = (subdomain: string, path: string = ''): string => {
  // Always use subdomain approach in production
  if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_MAIN_DOMAIN) {
    return `https://${subdomain}.theqcare.org${path}`
  }
  // Development: use URL parameter for testing
  return `http://localhost:3000${path}?school=${subdomain}`
}

export const generateSubdomainUrl = (subdomain: string, path: string = ''): string => {
  if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_MAIN_DOMAIN) {
    return `https://${subdomain}.theqcare.org${path}`
  } else {
    return `http://localhost:3000${path}?school=${subdomain}`
  }
}
