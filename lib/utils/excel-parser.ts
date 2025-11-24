/**
 * Excel parsing utilities for bulk uploads
 * Maps Excel columns to API request format
 */

export interface ExcelStudentRow {
  first_name?: string
  last_name?: string
  middle_name?: string
  class_id?: number | string
  class_name?: string
  arm_id?: number | string
  arm_name?: string
  date_of_birth?: string
  gender?: string
  phone?: string
  address?: string
  blood_group?: string
  parent_name?: string
  parent_phone?: string
  parent_email?: string
  emergency_contact?: string
  allergies?: string
  medications?: string
  route_id?: number | string
  pickup_point?: string
}

export interface ExcelTeacherRow {
  first_name?: string
  last_name?: string
  middle_name?: string
  department_id?: number | string
  department_name?: string
  qualification?: string
  experience_years?: number | string
  hire_date?: string
  employment_date?: string
  date_of_birth?: string
  gender?: string
  phone?: string
  address?: string
}

export interface ExcelStaffRow {
  first_name?: string
  last_name?: string
  middle_name?: string
  department_id?: number | string
  department_name?: string
  position?: string
  date_of_birth?: string
  gender?: string
  phone?: string
  address?: string
  qualification?: string
  hire_date?: string
  employment_date?: string
  salary?: number | string
  employment_type?: string
}

export interface ExcelGuardianRow {
  first_name?: string
  last_name?: string
  middle_name?: string
  email?: string
  phone?: string
  address?: string
  occupation?: string
  employer?: string
  student_ids?: string // Comma-separated student IDs or admission numbers
  relationship?: string
  is_primary?: string | boolean
  emergency_contact?: string | boolean
}

export interface ExcelQuestionRow {
  subject_id?: number | string
  subject_name?: string
  class_id?: number | string
  class_name?: string
  term_id?: number | string
  term_name?: string
  academic_year_id?: number | string
  academic_year_name?: string
  question_type?: string
  question?: string
  option_a?: string
  option_b?: string
  option_c?: string
  option_d?: string
  option_e?: string
  correct_answer?: string
  explanation?: string
  difficulty?: string
  marks?: number | string
  tags?: string
  topic?: string
  hints?: string
}

/**
 * Parse Excel row to student format
 */
export function parseStudentRow(row: any, classMap: Map<string, number>, armMap: Map<string, number>): any {
  const student: any = {
    first_name: String(row.first_name || row["first name"] || "").trim(),
    last_name: String(row.last_name || row["last name"] || "").trim(),
  }

  if (row.middle_name || row["middle name"]) {
    student.middle_name = String(row.middle_name || row["middle name"] || "").trim()
  }

  // Handle class_id - can be ID or name
  if (row.class_id || row["class id"] || row.class_name || row["class name"] || row.class) {
    const classValue = row.class_id || row["class id"] || row.class_name || row["class name"] || row.class
    if (typeof classValue === "number") {
      student.class_id = classValue
    } else if (classMap.has(String(classValue).trim())) {
      student.class_id = classMap.get(String(classValue).trim())
    }
  }

  // Handle arm_id - can be ID or name
  if (row.arm_id || row["arm id"] || row.arm_name || row["arm name"] || row.arm) {
    const armValue = row.arm_id || row["arm id"] || row.arm_name || row["arm name"] || row.arm
    if (typeof armValue === "number") {
      student.arm_id = armValue
    } else if (armMap.has(String(armValue).trim())) {
      student.arm_id = armMap.get(String(armValue).trim())
    }
  }

  if (row.date_of_birth || row["date of birth"] || row.dob) {
    student.date_of_birth = formatDate(row.date_of_birth || row["date of birth"] || row.dob)
  }

  if (row.gender) {
    const gender = String(row.gender).toLowerCase().trim()
    if (["male", "female", "other", "m", "f"].includes(gender)) {
      student.gender = gender === "m" ? "male" : gender === "f" ? "female" : gender
    }
  }

  if (row.phone || row["phone number"]) {
    student.phone = String(row.phone || row["phone number"] || "").trim()
  }

  if (row.address) {
    student.address = String(row.address).trim()
  }

  if (row.blood_group || row["blood group"]) {
    student.blood_group = String(row.blood_group || row["blood group"] || "").trim()
  }

  if (row.parent_name || row["parent name"]) {
    student.parent_name = String(row.parent_name || row["parent name"] || "").trim()
  }

  if (row.parent_phone || row["parent phone"]) {
    student.parent_phone = String(row.parent_phone || row["parent phone"] || "").trim()
  }

  if (row.parent_email || row["parent email"]) {
    student.parent_email = String(row.parent_email || row["parent email"] || "").trim()
  }

  if (row.emergency_contact || row["emergency contact"]) {
    student.emergency_contact = String(row.emergency_contact || row["emergency contact"] || "").trim()
  }

  // Medical info
  const allergies = row.allergies || row.allergy
  const medications = row.medications || row.medication
  if (allergies || medications) {
    student.medical_info = {}
    if (allergies) {
      student.medical_info.allergies = String(allergies)
        .split(/[,;]/)
        .map((a: string) => a.trim())
        .filter(Boolean)
    }
    if (medications) {
      student.medical_info.medications = String(medications)
        .split(/[,;]/)
        .map((m: string) => m.trim())
        .filter(Boolean)
    }
  }

  // Transport info
  if (row.route_id || row["route id"] || row.pickup_point || row["pickup point"]) {
    student.transport_info = {}
    if (row.route_id || row["route id"]) {
      const routeValue = row.route_id || row["route id"]
      if (typeof routeValue === "number") {
        student.transport_info.route_id = routeValue
      }
    }
    if (row.pickup_point || row["pickup point"]) {
      student.transport_info.pickup_point = String(row.pickup_point || row["pickup point"] || "").trim()
    }
  }

  return student
}

