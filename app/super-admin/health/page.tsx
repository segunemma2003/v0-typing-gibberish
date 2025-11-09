"use client"

import { Activity, ServerCog, Wifi, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const healthChecks = [
  {
    title: "API availability",
    description: "Checks uptime of the public and private API clusters.",
    status: "Operational",
    icon: Wifi,
  },
  {
    title: "Background jobs",
    description: "Monitors queue latency and failed job counts across tenants.",
    status: "Operational",
    icon: ServerCog,
  },
  {
    title: "Third-party integrations",
    description: "Verifies connections to messaging, payments, and identity providers.",
    status: "Operational",
    icon: Activity,
  },
]

export default function SuperAdminHealthPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Health</h1>
          <p className="text-gray-600 mt-1">
            Track availability metrics, background job throughput, and third-party dependencies.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {healthChecks.map((check) => {
          const Icon = check.icon
          return (
            <Card key={check.title}>
              <CardHeader className="flex flex-row items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle>{check.title}</CardTitle>
                  <CardDescription>{check.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-600">Current status</span>
                  <span className="text-green-600 font-semibold">{check.status}</span>
                </div>
                <p className="mt-4 text-xs text-gray-500">
                  Live telemetry graphs will be surfaced here once system monitoring is wired in.
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle>Incident response</CardTitle>
              <CardDescription>
                Automate incident creation and escalation policies for rapid super admin response.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-600">
          <p>
            We’re integrating our incident tooling to raise alerts when the health metrics above fall below acceptable
            thresholds. You’ll be able to subscribe to alerts and view post-mortems from this page.
          </p>
          <Link href="/super-admin">
            <Button variant="outline">Return to dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

