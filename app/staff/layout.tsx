"use client"

import type React from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { TenantGuard } from "@/components/tenant/tenant-guard"
import { Home, FileText, Calendar, Settings } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const staffRole = user?.role || "staff"

  const sidebarItems = [
    { title: "Dashboard", href: `/staff${staffRole !== "staff" ? `/${staffRole}` : ""}`, icon: Home },
    { title: "Tasks", href: `/staff${staffRole !== "staff" ? `/${staffRole}` : ""}/tasks`, icon: FileText },
    { title: "Schedule", href: `/staff${staffRole !== "staff" ? `/${staffRole}` : ""}/schedule`, icon: Calendar },
    { title: "Settings", href: `/staff${staffRole !== "staff" ? `/${staffRole}` : ""}/settings`, icon: Settings },
  ]

  return (
    <TenantGuard requireSchool={true} allowedRoles={["staff", "driver", "security", "cleaner", "caterer", "nurse"]}>
      <div className="flex h-screen bg-background">
        <Sidebar items={sidebarItems} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </TenantGuard>
  )
}

