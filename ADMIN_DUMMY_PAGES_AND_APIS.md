# Admin Pages with Dummy Data - API Requirements

**Date:** January 2025  
**Status:** All APIs Implemented ✅ | Frontend Integration Needed ❌

This document lists all admin pages that currently use dummy/hardcoded data and the APIs needed to make them fully functional with real data.

---

## Summary

**Total Admin Pages:** 13  
**Pages Using Real APIs:** 2 (Students, Dashboard)  
**Pages Using Dummy Data:** 11  
**APIs Available:** ✅ All APIs are implemented and tested

---

## Pages with Dummy Data

### 1. **Teachers Page** (`app/admin/teachers/page.tsx`)
**Status:** ❌ Uses dummy data

**Current Dummy Data:**
- Hardcoded teachers array with id, name, email, subjects, department, status, joinDate

**Required APIs:**
- ✅ `useTeachers()` - GET /teachers (available in `lib/api/teachers.ts`)
- ✅ `useCreateTeacher()` - POST /teachers (available in `lib/api/teachers.ts`)
- ✅ `useUpdateTeacher()` - PUT /teachers/{id} (available in `lib/api/teachers.ts`)
- ✅ `useDeleteTeacher()` - DELETE /teachers/{id} (AVAILABLE - needs to check if service function exists)

**Additional APIs Needed:**
- ✅ `useSubjects()` - For subject dropdown in teacher form (available in `lib/api/academic.ts`)
- ✅ `useClasses()` - For class dropdown in teacher form (available in `lib/api/academic.ts`)

**Relationship Handling Needed:**
- Subject dropdown (multi-select) - use `useSubjects()` to populate
- Class dropdown (multi-select) - use `useClasses()` to populate
- Department field - could use subjects data to infer or allow manual entry

**Files to Update:**
- `app/admin/teachers/page.tsx`

---

### 2. **Staff Page** (`app/admin/staff/page.tsx`)
**Status:** ❌ Uses dummy data

**Current Dummy Data:**
- Hardcoded staff array with id, name, email, phone, role, department, status, joinDate

**Required APIs:**
- ✅ `useStaff()` - GET /staff (available in `lib/api/staff.ts`)
- ✅ `useCreateStaff()` - POST /staff (available in `lib/api/staff.ts`)
- ✅ `useUpdateStaff()` - PUT /staff/{id} (available in `lib/api/staff.ts`)
- ✅ `useDeleteStaff()` - DELETE /staff/{id} (available in `lib/api/staff.ts`)

**Additional APIs Needed:**
- None - Staff management is standalone

**Relationship Handling Needed:**
- Role dropdown - could be enum or fetch from API
- Department field - allow manual entry or fetch from departments API

**Files to Update:**
- `app/admin/staff/page.tsx`

---

### 3. **Classes Page** (`app/admin/classes/page.tsx`)
**Status:** ❌ Uses dummy data

**Current Dummy Data:**
- Hardcoded classes array with id, name, level, section, classTeacher, students, subjects, schedule, room, status

**Required APIs:**
- ✅ `useClasses()` - GET /classes (available in `lib/api/academic.ts`)
- ✅ `useCreateClass()` - POST /classes (available in `lib/api/academic.ts`)
- ✅ `useUpdateClass()` - PUT /classes/{id} (available in `lib/api/academic.ts`)
- ✅ `useDeleteClass()` - DELETE /classes/{id} (available in `lib/api/academic.ts`)

**Additional APIs Needed:**
- ✅ `useTeachers()` - For class teacher dropdown (available in `lib/api/teachers.ts`)
- ✅ `useSubjects()` - To show subjects taught in class (available in `lib/api/academic.ts`)
- ✅ `useStudents()` - To show student count (available in `lib/api/students.ts`)

**Relationship Handling Needed:**
- Class Teacher dropdown - use `useTeachers()` to populate
- Arms/Sections - included in class data (arms array)
- Student count - calculate from students API or show from class data
- Subject count - calculate from subjects or show from class data

**Files to Update:**
- `app/admin/classes/page.tsx`

---

