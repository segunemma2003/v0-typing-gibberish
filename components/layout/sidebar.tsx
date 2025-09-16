"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { useTenant } from "@/lib/tenant"
import { getRoleDisplayName } from "@/lib/auth"
import { GraduationCap, LogOut, ChevronLeft, ChevronRight, Building2 } from "lucide-react"

interface SidebarProps {
  items: {
    title: string
    href: string
    icon: React.ComponentType<{ className?: string }>
    badge?: string
  }[]
  title?: string
  navItems?: {
    name: string
    href: string
    icon: React.ComponentType<{ className?: string }>
  }[]
  userRole?: string
}

export function Sidebar({ items, title, navItems, userRole }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { currentSchool, isSuperAdmin } = useTenant()

  const sidebarItems =
    items ||
    navItems?.map((item) => ({
      title: item.name,
      href: item.href,
      icon: item.icon,
    })) ||
    []

  return (
    <div
      className={`bg-sidebar border-r border-sidebar-border transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                {isSuperAdmin ? (
                  <GraduationCap className="w-5 h-5 text-primary-foreground" />
                ) : (
                  <Building2 className="w-5 h-5 text-primary-foreground" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sidebar-foreground text-sm">
                  {title || (isSuperAdmin ? "Super Admin" : currentSchool?.name || "EduManage")}
                </span>
                {currentSchool && !collapsed && (
                  <span className="text-xs text-sidebar-foreground/70">{currentSchool.subdomain}.edumanage.com</span>
                )}
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>

        {/* User Info */}
        {user && (
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
                  <Badge variant="secondary" className="text-xs">
                    {getRoleDisplayName(user.role)}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={`w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent ${
                      collapsed ? "px-2" : "px-3"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${collapsed ? "" : "mr-3"}`} />
                    {!collapsed && (
                      <>
                        <span>{item.title}</span>
                        {item.badge && (
                          <Badge variant="outline" className="ml-auto text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 border-t border-sidebar-border">
          <Button
            variant="ghost"
            onClick={logout}
            className={`w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent ${
              collapsed ? "px-2" : "px-3"
            }`}
          >
            <LogOut className={`w-4 h-4 ${collapsed ? "" : "mr-3"}`} />
            {!collapsed && <span>Logout</span>}
          </Button>
        </div>
      </div>
    </div>
  )
}
