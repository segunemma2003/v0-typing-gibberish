"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Save, Settings as SettingsIcon, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function FinanceSettingsPage() {
  const [isLoading] = useState(false)
  const [settings, setSettings] = useState({
    autoReminder: false,
    lateFeeEnabled: false,
    lateFeePercentage: "",
    currency: "NGN",
    paymentMethods: [] as string[],
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Finance Settings</h1>
          <p className="text-muted-foreground">Configure finance and payment settings</p>
        </div>
      </div>

      {/* Settings Content */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Settings</CardTitle>
          <CardDescription>Configure payment preferences and options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="text-center py-12">
              <SettingsIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Finance settings feature coming soon</p>
              <p className="text-sm text-muted-foreground mt-2">API integration pending</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

