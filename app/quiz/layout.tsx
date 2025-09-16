"use client"

import type React from "react"

import { Sidebar } from "@/components/layout/sidebar"
import { TenantGuard } from "@/components/tenant/tenant-guard"
import { useAuth } from "@/hooks/use-auth"
import { Home, Plus, List, BarChart3, Clock, Users, Settings, FileText } from "lucide-react"

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()

  const isTeacher = user && ["teacher", "admin", "head_teacher", "head_tutor", "class_teacher"].includes(user.role)
  const isStudent = user && user.role === "student"

  const sidebarItems = [
    { title: "Dashboard", href: "/quiz", icon: Home },
    ...(isStudent
      ? [
          { title: "Available Quizzes", href: "/quiz/available", icon: List },
          { title: "My Results", href: "/quiz/results", icon: BarChart3 },
          { title: "Practice Tests", href: "/quiz/practice", icon: FileText },
        ]
      : []),
    ...(isTeacher
      ? [
          { title: "Create Quiz", href: "/quiz/create", icon: Plus },
          { title: "My Quizzes", href: "/quiz/manage", icon: List },
          { title: "Results & Analytics", href: "/quiz/analytics", icon: BarChart3 },
          { title: "Question Bank", href: "/quiz/questions", icon: FileText },
        ]
      : []),
    { title: "Schedule", href: "/quiz/schedule", icon: Clock },
    { title: "Participants", href: "/quiz/participants", icon: Users },
    ...(isTeacher ? [{ title: "Settings", href: "/quiz/settings", icon: Settings }] : []),
  ]

  return (
    <TenantGuard
      requireSchool={true}
      allowedRoles={["teacher", "student", "admin", "head_teacher", "head_tutor", "class_teacher"]}
    >
      <div className="flex h-screen bg-background">
        <Sidebar items={sidebarItems} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </TenantGuard>
  )
}
