"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Plus } from "lucide-react"
import Link from "next/link"

export default function SuperAdminUsersPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Users</h1>
          <p className="text-gray-600 mt-1">
            Manage all administrators, school owners, and support personnel within the Compasse platform.
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
          <Plus className="w-4 h-4 mr-2" />
          Invite User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle>User directory</CardTitle>
              <CardDescription>
                A central place to view and manage every user across all tenants. Filtering, search, and bulk actions are
                coming soon.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="py-12 text-center text-gray-500">
          <p className="mb-4">User management APIs are being integrated.</p>
          <p className="mb-6">Once available, you’ll be able to assign roles, reset access, and audit super admin activity.</p>
          <Link href="/super-admin">
            <Button variant="outline">Return to dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

