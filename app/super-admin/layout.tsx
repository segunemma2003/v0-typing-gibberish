"use client"

import type React from "react"

import { Sidebar } from "@/components/layout/sidebar"
import { TenantGuard } from "@/components/tenant/tenant-guard"
import { Home, Building2, Users, Settings, BarChart3, Shield, Database, Globe, Bell, CreditCard } from "lucide-react"

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const sidebarItems = [
    { title: "Dashboard", href: "/super-admin", icon: Home },
    { title: "Schools", href: "/super-admin/schools", icon: Building2 },
    { title: "System Users", href: "/super-admin/users", icon: Users },
    { title: "Analytics", href: "/super-admin/analytics", icon: BarChart3 },
    { title: "Billing", href: "/super-admin/billing", icon: CreditCard },
    { title: "Security", href: "/super-admin/security", icon: Shield },
    { title: "Database", href: "/super-admin/database", icon: Database },
    { title: "Global Settings", href: "/super-admin/settings", icon: Settings },
    { title: "System Health", href: "/super-admin/health", icon: Globe },
    { title: "Notifications", href: "/super-admin/notifications", icon: Bell },
  ]

  return (
    <TenantGuard requireSuperAdmin={true}>
      <div className="flex h-screen bg-background">
        <Sidebar items={sidebarItems} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </TenantGuard>
  )
}
