"use client"

import { Shield, KeyRound, Lock, Users, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const securitySections = [
  {
    title: "Identity & access",
    description: "Centralised management of super admin accounts and tenant-level permissions.",
    icon: Users,
  },
  {
    title: "Authentication policies",
    description: "Multi-factor authentication and session expiry settings are enforced globally.",
    icon: KeyRound,
  },
  {
    title: "Secrets management",
    description: "API keys and integration credentials are rotated automatically and stored securely.",
    icon: Lock,
  },
]

export default function SuperAdminSecurityPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Security Center</h1>
          <p className="text-gray-600 mt-1">
            Review the policies that keep tenant data safe and manage access for privileged users.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {securitySections.map((section) => {
          const Icon = section.icon
          return (
            <Card key={section.title}>
              <CardHeader className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle>{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle>Security posture</CardTitle>
              <CardDescription>
                We’re surfacing audit logs, anomaly detection, and compliance status in this dashboard.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-600">
          <p>
            Controls for reviewing privilege changes, downloading access logs, and integrating with incident response tools
            will appear here once expanded security APIs are available.
          </p>
          <Button disabled className="opacity-60 cursor-not-allowed">
            View security report (coming soon)
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle>Incident response</CardTitle>
              <CardDescription>
                Notifications and escalation paths for security incidents will be configurable soon.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-gray-600">
          <p>
            Until the automated workflow arrives, please continue to follow the current incident response process documented
            in the Compasse runbooks.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

