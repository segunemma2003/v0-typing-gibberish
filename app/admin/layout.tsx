"use client"

import type React from "react"

import { Sidebar } from "@/components/layout/sidebar"
import { TenantGuard } from "@/components/tenant/tenant-guard"
import {
  Home,
  Users,
  GraduationCap,
  UserCheck,
  BookOpen,
  Calendar,
  BarChart3,
  Settings,
  Building,
  Building2,
  Bus,
  Trophy,
  Package,
  FileText,
  Bell,
} from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const sidebarItems = [
    { title: "Dashboard", href: "/admin", icon: Home },
    { title: "Students", href: "/admin/students", icon: GraduationCap },
    { title: "Teachers", href: "/admin/teachers", icon: UserCheck },
    { title: "Staff", href: "/admin/staff", icon: Users },
    { title: "Departments", href: "/admin/departments", icon: Building2 },
    { title: "Classes", href: "/admin/classes", icon: BookOpen },
    { title: "Subjects", href: "/admin/subjects", icon: FileText },
    { title: "Academic Years", href: "/admin/academic-years", icon: Calendar },
    { title: "Terms", href: "/admin/terms", icon: Calendar },
    { title: "Timetable", href: "/admin/timetable", icon: Calendar },
    { title: "Reports", href: "/admin/reports", icon: BarChart3 },
    { title: "Announcements", href: "/admin/announcements", icon: Bell },
    { title: "Transport", href: "/admin/transport", icon: Bus },
    { title: "Houses", href: "/admin/houses", icon: Building },
    { title: "Sports", href: "/admin/sports", icon: Trophy },
    { title: "Inventory", href: "/admin/inventory", icon: Package },
    { title: "Settings", href: "/admin/settings", icon: Settings },
  ]

  return (
    <TenantGuard requireSchool={true} allowedRoles={["admin"]}>
      <div className="flex h-screen bg-background">
        <Sidebar items={sidebarItems} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </TenantGuard>
  )
}
