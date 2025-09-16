import { ClassOverview } from "@/components/teacher/class-overview"
import { UpcomingSchedule } from "@/components/teacher/upcoming-schedule"
import { RecentSubmissions } from "@/components/teacher/recent-submissions"
import { GradeBook } from "@/components/teacher/grade-book"

export default function TeacherDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your classes and students.</p>
        </div>
      </div>

      {/* Class Overview */}
      <ClassOverview />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <GradeBook />
        </div>
        <div className="space-y-6">
          <UpcomingSchedule />
          <RecentSubmissions />
        </div>
      </div>
    </div>
  )
}
