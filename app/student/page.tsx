import { CourseCards } from "@/components/student/course-cards"
import { UpcomingAssignments } from "@/components/student/upcoming-assignments"
import { GradeOverview } from "@/components/student/grade-overview"
import { ScheduleView } from "@/components/student/schedule-view"

export default function StudentDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your academic overview and upcoming tasks.</p>
        </div>
      </div>

      {/* Course Cards */}
      <CourseCards />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <GradeOverview />
        </div>
        <div className="space-y-6">
          <ScheduleView />
          <UpcomingAssignments />
        </div>
      </div>
    </div>
  )
}