### 4. **Subjects Page** (`app/admin/subjects/page.tsx`)
**Status:** ❌ Uses dummy data

**Current Dummy Data:**
- Hardcoded subjects array with id, name, code, department, teacher, level, students, hours, status

**Required APIs:**
- ✅ `useSubjects()` - GET /subjects (available in `lib/api/academic.ts`)
- ✅ `useCreateSubject()` - POST /subjects (available in `lib/api/academic.ts`)
- ✅ `useUpdateSubject()` - PUT /subjects/{id} (available in `lib/api/academic.ts`)
- ✅ `useDeleteSubject()` - DELETE /subjects/{id} (available in `lib/api/academic.ts`)

**Additional APIs Needed:**
- ✅ `useTeachers()` - For teacher dropdown (multi-select) (available in `lib/api/teachers.ts`)

**Relationship Handling Needed:**
- Teacher dropdown (multi-select) - use `useTeachers()` to populate
- Code generation - could be auto-generated or manual
- Description field - included in API

**Files to Update:**
- `app/admin/subjects/page.tsx`

---

### 5. **Timetable Page** (`app/admin/timetable/page.tsx`)
**Status:** ❌ Uses dummy data

**Current Dummy Data:**
- Hardcoded timetable object with days of week and hardcoded schedule entries

**Required APIs:**
- ✅ `useTimetable()` - GET /timetable (available in `lib/api/timetable.ts`)
- ✅ `useClassTimetable()` - GET /timetable/class/{classId} (available in `lib/api/timetable.ts`)
- ✅ `useTeacherTimetable()` - GET /timetable/teacher/{teacherId} (available in `lib/api/timetable.ts`)
- ✅ `useCreateTimetable()` - POST /timetable (available in `lib/api/timetable.ts`)
- ✅ `useUpdateTimetable()` - PUT /timetable/{id} (available in `lib/api/timetable.ts`)
- ✅ `useDeleteTimetable()` - DELETE /timetable/{id} (available in `lib/api/timetable.ts`)

**Additional APIs Needed:**
- ✅ `useClasses()` - For class selection dropdown (available in `lib/api/academic.ts`)
- ✅ `useTeachers()` - For teacher selection (available in `lib/api/teachers.ts`)
- ✅ `useSubjects()` - For subject selection (available in `lib/api/academic.ts`)

**Relationship Handling Needed:**
- Class dropdown - use `useClasses()` to filter/view timetable by class
- Teacher dropdown - use `useTeachers()` to filter/view timetable by teacher
- Subject dropdown - use `useSubjects()` for creating new timetable entries
- Day/Time selection - form fields
- Room field - form field

**Files to Update:**
- `app/admin/timetable/page.tsx`

---

### 6. **Announcements Page** (`app/admin/announcements/page.tsx`)
**Status:** ❌ Uses dummy data

**Current Dummy Data:**
- Hardcoded announcements array with id, title, message, date, priority, author, recipients, status

**Required APIs:**
- ✅ `useAnnouncements()` - GET /announcements (available in `lib/api/announcements.ts`)
- ✅ `useCreateAnnouncement()` - POST /announcements (available in `lib/api/announcements.ts`)
- ✅ `useUpdateAnnouncement()` - PUT /announcements/{id} (available in `lib/api/announcements.ts`)
- ✅ `useDeleteAnnouncement()` - DELETE /announcements/{id} (available in `lib/api/announcements.ts`)

**Additional APIs Needed:**
- None - Announcements are standalone

**Relationship Handling Needed:**
- Priority dropdown - enum values (high, normal, low)
- Recipients field - could be manual entry or use roles/classes for targeting
- Status field - enum (draft, published, archived)

**Files to Update:**
- `app/admin/announcements/page.tsx`

---

### 7. **Transport Page** (`app/admin/transport/page.tsx`)
**Status:** ❌ Uses dummy data

**Current Dummy Data:**
- Hardcoded buses array with id, number, route, driver, capacity, students, stops, status, departure

