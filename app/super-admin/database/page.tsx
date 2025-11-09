"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database, Table, RefreshCw, Shield } from "lucide-react"

const databasecards = [
  {
    title: "Tenant schemas",
    description: "Review the list of provisioned databases and the storage footprint for each school.",
    icon: Table,
  },
  {
    title: "Backups & retention",
    description: "Nightly backups and snapshot retention policies are automatically managed by Compasse.",
    icon: RefreshCw,
  },
  {
    title: "Encryption",
    description: "All tenant data is encrypted in transit and at rest using industry standard AES-256.",
    icon: Shield,
  },
]

export default function SuperAdminDatabasePage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Database Overview</h1>
          <p className="text-gray-600 mt-1">
            Inspect tenant databases, backup policies, and upcoming maintenance operations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {databasecards.map((card) => {
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
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle>Managed by Compasse</CardTitle>
              <CardDescription>
                Database provisioning, backup rotation, and security hardening are managed automatically for every tenant.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-600">
          <p>
            You’ll soon be able to trigger manual backups, inspect replication lag, and download audit logs directly from
            this page. API endpoints for programmatic management are also on the roadmap.
          </p>
          <Button disabled className="opacity-60 cursor-not-allowed">
            Trigger maintenance (coming soon)
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

