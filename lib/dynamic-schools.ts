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
    id: "demo-school",
    name: "Demo Elementary School",
    subdomain: "demo",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "test-school",
    name: "Test High School",
    subdomain: "test",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "greenwood-school",
    name: "Greenwood High School",
    subdomain: "greenwood",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "riverside-school",
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
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://theqcare.org' 
    : 'http://localhost:3000'
  
  return `${baseUrl}${path}?school=${subdomain}`
}

export const generateSubdomainUrl = (subdomain: string, path: string = ''): string => {
  if (process.env.NODE_ENV === 'production') {
    return `https://${subdomain}.theqcare.org${path}`
  } else {
    return `http://localhost:3000${path}?school=${subdomain}`
  }
}