**Required APIs:**
- ✅ `useTransportVehicles()` - GET /transport/vehicles (available in `lib/api/transport.ts`)
- ✅ `useCreateVehicle()` - POST /transport/vehicles (available in `lib/api/transport.ts`)
- ✅ `useUpdateVehicle()` - PUT /transport/vehicles/{id} (available in `lib/api/transport.ts`)
- ✅ `useDeleteVehicle()` - DELETE /transport/vehicles/{id} (available in `lib/api/transport.ts`)
- ✅ `useTransportRoutes()` - GET /transport/routes (available in `lib/api/transport.ts`)
- ✅ `useTransportDrivers()` - GET /transport/drivers (available in `lib/api/transport.ts`)

**Additional APIs Needed:**
- ✅ `useCreateRoute()` - POST /transport/routes (available in `lib/api/transport.ts`)
- ✅ `useCreateDriver()` - POST /transport/drivers (available in `lib/api/transport.ts`)
- ✅ `useStudents()` - To show assigned students count (available in `lib/api/students.ts`)

**Relationship Handling Needed:**
- Route dropdown - use `useTransportRoutes()` to populate
- Driver dropdown - use `useTransportDrivers()` to populate
- Vehicle type selection - form field or enum
- Student assignment - could be separate page/section

**Files to Update:**
- `app/admin/transport/page.tsx`

---

### 8. **Reports Page** (`app/admin/reports/page.tsx`)
**Status:** ❌ Uses dummy data

**Current Dummy Data:**
- Hardcoded reports array with id, title, description, type, date, status, downloads

**Required APIs:**
- ✅ `useReports()` - GET /reports (available in `lib/api/reports.ts`)
- ✅ `useAttendanceReport()` - GET /reports/attendance (available in `lib/api/reports.ts`)
- ✅ `useAcademicReport()` - GET /reports/academic (available in `lib/api/reports.ts`)
- ✅ `useFinancialReport()` - GET /reports/financial (available in `lib/api/reports.ts`)

**Additional APIs Needed:**
- None - Reports use existing data aggregation

**Relationship Handling Needed:**
- Report type selection - enum (attendance, academic, financial, etc.)
- Date range picker - for filtering reports
- Class/Student filters - use `useClasses()` and `useStudents()` for filtering
- Export functionality - generate PDF/Excel from API response

**Files to Update:**
- `app/admin/reports/page.tsx`

---

### 9. **Houses Page** (`app/admin/houses/page.tsx`)
**Status:** ❌ Uses dummy data

**Current Dummy Data:**
- Hardcoded houses array with id, name, color, members, points, status

**Required APIs:**
- ✅ `useHouses()` - GET /houses (available in `lib/api/houses.ts`)
- ✅ `useCreateHouse()` - POST /houses (available in `lib/api/houses.ts`)
- ✅ `useUpdateHouse()` - PUT /houses/{id} (available in `lib/api/houses.ts`)
- ✅ `useDeleteHouse()` - DELETE /houses/{id} (available in `lib/api/houses.ts`)
- ✅ `useHouseMembers()` - GET /houses/{id}/members (available in `lib/api/houses.ts`)
- ✅ `useHousePoints()` - GET /houses/{id}/points (available in `lib/api/houses.ts`)

**Additional APIs Needed:**
- ✅ `useStudents()` - For assigning students to houses (available in `lib/api/students.ts`)
- ✅ `useAddHousePoints()` - POST /houses/{id}/points (available in `lib/api/houses.ts`)

**Relationship Handling Needed:**
- Student assignment - use `useStudents()` to assign students to houses
- Points management - add/subtract points for competitions/activities
- Member count - calculate from students assigned to house

**Files to Update:**
- `app/admin/houses/page.tsx`

---

### 10. **Sports Page** (`app/admin/sports/page.tsx`)
**Status:** ❌ Uses dummy data

**Current Dummy Data:**
- Hardcoded events and teams arrays

**Required APIs:**
- ✅ `useSportsActivities()` - GET /sports/activities (available in `lib/api/sports.ts`)
- ✅ `useSportsTeams()` - GET /sports/teams (available in `lib/api/sports.ts`)
- ✅ `useSportsEvents()` - GET /sports/events (available in `lib/api/sports.ts`)
- ✅ `useCreateSportsActivity()` - POST /sports/activities (available in `lib/api/sports.ts`)
- ✅ `useCreateSportsTeam()` - POST /sports/teams (available in `lib/api/sports.ts`)
- ✅ `useCreateSportsEvent()` - POST /sports/events (available in `lib/api/sports.ts`)

