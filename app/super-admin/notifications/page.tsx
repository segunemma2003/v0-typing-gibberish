"use client"

import { Bell, Settings2, CheckCheck } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SuperAdminNotificationsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Notifications</h1>
          <p className="text-gray-600 mt-1">
            Review status alerts, tenant provisioning messages, and other platform level notifications.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle>Notification center</CardTitle>
                <CardDescription>
                  View recent activity from API provisioning, background jobs, and tenant onboarding flows.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="py-10 text-center text-gray-500">
            <p className="mb-4">Notification ingestion is still being connected to the backend services.</p>
            <p className="mb-6">We’ll surface delivery logs and health alerts once the integration is complete.</p>
            <Link href="/super-admin">
              <Button variant="outline">Back to dashboard</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Settings2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle>Delivery preferences</CardTitle>
                <CardDescription>
                  Configure where system alerts are delivered (email, SMS, Slack) and who receives them.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-600">
            <div className="flex items-center space-x-3">
              <CheckCheck className="w-4 h-4 text-blue-600" />
              <span>Role-based escalations will ensure the right teammate is paged.</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCheck className="w-4 h-4 text-blue-600" />
              <span>Service level rules and quiet-hours support coming shortly.</span>
            </div>
            <div className="pt-4">
              <Button disabled className="opacity-60 cursor-not-allowed">
                Configure preferences (coming soon)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