/**
 * Parse Excel row to teacher format
 */
export function parseTeacherRow(row: any, departmentMap: Map<string, number>): any {
  const teacher: any = {
    first_name: String(row.first_name || row["first name"] || "").trim(),
    last_name: String(row.last_name || row["last name"] || "").trim(),
  }

  if (row.middle_name || row["middle name"]) {
    teacher.middle_name = String(row.middle_name || row["middle name"] || "").trim()
  }

  // Handle department
  if (row.department_id || row["department id"] || row.department_name || row["department name"] || row.department) {
    const deptValue = row.department_id || row["department id"] || row.department_name || row["department name"] || row.department
    if (typeof deptValue === "number") {
      teacher.department_id = deptValue
    } else if (departmentMap.has(String(deptValue).trim())) {
      teacher.department_id = departmentMap.get(String(deptValue).trim())
    }
  }

  if (row.qualification) {
    teacher.qualification = String(row.qualification).trim()
  }

  if (row.experience_years || row["experience years"]) {
    const exp = row.experience_years || row["experience years"]
    teacher.experience_years = typeof exp === "number" ? exp : parseInt(String(exp)) || undefined
  }

  const hireDate = row.hire_date || row["hire date"] || row.employment_date || row["employment date"]
  if (hireDate) {
    teacher.employment_date = formatDate(hireDate)
  }

  if (row.date_of_birth || row["date of birth"] || row.dob) {
    teacher.date_of_birth = formatDate(row.date_of_birth || row["date of birth"] || row.dob)
  }

  if (row.gender) {
    const gender = String(row.gender).toLowerCase().trim()
    if (["male", "female", "other", "m", "f"].includes(gender)) {
      teacher.gender = gender === "m" ? "male" : gender === "f" ? "female" : gender
    }
  }

  if (row.phone || row["phone number"]) {
    teacher.phone = String(row.phone || row["phone number"] || "").trim()
  }

  if (row.address) {
    teacher.address = String(row.address).trim()
  }

  return teacher
}

/**
 * Parse Excel row to staff format
 */