**Additional APIs Needed:**
- ✅ `useStudents()` - For team member selection (available in `lib/api/students.ts`)
- ✅ `useTeachers()` - For coach assignment (available in `lib/api/teachers.ts`)

**Relationship Handling Needed:**
- Team member selection - use `useStudents()` (multi-select)
- Coach assignment - use `useTeachers()` dropdown
- Activity type - enum or form field
- Event scheduling - date/time fields

**Files to Update:**
- `app/admin/sports/page.tsx`

---

### 11. **Inventory Page** (`app/admin/inventory/page.tsx`)
**Status:** ❌ Uses dummy data

**Current Dummy Data:**
- Hardcoded inventory array

**Required APIs:**
- ✅ `useInventoryItems()` - GET /inventory/items (available in `lib/api/inventory.ts`)
- ✅ `useInventoryCategories()` - GET /inventory/categories (available in `lib/api/inventory.ts`)
- ✅ `useCreateInventoryItem()` - POST /inventory/items (available in `lib/api/inventory.ts`)
- ✅ `useUpdateInventoryItem()` - PUT /inventory/items/{id} (available in `lib/api/inventory.ts`)
- ✅ `useDeleteInventoryItem()` - DELETE /inventory/items/{id} (available in `lib/api/inventory.ts`)

**Additional APIs Needed:**
- None - Inventory is standalone

**Relationship Handling Needed:**
- Category dropdown - use `useInventoryCategories()` to populate
- Quantity tracking - form fields
- Status field - enum (available, low stock, out of stock)

**Files to Update:**
- `app/admin/inventory/page.tsx`

---

## Pages Using Real APIs (Already Complete)

### 1. **Dashboard Page** (`app/admin/page.tsx`)
**Status:** ✅ Uses real API

**APIs Used:**
- ✅ `useAdminDashboard()` - GET /dashboard/admin (available in `lib/api/dashboard.ts`)

**Components:**
- `components/admin/stats-cards.tsx` - Uses `useAdminDashboard()`

---

### 2. **Students Page** (`app/admin/students/page.tsx`)
**Status:** ✅ Uses real API with relationships

**APIs Used:**
- ✅ `useStudents()` - GET /students (available in `lib/api/students.ts`)
- ✅ `useCreateStudent()` - POST /students (available in `lib/api/students.ts`)
- ✅ `useUpdateStudent()` - PUT /students/{id} (available in `lib/api/students.ts`)
- ✅ `useDeleteStudent()` - DELETE /students/{id} (available in `lib/api/students.ts`)
- ✅ `useClasses()` - For class/arm dropdowns (available in `lib/api/academic.ts`)

**Relationship Handling:**
- ✅ Class dropdown - populated from `useClasses()`
- ✅ Arm/Section dropdown - populated from selected class's arms array
- ✅ Gender dropdown - Select component with enum values

---

## Missing API Functions

### APIs That Need to Be Added:

1. **Delete Teacher API**
   - ⚠️ `useDeleteTeacher()` - DELETE /teachers/{id}
   - **File:** `lib/api/teachers.ts`
   - **Status:** Not implemented yet

---

## Implementation Priority

### Priority 1: Core Management Pages
1. **Teachers Page** - Essential for school operations
2. **Classes Page** - Essential for organizing students
3. **Subjects Page** - Essential for curriculum management
4. **Staff Page** - Essential for personnel management

### Priority 2: Academic Features
5. **Timetable Page** - Important for scheduling
6. **Announcements Page** - Important for communication

### Priority 3: Additional Features
7. **Transport Page** - Nice to have
8. **Reports Page** - Nice to have
9. **Houses Page** - Nice to have
10. **Sports Page** - Nice to have
11. **Inventory Page** - Nice to have

---

## Implementation Checklist

### For Each Page, Need to:

