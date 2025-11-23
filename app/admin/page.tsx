import { StatsCards } from "@/components/admin/stats-cards"
import { LatestAnnouncements } from "@/components/admin/latest-announcements"
import { QuickActions } from "@/components/admin/quick-actions"

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening at your school today.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <QuickActions />
        </div>
        <div className="space-y-6">
          <LatestAnnouncements />
        </div>
      </div>
    </div>
  )
}
