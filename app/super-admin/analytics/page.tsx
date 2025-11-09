"use client"

import { BarChart3, TrendingUp, PieChart, Activity } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const analyticsCards = [
  {
    title: "Tenant growth",
    description: "Track the number of schools onboarded per month and monitor activation trends.",
    icon: TrendingUp,
  },
  {
    title: "Usage metrics",
    description: "View engagement data across teachers, students, and guardians in each tenant.",
    icon: Activity,
  },
  {
    title: "Revenue insights",
    description: "Aggregate subscription revenue, billing status, and planned renewals.",
    icon: PieChart,
  },
]

export default function SuperAdminAnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Platform Analytics</h1>
          <p className="text-gray-600 mt-1">
            A high-level view of system adoption, usage, and financial performance across all tenants.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {analyticsCards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.title}>
              <CardHeader className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle>{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                Data visualisations will appear here once analytics endpoints are available. Charts for tenant adoption,
                user logins, and revenue breakdowns are in progress.
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle>Insights coming soon</CardTitle>
              <CardDescription>
                We’re finalising the analytics pipeline that powers these dashboards.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-600">
          <p>
            You’ll be able to drill into tenant-level metrics, export reports, and monitor adoption goals. For now, consider
            this page a placeholder while the data warehouse integration is completed.
          </p>
          <Button disabled className="opacity-60 cursor-not-allowed">
            Export report (coming soon)
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

