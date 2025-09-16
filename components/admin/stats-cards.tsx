import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, GraduationCap, UserCheck, BookOpen } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string
  change: string
  icon: React.ComponentType<{ className?: string }>
  trend: "up" | "down" | "neutral"
}

function StatsCard({ title, value, change, icon: Icon, trend }: StatsCardProps) {
  const trendColor = trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-muted-foreground"

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${trendColor}`}>{change} from last month</p>
      </CardContent>
    </Card>
  )
}

export function StatsCards() {
  const stats = [
    {
      title: "Total Students",
      value: "1,234",
      change: "+12%",
      icon: GraduationCap,
      trend: "up" as const,
    },
    {
      title: "Total Teachers",
      value: "89",
      change: "+3%",
      icon: UserCheck,
      trend: "up" as const,
    },
    {
      title: "Active Classes",
      value: "45",
      change: "+2%",
      icon: BookOpen,
      trend: "up" as const,
    },
    {
      title: "Staff Members",
      value: "156",
      change: "+8%",
      icon: Users,
      trend: "up" as const,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatsCard key={stat.title} {...stat} />
      ))}
    </div>
  )
}
