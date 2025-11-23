# Admin Pages to Update - API List

**Status:** ✅ All APIs are implemented and ready to use  
**Action Required:** Update frontend pages to use real APIs instead of dummy data

---

## Pages Using Dummy Data (11 pages)

### 1. Teachers Page
**File:** `app/admin/teachers/page.tsx`

**APIs to Use:**
- `useTeachers()` - GET /teachers (from `lib/api/teachers.ts`)
- `useCreateTeacher()` - POST /teachers
- `useUpdateTeacher()` - PUT /teachers/{id}
- `useDeleteTeacher()` - DELETE /teachers/{id}

**Additional APIs for Relationships:**
- `useSubjects()` - For subject dropdown (multi-select)
- `useClasses()` - For class dropdown (multi-select)

**Form Fields Needed:**
- Name (text input)
- Email (email input)
- Phone (text input)
- Subjects (multi-select dropdown from `useSubjects()`)
- Classes (multi-select dropdown from `useClasses()`)
- Qualification (text input)
- Experience Years (number input)

---

### 2. Staff Page
**File:** `app/admin/staff/page.tsx`

**APIs to Use:**
- `useStaff()` - GET /staff (from `lib/api/staff.ts`)
- `useCreateStaff()` - POST /staff
- `useUpdateStaff()` - PUT /staff/{id}
- `useDeleteStaff()` - DELETE /staff/{id}

**Form Fields Needed:**
- Name (text input)
- Email (email input)
- Phone (text input)
- Role (text input or dropdown)
- Department (text input)
- Position (text input)

---

### 3. Classes Page
**File:** `app/admin/classes/page.tsx`

**APIs to Use:**
- `useClasses()` - GET /classes (from `lib/api/academic.ts`)
- `useCreateClass()` - POST /classes
- `useUpdateClass()` - PUT /classes/{id}
- `useDeleteClass()` - DELETE /classes/{id}

**Additional APIs for Relationships:**
- `useTeachers()` - For class teacher dropdown

**Form Fields Needed:**
- Name (text input) - e.g., "Grade 10"
- Level (text input) - e.g., "Grade 10"
- Arms (array of strings) - e.g., ["A", "B", "C"]
- Class Teacher (dropdown from `useTeachers()`)

---

### 4. Subjects Page
**File:** `app/admin/subjects/page.tsx`

**APIs to Use:**
- `useSubjects()` - GET /subjects (from `lib/api/academic.ts`)
- `useCreateSubject()` - POST /subjects
- `useUpdateSubject()` - PUT /subjects/{id}
- `useDeleteSubject()` - DELETE /subjects/{id}

**Additional APIs for Relationships:**
- `useTeachers()` - For teacher dropdown (multi-select)

**Form Fields Needed:**
- Name (text input)
- Code (text input)
- Description (textarea)
- Teacher IDs (multi-select dropdown from `useTeachers()`)

---

### 5. Timetable Page
**File:** `app/admin/timetable/page.tsx`

**APIs to Use:**
- `useTimetable()` - GET /timetable (from `lib/api/timetable.ts`)
- `useClassTimetable(classId)` - GET /timetable/class/{classId}
- `useTeacherTimetable(teacherId)` - GET /timetable/teacher/{teacherId}
- `useCreateTimetable()` - POST /timetable
- `useUpdateTimetable()` - PUT /timetable/{id}
- `useDeleteTimetable()` - DELETE /timetable/{id}

**Additional APIs for Relationships:**
- `useClasses()` - For class dropdown to filter/view timetable
- `useTeachers()` - For teacher dropdown to filter/view timetable
- `useSubjects()` - For subject dropdown in form

**Form Fields Needed:**
- Class ID (dropdown from `useClasses()`)
- Subject ID (dropdown from `useSubjects()`)
- Teacher ID (dropdown from `useTeachers()`)
- Day of Week (dropdown: Monday-Friday)
- Start Time (time input)
- End Time (time input)
- Room (text input)

---

### 6. Announcements Page
**File:** `app/admin/announcements/page.tsx`

**APIs to Use:**
- `useAnnouncements()` - GET /announcements (from `lib/api/announcements.ts`)
- `useCreateAnnouncement()` - POST /announcements
- `useUpdateAnnouncement()` - PUT /announcements/{id}
- `useDeleteAnnouncement()` - DELETE /announcements/{id}
- `usePublishAnnouncement()` - POST /announcements/{id}/publish

**Form Fields Needed:**
- Title (text input)
- Content (textarea)
- Type (dropdown or text input)
- Status (dropdown: draft/published)
- Priority (dropdown: high/normal/low) - optional

---

### 7. Transport Page
**File:** `app/admin/transport/page.tsx`

**APIs to Use:**
- `useVehicles()` - GET /transport/vehicles (from `lib/api/transport.ts`)
- `useCreateVehicle()` - POST /transport/vehicles
- `useUpdateVehicle()` - PUT /transport/vehicles/{id}
- `useDeleteVehicle()` - DELETE /transport/vehicles/{id}
- `useTransportRoutes()` - GET /transport/routes
- `useCreateTransportRoute()` - POST /transport/routes
- `useDrivers()` - GET /transport/drivers
- `useCreateDriver()` - POST /transport/drivers

