"use client"

import type React from "react"

import { Sidebar } from "@/components/layout/sidebar"
import { TenantGuard } from "@/components/tenant/tenant-guard"
import { Home, DollarSign, CreditCard, FileText, BarChart3, Settings, Users } from "lucide-react"

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const sidebarItems = [
    { title: "Overview", href: "/finance", icon: Home },
    { title: "Fee Collection", href: "/finance/fees", icon: DollarSign },
    { title: "Payments", href: "/finance/payments", icon: CreditCard },
    { title: "Fee Structure", href: "/finance/structure", icon: FileText },
    { title: "Student Accounts", href: "/finance/accounts", icon: Users },
    { title: "Reports", href: "/finance/reports", icon: BarChart3 },
    { title: "Settings", href: "/finance/settings", icon: Settings },
  ]

  return (
    <TenantGuard requireSchool={true} allowedRoles={["admin", "finance_manager", "accountant", "finance"]}>
      <div className="flex h-screen bg-background">
        <Sidebar items={sidebarItems} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </TenantGuard>
  )
}
