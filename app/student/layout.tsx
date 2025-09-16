"use client"

import type React from "react"

import { Sidebar } from "@/components/layout/sidebar"
import { TenantGuard } from "@/components/tenant/tenant-guard"
import {
  Home,
  BookOpen,
  FileText,
  Calendar,
  BarChart3,
  MessageSquare,
  Clock,
  Award,
  Users,
  Settings,
} from "lucide-react"

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const sidebarItems = [
    { title: "Dashboard", href: "/student", icon: Home },
    { title: "My Courses", href: "/student/courses", icon: BookOpen },
    { title: "Assignments", href: "/student/assignments", icon: FileText },
    { title: "Grades", href: "/student/grades", icon: BarChart3 },
    { title: "Schedule", href: "/student/schedule", icon: Calendar },
    { title: "Attendance", href: "/student/attendance", icon: Clock },
    { title: "Messages", href: "/student/messages", icon: MessageSquare },
    { title: "Classmates", href: "/student/classmates", icon: Users },
    { title: "Achievements", href: "/student/achievements", icon: Award },
    { title: "Settings", href: "/student/settings", icon: Settings },
  ]

  return (
    <TenantGuard requireSchool={true} allowedRoles={["student"]}>
      <div className="flex h-screen bg-background">
        <Sidebar items={sidebarItems} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </TenantGuard>
  )
}