**Form Fields Needed (Vehicles):**
- Vehicle Number/Name (text input)
- Route ID (dropdown from `useTransportRoutes()`)
- Driver ID (dropdown from `useDrivers()`)
- Capacity (number input)
- Vehicle Type (text input)
- Status (dropdown: active/inactive)

---

### 8. Reports Page
**File:** `app/admin/reports/page.tsx`

**APIs to Use:**
- `useAttendanceReport(params)` - GET /reports/attendance (from `lib/api/reports.ts`)
- `useAcademicReport(params)` - GET /reports/academic
- `useFinancialReport(params)` - GET /reports/financial

**Additional APIs for Filters:**
- `useClasses()` - For filtering reports by class
- `useAcademicYears()` - For filtering by academic year
- `useTerms()` - For filtering by term

**Filter Fields Needed:**
- Report Type (dropdown: attendance/academic/financial)
- Start Date (date input)
- End Date (date input)
- Class ID (dropdown from `useClasses()`)
- Term ID (dropdown from `useTerms()`)
- Academic Year (dropdown from `useAcademicYears()`)

---

### 9. Houses Page
**File:** `app/admin/houses/page.tsx`

**APIs to Use:**
- `useHouses()` - GET /houses (from `lib/api/houses.ts`)
- `useCreateHouse()` - POST /houses
- `useUpdateHouse()` - PUT /houses/{id}
- `useDeleteHouse()` - DELETE /houses/{id}
- `useHouseMembers(houseId)` - GET /houses/{id}/members
- `useHousePoints(houseId)` - GET /houses/{id}/points
- `useAddHousePoints()` - POST /houses/{id}/points

**Additional APIs for Relationships:**
- `useStudents()` - For assigning students to houses

**Form Fields Needed:**
- Name (text input)
- Color (text input or color picker)
- Description (textarea)

---

### 10. Sports Page
**File:** `app/admin/sports/page.tsx`

**APIs to Use:**
- `useSportsActivities()` - GET /sports/activities (from `lib/api/sports.ts`)
- `useCreateSportsActivity()` - POST /sports/activities
- `useUpdateSportsActivity()` - PUT /sports/activities/{id}
- `useDeleteSportsActivity()` - DELETE /sports/activities/{id}
- `useSportsTeams()` - GET /sports/teams
- `useCreateSportsTeam()` - POST /sports/teams
- `useSportsEvents()` - GET /sports/events
- `useCreateSportsEvent()` - POST /sports/events

**Additional APIs for Relationships:**
- `useStudents()` - For team member selection (multi-select)
- `useTeachers()` - For coach assignment (dropdown)

**Form Fields Needed (Activities):**
- Name (text input)
- Description (textarea)
- Category (text input)
- Coach ID (dropdown from `useTeachers()`)
- Schedule (text input)

**Form Fields Needed (Teams):**
- Name (text input)
- Sport (text input)
- Coach ID (dropdown from `useTeachers()`)
- Member IDs (multi-select from `useStudents()`)

**Form Fields Needed (Events):**
- Name (text input)
- Description (textarea)
- Sport (text input)
- Date (date input)
- Venue (text input)
- Team IDs (multi-select from teams)

---

### 11. Inventory Page
**File:** `app/admin/inventory/page.tsx`

**APIs to Use:**
- `useInventoryItems()` - GET /inventory/items (from `lib/api/inventory.ts`)
- `useCreateInventoryItem()` - POST /inventory/items
- `useUpdateInventoryItem()` - PUT /inventory/items/{id}
- `useDeleteInventoryItem()` - DELETE /inventory/items/{id}
- `useInventoryCategories()` - GET /inventory/categories
- `useCreateInventoryCategory()` - POST /inventory/categories
- `useCheckoutItem()` - POST /inventory/items/{id}/checkout
- `useReturnItem()` - POST /inventory/transactions/{id}/return

**Form Fields Needed:**
- Name (text input)
- Description (textarea)
- Category ID (dropdown from `useInventoryCategories()`)
- Quantity (number input)
- Unit (text input)
- Min Stock Level (number input)
- Location (text input)

---

## Pages Already Using Real APIs (2 pages)

### ✅ 1. Dashboard Page
**File:** `app/admin/page.tsx`
**Status:** ✅ Complete
**API Used:**
- `useAdminDashboard()` - GET /dashboard/admin

### ✅ 2. Students Page
**File:** `app/admin/students/page.tsx`
**Status:** ✅ Complete (with relationships)
**APIs Used:**
- `useStudents()` - GET /students
- `useCreateStudent()` - POST /students
- `useUpdateStudent()` - PUT /students/{id}
- `useDeleteStudent()` - DELETE /students/{id}
- `useClasses()` - For class/arm dropdowns

---

## Summary

**Total Admin Pages:** 13
**Pages Using Real APIs:** 2 ✅
**Pages Using Dummy Data:** 11 ❌

**APIs Status:** ✅ All APIs implemented and tested (100%)

**Next Action:** Update the 11 pages listed above to use their respective API hooks instead of dummy data.

---

## Quick Implementation Guide

For each page:
1. Remove hardcoded data arrays
2. Import API hooks from `lib/api/*.ts`
3. Use `useQuery` hooks for fetching data
4. Use `useMutation` hooks for create/update/delete
5. Add loading states with `isLoading`
6. Add error handling with `error`
7. Add Select dropdowns for relationships
8. Add toast notifications for success/error
9. Add form validation
10. Test CRUD operations

