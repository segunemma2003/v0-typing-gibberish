# Bulk Upload Implementation Guide

## ✅ Completed

1. **API Services Created:**
   - `lib/api/bulk.ts` - All bulk create endpoints (students, teachers, staff, guardians, questions)
   - `lib/api/question-bank.ts` - Question bank CRUD operations

2. **Excel Processing:**
   - `components/common/excel-upload.tsx` - Reusable Excel upload component
   - `lib/utils/excel-parser.ts` - Excel row parsing utilities for all entity types

3. **Pages Updated:**
   - ✅ Students page (`app/admin/students/page.tsx`) - Bulk upload added
   - ✅ Teachers page (`app/admin/teachers/page.tsx`) - Bulk upload added (needs closing tag fix)

## 🔧 To Complete

### 1. Install Excel Library

Run this command to install the xlsx library:
```bash
npm install xlsx --legacy-peer-deps --save
```

Or add to `package.json` dependencies:
```json
"xlsx": "^0.18.5"
```

### 2. Fix Teachers Page Closing Tag

In `app/admin/teachers/page.tsx`, add closing bracket for list view conditional around line 520:

```tsx
      </Card>
      </>  // Add this to close the activeTab === "list" conditional
      )}
    </div>
  )
}
```

### 3. Add Bulk Upload to Staff Page

In `app/admin/staff/page.tsx`:

1. Add imports:
```tsx
import { Upload as UploadIcon } from "lucide-react"
import { ExcelUpload } from "@/components/common/excel-upload"
import { useBulkCreateStaff } from "@/lib/api/bulk"
import { parseStaffRow } from "@/lib/utils/excel-parser"
```

2. Add state:
```tsx
const [activeTab, setActiveTab] = useState<"list" | "bulk">("list")
const bulkCreateStaff = useBulkCreateStaff()
const { data: departmentsResponse } = useDepartments({ per_page: 100 })
const departments = Array.isArray(departmentsResponse) ? departmentsResponse : (departmentsResponse?.data || [])
```

3. Add bulk upload button next to "Add Staff"

4. Add bulk upload section before filters:
```tsx
{activeTab === "bulk" && (
  <ExcelUpload
    entityType="staff"
    templateColumns={[
      "first_name", "last_name", "middle_name",
      "department_id (or department_name)", "position",
      "date_of_birth", "gender", "phone", "address",
      "qualification", "hire_date (or employment_date)",
      "salary", "employment_type"
    ]}
    maxRows={500}
    onFileProcessed={(data) => console.log("Excel data processed:", data)}
    onUpload={async (excelData) => {
      const departmentMap = new Map<string, number>()
      departments.forEach((dept: any) => {
        departmentMap.set(dept.name?.toLowerCase() || "", dept.id)
        departmentMap.set(String(dept.id), dept.id)
      })

      const staff = excelData.map((row: any) => {
        try {
          return parseStaffRow(row, departmentMap)
        } catch (error: any) {
          throw new Error(`Row ${row._rowIndex || 'unknown'}: ${error.message}`)
        }
      }).filter((s: any) => s.first_name && s.last_name)

      if (staff.length === 0) {
        throw new Error("No valid staff data found in Excel file")
      }

      const response = await bulkCreateStaff.mutateAsync({ staff })
      await refetch()
      return response
    }}
  />
)}
```

5. Wrap filters and list in conditional: `{activeTab === "list" && (...)}`

### 4. Add Bulk Upload to Guardians Page

Similar to staff page, but use:
- `useBulkCreateGuardians` hook
- `parseGuardianRow` function
- Template columns: `["first_name", "last_name", "middle_name", "email", "phone", "address", "occupation", "employer", "student_ids (comma-separated)", "relationship"]`

### 5. Create Question Bank Pages

#### Admin Question Bank (`app/admin/question-bank/page.tsx`)

Create a full CRUD page with:
- List of questions with filters (subject, class, term, academic year, type, difficulty)
- Add/Edit question form
- Bulk upload section using `ExcelUpload` component
- Use `useQuestionBank`, `useCreateQuestion`, etc. hooks

Bulk upload handler:
```tsx
onUpload={async (excelData) => {
  // Create lookup maps for subject, class, term, academic year
  const subjectMap = new Map<string, number>()
  const classMap = new Map<string, number>()
  const termMap = new Map<string, number>()
  const academicYearMap = new Map<string, number>()
  
  // Populate maps from API responses
  
  const questions = excelData.map((row: any) => {
    return parseQuestionRow(row, subjectMap, classMap, termMap, academicYearMap)
  }).filter((q: any) => q.question && q.subject_id && q.class_id && q.term_id && q.academic_year_id)

  const response = await bulkCreateQuestions.mutateAsync({ questions })
  await refetch()
  return response
}}
```

#### Teacher Question Bank (`app/teacher/question-bank/page.tsx`)

Similar to admin version, but with teacher-specific permissions/views.

### 6. Add Question Bank to Navigation

In `app/admin/layout.tsx`, add:
```tsx
{ title: "Question Bank", href: "/admin/question-bank", icon: BookOpen }
```

In `app/teacher/layout.tsx` (if exists), add similar entry.

## Excel Template Format

### Students Template Columns:
```
first_name, last_name, middle_name, class_id (or class_name), arm_id (or arm_name),
date_of_birth, gender, phone, address, blood_group, parent_name, parent_phone,
parent_email, emergency_contact, allergies, medications, route_id, pickup_point
```

### Teachers Template Columns:
```
first_name, last_name, middle_name, department_id (or department_name),
qualification, experience_years, employment_date (or hire_date), date_of_birth,
gender, phone, address
```

### Staff Template Columns:
```
first_name, last_name, middle_name, department_id (or department_name), position,
date_of_birth, gender, phone, address, qualification, hire_date (or employment_date),
salary, employment_type
```

### Guardians Template Columns:
```
first_name, last_name, middle_name, email, phone, address, occupation, employer,
student_ids (comma-separated), relationship, is_primary, emergency_contact
```

### Questions Template Columns:
```
subject_id (or subject_name), class_id (or class_name), term_id (or term_name),
academic_year_id (or academic_year_name), question_type, question, option_a,
option_b, option_c, option_d, option_e, correct_answer, explanation, difficulty,
marks, tags, topic, hints
```

## Testing Checklist

- [ ] Install xlsx library
- [ ] Test students bulk upload
- [ ] Test teachers bulk upload
- [ ] Test staff bulk upload
- [ ] Test guardians bulk upload
- [ ] Create and test question bank pages
- [ ] Test question bulk upload
- [ ] Verify error handling for invalid Excel files
- [ ] Verify success/failure reporting
- [ ] Test with large Excel files (100+ rows)

## Notes

- The Excel parser handles both IDs and names for related entities (classes, departments, etc.)
- Dates are auto-formatted from Excel date numbers or date strings
- All bulk operations support up to 1000 rows (500 for staff/guardians/teachers)
- Failed rows are reported with row numbers and error messages
- Login credentials are auto-generated by the API for new users

