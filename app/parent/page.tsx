import { ChildrenOverview } from "@/components/parent/children-overview"
import { RecentCommunications } from "@/components/parent/recent-communications"
import { UpcomingEvents } from "@/components/parent/upcoming-events"
import { AcademicSummary } from "@/components/parent/academic-summary"

export default function ParentDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Parent Dashboard</h1>
          <p className="text-muted-foreground">
            Stay connected with your children's academic journey and school activities.
          </p>
        </div>
      </div>

      {/* Children Overview */}
      <ChildrenOverview />

      {/* Academic Summary */}
      <AcademicSummary />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentCommunications />
        <UpcomingEvents />
      </div>
    </div>
  )
}
