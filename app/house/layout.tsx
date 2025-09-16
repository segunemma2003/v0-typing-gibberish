"use client"

import type React from "react"

import { Sidebar } from "@/components/layout/sidebar"
import { TenantGuard } from "@/components/tenant/tenant-guard"
import { Home, Trophy, Users, Star, Calendar, BarChart3 } from "lucide-react"

export default function HouseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const sidebarItems = [
    { title: "Overview", href: "/house", icon: Home },
    { title: "Competitions", href: "/house/competitions", icon: Trophy },
    { title: "House Members", href: "/house/members", icon: Users },
    { title: "Points System", href: "/house/points", icon: Star },
    { title: "Events", href: "/house/events", icon: Calendar },
    { title: "Reports", href: "/house/reports", icon: BarChart3 },
  ]

  return (
    <TenantGuard requireSchool={true} allowedRoles={["admin", "house_master", "teacher"]}>
      <div className="flex h-screen bg-background">
        <Sidebar items={sidebarItems} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </TenantGuard>
  )
}
