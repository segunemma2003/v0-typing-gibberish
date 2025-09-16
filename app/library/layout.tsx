"use client"

import type React from "react"

import { Sidebar } from "@/components/layout/sidebar"
import { TenantGuard } from "@/components/tenant/tenant-guard"
import { useAuth } from "@/hooks/use-auth"
import { Home, BookOpen, Download, Users, BarChart3, Search, Calendar, Settings, Plus, Archive } from "lucide-react"

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()

  const sidebarItems = [
    { title: "Dashboard", href: "/library", icon: Home },
    { title: "Book Catalog", href: "/library/catalog", icon: BookOpen },
    { title: "Digital Resources", href: "/library/digital", icon: Download },
    { title: "Borrowed Books", href: "/library/borrowed", icon: Archive },
    { title: "Search", href: "/library/search", icon: Search },
    { title: "Members", href: "/library/members", icon: Users },
    { title: "Statistics", href: "/library/stats", icon: BarChart3 },
    { title: "Events", href: "/library/events", icon: Calendar },
    ...(user && (user.role === "librarian" || user.role === "admin")
      ? [
          { title: "Add Book", href: "/library/add", icon: Plus },
          { title: "Settings", href: "/library/settings", icon: Settings },
        ]
      : []),
  ]

  return (
    <TenantGuard requireSchool={true} allowedRoles={["librarian", "admin", "teacher", "student"]}>
      <div className="flex h-screen bg-background">
        <Sidebar items={sidebarItems} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </TenantGuard>
  )
}
