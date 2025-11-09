"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, ShieldCheck, Globe, Database, Save } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

const globalSettings = [
  {
    title: "Tenant provisioning",
    description: "Enable automated tenant creation workflows for new school requests.",
    icon: Globe,
    enabled: true,
  },
  {
    title: "Database backups",
    description: "Nightly snapshots of each tenant database with 14-day retention.",
    icon: Database,
    enabled: true,
  },
  {
    title: "Advanced security",
    description: "Require MFA for all super admin accounts and staff-level roles.",
    icon: ShieldCheck,
    enabled: false,
  },
]

export default function SuperAdminSettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Global Settings</h1>
          <p className="text-gray-600 mt-1">
            Configure defaults that apply across every tenant, integration, and administrative workflow.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {globalSettings.map((setting) => {
          const Icon = setting.icon
          return (
            <Card key={setting.title}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle>{setting.title}</CardTitle>
                    <CardDescription>{setting.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <Label htmlFor={setting.title} className="text-sm text-gray-600">
                  {setting.enabled ? "Enabled" : "Disabled"}
                </Label>
                <Switch id={setting.title} checked={setting.enabled} disabled />
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle>Configuration management</CardTitle>
              <CardDescription>
                Programmatic access to the Compasse configuration service is being finalised.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-600">
          <p>
            Soon, you’ll be able to version and deploy configuration changes across every tenant directly from this
            interface or via API. Audit history and change approval workflows are also in progress.
          </p>
          <Button disabled className="opacity-60 cursor-not-allowed">
            <Save className="w-4 h-4 mr-2" />
            Save changes (coming soon)
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

