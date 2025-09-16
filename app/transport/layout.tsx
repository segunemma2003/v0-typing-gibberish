"use client"

import type React from "react"

import { Sidebar } from "@/components/layout/sidebar"
import { TenantGuard } from "@/components/tenant/tenant-guard"
import { Home, Bus, Navigation, Users, MapPin, BarChart3 } from "lucide-react"

export default function TransportLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const sidebarItems = [
    { title: "Overview", href: "/transport", icon: Home },
    { title: "Bus Fleet", href: "/transport/fleet", icon: Bus },
    { title: "Routes", href: "/transport/routes", icon: Navigation },
    { title: "Students", href: "/transport/students", icon: Users },
    { title: "Live Tracking", href: "/transport/tracking", icon: MapPin },
    { title: "Reports", href: "/transport/reports", icon: BarChart3 },
  ]

  return (
    <TenantGuard requireSchool={true} allowedRoles={["admin", "transport_manager", "teacher"]}>
      <div className="flex h-screen bg-background">
        <Sidebar items={sidebarItems} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </TenantGuard>
  )
}