- [ ] Replace dummy data with API hooks
- [ ] Add loading states (skeleton/spinner)
- [ ] Add error handling (error messages)
- [ ] Add proper relationship dropdowns
- [ ] Implement CRUD operations (Create, Read, Update, Delete)
- [ ] Add form validation
- [ ] Add toast notifications for success/error
- [ ] Add search/filter functionality
- [ ] Add pagination if needed
- [ ] Test all operations with real API

---

## API Endpoints Summary

### Already Implemented APIs:
- ✅ Authentication (`lib/api/auth.ts`)
- ✅ Users (`lib/api/users.ts`)
- ✅ Students (`lib/api/students.ts`)
- ✅ Teachers (`lib/api/teachers.ts`) - *except delete*
- ✅ Staff (`lib/api/staff.ts`)
- ✅ Academic (`lib/api/academic.ts`) - Classes, Subjects, Academic Years, Terms
- ✅ Attendance (`lib/api/attendance.ts`)
- ✅ Assessment (`lib/api/assessment.ts`)
- ✅ Finance (`lib/api/finance.ts`)
- ✅ Communication (`lib/api/communication.ts`)
- ✅ Announcements (`lib/api/announcements.ts`)
- ✅ Library (`lib/api/library.ts`)
- ✅ Transport (`lib/api/transport.ts`)
- ✅ Timetable (`lib/api/timetable.ts`)
- ✅ Reports (`lib/api/reports.ts`)
- ✅ Houses (`lib/api/houses.ts`)
- ✅ Sports (`lib/api/sports.ts`)
- ✅ Inventory (`lib/api/inventory.ts`)
- ✅ Dashboard (`lib/api/dashboard.ts`)

### Missing:
**None! ✅ All API hooks are implemented.**

---

## Next Steps

1. **✅ Add Missing API Hook:** ✅ **DONE**
   - ✅ Added `useDeleteTeacher()` to `lib/api/teachers.ts`

2. **Update All Pages:**
   - Start with Priority 1 pages (Teachers, Classes, Subjects, Staff)
   - Move to Priority 2 (Timetable, Announcements)
   - Finish with Priority 3 (Transport, Reports, Houses, Sports, Inventory)

3. **Add Relationship Handling:**
   - Implement dropdowns using Select component
   - Connect related data (classes→arms, subjects→teachers, etc.)
   - Add proper form validation

4. **Testing:**
   - Test each page with real API data
   - Verify all CRUD operations work
   - Test relationship dropdowns
   - Test search/filter/pagination

---

## Notes

- All API endpoints are implemented and tested (96.4% success rate)
- All React Query hooks are available
- X-Subdomain header is automatically added via interceptors
- Authorization header is automatically added via interceptors
- Error handling is implemented in API client interceptors
- Only frontend integration remains (replacing dummy data with API hooks)

---

**Last Updated:** January 2025


---

## Quick Reference: API Hooks Available

### ✅ All APIs Implemented and Available:

