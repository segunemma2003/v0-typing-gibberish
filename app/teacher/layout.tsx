"use client"

import type React from "react"

import { Sidebar } from "@/components/layout/sidebar"
import { TenantGuard } from "@/components/tenant/tenant-guard"
import {
  Home,
  BookOpen,
  Users,
  FileText,
  Calendar,
  BarChart3,
  MessageSquare,
  Clock,
  Award,
  Settings,
  BookCheck,
  HelpCircle,
} from "lucide-react"

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const sidebarItems = [
    { title: "Dashboard", href: "/teacher", icon: Home },
    { title: "My Classes", href: "/teacher/classes", icon: BookOpen },
    { title: "Students", href: "/teacher/students", icon: Users },
    { title: "Assignments", href: "/teacher/assignments", icon: FileText },
    { title: "Exams", href: "/teacher/exams", icon: BookCheck },
    { title: "Question Bank", href: "/teacher/question-bank", icon: HelpCircle },
    { title: "Grade Book", href: "/teacher/grades", icon: BarChart3 },
    { title: "Schedule", href: "/teacher/schedule", icon: Calendar },
    { title: "Attendance", href: "/teacher/attendance", icon: Clock },
    { title: "Messages", href: "/teacher/messages", icon: MessageSquare },
    { title: "Reports", href: "/teacher/reports", icon: Award },
    { title: "Settings", href: "/teacher/settings", icon: Settings },
  ]

  return (
    <TenantGuard requireSchool={true} allowedRoles={["teacher", "head_teacher", "head_tutor", "class_teacher"]}>
      <div className="flex h-screen bg-background">
        <Sidebar items={sidebarItems} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </TenantGuard>
  )
}