export function parseStaffRow(row: any, departmentMap: Map<string, number>): any {
  const staff: any = {
    first_name: String(row.first_name || row["first name"] || "").trim(),
    last_name: String(row.last_name || row["last name"] || "").trim(),
  }

  if (row.middle_name || row["middle name"]) {
    staff.middle_name = String(row.middle_name || row["middle name"] || "").trim()
  }

  // Handle department
  if (row.department_id || row["department id"] || row.department_name || row["department name"] || row.department) {
    const deptValue = row.department_id || row["department id"] || row.department_name || row["department name"] || row.department
    if (typeof deptValue === "number") {
      staff.department_id = deptValue
    } else if (departmentMap.has(String(deptValue).trim())) {
      staff.department_id = departmentMap.get(String(deptValue).trim())
    }
  }

  if (row.position) {
    staff.position = String(row.position).trim()
  }

  if (row.date_of_birth || row["date of birth"] || row.dob) {
    staff.date_of_birth = formatDate(row.date_of_birth || row["date of birth"] || row.dob)
  }

  if (row.gender) {
    const gender = String(row.gender).toLowerCase().trim()
    if (["male", "female", "other", "m", "f"].includes(gender)) {
      staff.gender = gender === "m" ? "male" : gender === "f" ? "female" : gender
    }
  }

  if (row.phone || row["phone number"]) {
    staff.phone = String(row.phone || row["phone number"] || "").trim()
  }

  if (row.address) {
    staff.address = String(row.address).trim()
  }

  if (row.qualification) {
    staff.qualification = String(row.qualification).trim()
  }

  const hireDate = row.hire_date || row["hire date"] || row.employment_date || row["employment date"]
  if (hireDate) {
    staff.hire_date = formatDate(hireDate)
    staff.employment_date = formatDate(hireDate)
  }

  if (row.salary) {
    staff.salary = typeof row.salary === "number" ? row.salary : parseFloat(String(row.salary)) || undefined
  }

  if (row.employment_type || row["employment type"]) {
    const empType = String(row.employment_type || row["employment type"] || "").toLowerCase().trim()
    if (["full_time", "part_time", "contract", "intern"].includes(empType)) {
      staff.employment_type = empType
    }
  }

  return staff
}

/**
 * Parse Excel row to guardian format
 */
export function parseGuardianRow(row: any, studentMap: Map<string, number>): any {
  const guardian: any = {
    first_name: String(row.first_name || row["first name"] || "").trim(),
    last_name: String(row.last_name || row["last name"] || "").trim(),
    phone: String(row.phone || row["phone number"] || "").trim(),
  }

  if (row.middle_name || row["middle name"]) {
    guardian.middle_name = String(row.middle_name || row["middle name"] || "").trim()
  }

  if (row.email) {
    guardian.email = String(row.email).trim()
  }

  if (row.address) {
    guardian.address = String(row.address).trim()
  }

  if (row.occupation) {
    guardian.occupation = String(row.occupation).trim()
  }

  if (row.employer) {
    guardian.employer = String(row.employer).trim()
  }

  // Handle students - can be comma-separated IDs or admission numbers
  if (row.student_ids || row["student ids"] || row.students || row["admission numbers"] || row["admission_numbers"]) {
    const studentIdsValue = row.student_ids || row["student ids"] || row.students || row["admission numbers"] || row["admission_numbers"]
    const studentIds = String(studentIdsValue)
      .split(/[,;]/)
      .map((id: string) => id.trim())
      .filter(Boolean)

    if (studentIds.length > 0) {
      guardian.students = studentIds
        .map((id: string) => {
          const studentId = studentMap.get(id) || (typeof id === "string" && !isNaN(parseInt(id)) ? parseInt(id) : null)
          if (studentId) {
            return {
              student_id: studentId,
              relationship: String(row.relationship || "Guardian").trim(),
              is_primary: String(row.is_primary || row["is primary"] || "false").toLowerCase() === "true",
              emergency_contact: String(row.emergency_contact || row["emergency contact"] || "false").toLowerCase() === "true",
            }
          }
          return null
        })
        .filter(Boolean)
    }
  }

  return guardian
}

/**
 * Parse Excel row to question format
 */
