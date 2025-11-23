"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, GraduationCap, UserCheck, BookOpen } from "lucide-react"
import { useAdminDashboard } from "@/lib/api/dashboard"

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
        <p className={`text-xs ${trendColor}`}>{change}</p>
      </CardContent>
    </Card>
  )
}

export function StatsCards() {
  const { data: dashboardData, isLoading, error } = useAdminDashboard()

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="space-y-0 pb-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    // Fallback to default stats if API fails
    const defaultStats = [
      {
        title: "Total Students",
        value: "0",
        change: "N/A",
        icon: GraduationCap,
        trend: "neutral" as const,
      },
      {
        title: "Total Teachers",
        value: "0",
        change: "N/A",
        icon: UserCheck,
        trend: "neutral" as const,
      },
      {
        title: "Active Classes",
        value: "0",
        change: "N/A",
        icon: BookOpen,
        trend: "neutral" as const,
      },
      {
        title: "Staff Members",
        value: "0",
        change: "N/A",
        icon: Users,
        trend: "neutral" as const,
      },
    ]
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {defaultStats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>
    )
  }

  const stats = dashboardData?.dashboard?.statistics || dashboardData?.statistics
  const statsArray = [
    {
      title: "Total Students",
      value: stats?.total_students?.toLocaleString() || "0",
      change: stats?.students_change ? `${stats.students_change > 0 ? '+' : ''}${stats.students_change}% from last month` : "N/A",
      icon: GraduationCap,
      trend: (stats?.students_change || 0) > 0 ? "up" : (stats?.students_change || 0) < 0 ? "down" : "neutral" as const,
    },
    {
      title: "Total Teachers",
      value: stats?.total_teachers?.toLocaleString() || "0",
      change: stats?.teachers_change ? `${stats.teachers_change > 0 ? '+' : ''}${stats.teachers_change}% from last month` : "N/A",
      icon: UserCheck,
      trend: (stats?.teachers_change || 0) > 0 ? "up" : (stats?.teachers_change || 0) < 0 ? "down" : "neutral" as const,
    },
    {
      title: "Active Classes",
      value: stats?.total_classes?.toLocaleString() || "0",
      change: stats?.classes_change ? `${stats.classes_change > 0 ? '+' : ''}${stats.classes_change}% from last month` : "N/A",
      icon: BookOpen,
      trend: (stats?.classes_change || 0) > 0 ? "up" : (stats?.classes_change || 0) < 0 ? "down" : "neutral" as const,
    },
    {
      title: "Staff Members",
      value: stats?.total_staff?.toLocaleString() || stats?.total_teachers?.toLocaleString() || "0",
      change: stats?.staff_change ? `${stats.staff_change > 0 ? '+' : ''}${stats.staff_change}% from last month` : "N/A",
      icon: Users,
      trend: (stats?.staff_change || 0) > 0 ? "up" : (stats?.staff_change || 0) < 0 ? "down" : "neutral" as const,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsArray.map((stat) => (
        <StatsCard key={stat.title} {...stat} />
      ))}
    </div>
  )
}
