"use client"

import type React from "react"

import { Sidebar } from "@/components/layout/sidebar"
import { TenantGuard } from "@/components/tenant/tenant-guard"
import {
  Home,
  Users,
  MessageSquare,
  Calendar,
  BarChart3,
  FileText,
  Clock,
  Bell,
  CreditCard,
  Settings,
} from "lucide-react"

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const sidebarItems = [
    { title: "Dashboard", href: "/parent", icon: Home },
    { title: "My Children", href: "/parent/children", icon: Users },
    { title: "Academic Reports", href: "/parent/reports", icon: BarChart3 },
    { title: "Communications", href: "/parent/messages", icon: MessageSquare },
    { title: "Events & Calendar", href: "/parent/events", icon: Calendar },
    { title: "Attendance", href: "/parent/attendance", icon: Clock },
    { title: "Assignments", href: "/parent/assignments", icon: FileText },
    { title: "Notifications", href: "/parent/notifications", icon: Bell },
    { title: "Payments", href: "/parent/payments", icon: CreditCard },
    { title: "Settings", href: "/parent/settings", icon: Settings },
  ]

  return (
    <TenantGuard requireSchool={true} allowedRoles={["parent"]}>
      <div className="flex h-screen bg-background">
        <Sidebar items={sidebarItems} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </TenantGuard>
  )
}