export function parseQuestionRow(
  row: any,
  subjectMap: Map<string, number>,
  classMap: Map<string, number>,
  termMap: Map<string, number>,
  academicYearMap: Map<string, number>
): any {
  const question: any = {}

  // Handle subject
  if (row.subject_id || row["subject id"] || row.subject_name || row["subject name"] || row.subject) {
    const subjValue = row.subject_id || row["subject id"] || row.subject_name || row["subject name"] || row.subject
    if (typeof subjValue === "number") {
      question.subject_id = subjValue
    } else if (subjectMap.has(String(subjValue).trim())) {
      question.subject_id = subjectMap.get(String(subjValue).trim())
    }
  }

  // Handle class
  if (row.class_id || row["class id"] || row.class_name || row["class name"] || row.class) {
    const classValue = row.class_id || row["class id"] || row.class_name || row["class name"] || row.class
    if (typeof classValue === "number") {
      question.class_id = classValue
    } else if (classMap.has(String(classValue).trim())) {
      question.class_id = classMap.get(String(classValue).trim())
    }
  }

  // Handle term
  if (row.term_id || row["term id"] || row.term_name || row["term name"] || row.term) {
    const termValue = row.term_id || row["term id"] || row.term_name || row["term name"] || row.term
    if (typeof termValue === "number") {
      question.term_id = termValue
    } else if (termMap.has(String(termValue).trim())) {
      question.term_id = termMap.get(String(termValue).trim())
    }
  }

  // Handle academic year
  if (row.academic_year_id || row["academic year id"] || row.academic_year_name || row["academic year name"] || row["academic year"]) {
    const yearValue = row.academic_year_id || row["academic year id"] || row.academic_year_name || row["academic year name"] || row["academic year"]
    if (typeof yearValue === "number") {
      question.academic_year_id = yearValue
    } else if (academicYearMap.has(String(yearValue).trim())) {
      question.academic_year_id = academicYearMap.get(String(yearValue).trim())
    }
  }

  if (row.question_type || row["question type"]) {
    const qType = String(row.question_type || row["question type"] || "").toLowerCase().trim()
    const validTypes = ["multiple_choice", "true_false", "short_answer", "essay", "fill_in_blank", "matching", "ordering"]
    if (validTypes.includes(qType)) {
      question.question_type = qType
    }
  }

  if (row.question) {
    question.question = String(row.question).trim()
  }

  // Handle options for multiple choice
  if (question.question_type === "multiple_choice" || row.option_a || row["option a"]) {
    const options = []
    if (row.option_a || row["option a"]) options.push({ key: "A", value: String(row.option_a || row["option a"] || "").trim() })
    if (row.option_b || row["option b"]) options.push({ key: "B", value: String(row.option_b || row["option b"] || "").trim() })
    if (row.option_c || row["option c"]) options.push({ key: "C", value: String(row.option_c || row["option c"] || "").trim() })
    if (row.option_d || row["option d"]) options.push({ key: "D", value: String(row.option_d || row["option d"] || "").trim() })
    if (row.option_e || row["option e"]) options.push({ key: "E", value: String(row.option_e || row["option e"] || "").trim() })
    if (options.length > 0) {
      question.options = options
    }
  }

  if (row.correct_answer || row["correct answer"]) {
    const correct = String(row.correct_answer || row["correct answer"] || "").trim()
    question.correct_answer = correct.split(/[,;]/).map((a: string) => a.trim()).filter(Boolean)
  }

  if (row.explanation) {
    question.explanation = String(row.explanation).trim()
  }

  if (row.difficulty) {
    const diff = String(row.difficulty).toLowerCase().trim()
    if (["easy", "medium", "hard"].includes(diff)) {
      question.difficulty = diff
    }
  }

  if (row.marks) {
    question.marks = typeof row.marks === "number" ? row.marks : parseInt(String(row.marks)) || undefined
  }

  if (row.tags) {
    question.tags = String(row.tags)
      .split(/[,;]/)
      .map((t: string) => t.trim())
      .filter(Boolean)
  }

  if (row.topic) {
    question.topic = String(row.topic).trim()
  }

  if (row.hints) {
    question.hints = String(row.hints).trim()
  }

  return question
}

/**
 * Format date string to YYYY-MM-DD format
 */
function formatDate(dateValue: any): string {
  if (!dateValue) return ""
  
  // If it's already a date string in correct format
  if (typeof dateValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return dateValue
  }

  // If it's an Excel date number
  if (typeof dateValue === "number") {
    const excelEpoch = new Date(1899, 11, 30)
    const date = new Date(excelEpoch.getTime() + dateValue * 86400000)
    return date.toISOString().split("T")[0]
  }

  // Try to parse as date string
  try {
    const date = new Date(dateValue)
    if (!isNaN(date.getTime())) {
      return date.toISOString().split("T")[0]
    }
  } catch (e) {
    // Ignore
  }

  // Return as-is if can't parse
  return String(dateValue)
}