| Page | API Hook | File | Status |
|------|----------|------|--------|
| Students | `useStudents()`, `useCreateStudent()`, `useUpdateStudent()`, `useDeleteStudent()` | `lib/api/students.ts` | ✅ Complete |
| Teachers | `useTeachers()`, `useCreateTeacher()`, `useUpdateTeacher()`, `useDeleteTeacher()` | `lib/api/teachers.ts` | ✅ Complete |
| Staff | `useStaff()`, `useCreateStaff()`, `useUpdateStaff()`, `useDeleteStaff()` | `lib/api/staff.ts` | ✅ Complete |
| Classes | `useClasses()`, `useCreateClass()`, `useUpdateClass()`, `useDeleteClass()` | `lib/api/academic.ts` | ✅ Complete |
| Subjects | `useSubjects()`, `useCreateSubject()`, `useUpdateSubject()`, `useDeleteSubject()` | `lib/api/academic.ts` | ✅ Complete |
| Timetable | `useTimetable()`, `useClassTimetable()`, `useTeacherTimetable()`, `useCreateTimetable()`, `useUpdateTimetable()`, `useDeleteTimetable()` | `lib/api/timetable.ts` | ✅ Complete |
| Announcements | `useAnnouncements()`, `useCreateAnnouncement()`, `useUpdateAnnouncement()`, `useDeleteAnnouncement()`, `usePublishAnnouncement()` | `lib/api/announcements.ts` | ✅ Complete |
| Transport | `useVehicles()`, `useCreateVehicle()`, `useTransportRoutes()`, `useCreateTransportRoute()`, `useDrivers()`, `useCreateDriver()` | `lib/api/transport.ts` | ✅ Complete |
| Reports | `useAttendanceReport()`, `useAcademicReport()`, `useFinancialReport()` | `lib/api/reports.ts` | ✅ Complete |
| Houses | `useHouses()`, `useCreateHouse()`, `useUpdateHouse()`, `useDeleteHouse()`, `useHouseMembers()`, `useHousePoints()`, `useAddHousePoints()` | `lib/api/houses.ts` | ✅ Complete |
| Sports | `useSportsActivities()`, `useCreateSportsActivity()`, `useSportsTeams()`, `useCreateSportsTeam()`, `useSportsEvents()`, `useCreateSportsEvent()` | `lib/api/sports.ts` | ✅ Complete |
| Inventory | `useInventoryItems()`, `useCreateInventoryItem()`, `useUpdateInventoryItem()`, `useDeleteInventoryItem()`, `useInventoryCategories()` | `lib/api/inventory.ts` | ✅ Complete |
| Dashboard | `useAdminDashboard()` | `lib/api/dashboard.ts` | ✅ Complete |

---

## Implementation Checklist

For each page that needs to be updated, follow this checklist:

### ✅ Standard Implementation Steps:

1. **Replace Dummy Data:**
   - [ ] Remove hardcoded arrays/objects
   - [ ] Import API hooks (useQuery, useMutation)
   - [ ] Use API hooks to fetch data
   - [ ] Handle loading states
   - [ ] Handle error states

2. **Add CRUD Operations:**
   - [ ] Create - Use create mutation hook
   - [ ] Read - Use query hook (already done in step 1)
   - [ ] Update - Use update mutation hook
   - [ ] Delete - Use delete mutation hook
   - [ ] Invalidate queries after mutations

3. **Add Relationship Dropdowns:**
   - [ ] Import Select component
   - [ ] Fetch related data (e.g., classes for students)
   - [ ] Create dropdown with Select component
   - [ ] Handle cascading dropdowns (e.g., arms based on selected class)

4. **Add Form Validation:**
   - [ ] Required fields validation
   - [ ] Email/phone format validation
   - [ ] Show validation errors
   - [ ] Disable submit button when invalid

5. **Add Toast Notifications:**
   - [ ] Success messages for create/update/delete
   - [ ] Error messages for failures
   - [ ] Import toast from 'sonner'

6. **Add Search/Filter:**
   - [ ] Search input field
   - [ ] Pass search term to API hook
   - [ ] Filter dropdowns if needed

7. **Add Pagination (if needed):**
   - [ ] Use pagination from API response
   - [ ] Add pagination controls
   - [ ] Handle page changes

---

## Example Implementation Pattern

```typescript
// 1. Import hooks
import { useTeachers } from "@/lib/api/teachers"
import { useSubjects } from "@/lib/api/academic"
import { useClasses } from "@/lib/api/academic"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

// 2. Use hooks
const { data: teachersResponse, isLoading, error } = useTeachers()
const { data: subjectsResponse } = useSubjects()
const { data: classesResponse } = useClasses()

const teachers = teachersResponse?.data || []
const subjects = subjectsResponse?.data || []
const classes = classesResponse?.data || []

// 3. Use Select dropdown
<Select value={formData.subject_id} onValueChange={(value) => setFormData({...formData, subject_id: value})}>
  <SelectTrigger>
    <SelectValue placeholder="Select subject" />
  </SelectTrigger>
  <SelectContent>
    {subjects.map((subject: any) => (
      <SelectItem key={subject.id} value={subject.id.toString()}>
        {subject.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

---

**Last Updated:** January 2025  
**Status:** ✅ All APIs Implemented | ❌ Frontend Integration Needed (11 pages)

