"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Building, Bell, Mail, Shield, Database } from "lucide-react"

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage school settings and preferences</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Building className="w-5 h-5" />
                <CardTitle>School Information</CardTitle>
              </div>
              <CardDescription>Update your school's basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="schoolName">School Name</Label>
                  <Input id="schoolName" defaultValue="Demo Elementary School" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="principal">Principal Name</Label>
                  <Input id="principal" defaultValue="Dr. Jane Smith" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" defaultValue="123 Education Street, Knowledge City, 12345" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+1 (555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="admin@demoschool.edu" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" type="url" defaultValue="https://demoschool.edu" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">School Description</Label>
                <Textarea
                  id="description"
                  defaultValue="A leading institution dedicated to excellence in education."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Academic Year Settings</CardTitle>
              <CardDescription>Configure academic calendar settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="yearStart">Academic Year Start</Label>
                  <Input id="yearStart" type="date" defaultValue="2024-09-01" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearEnd">Academic Year End</Label>
                  <Input id="yearEnd" type="date" defaultValue="2025-06-30" />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="termCount">Number of Terms</Label>
                  <Input id="termCount" type="number" defaultValue="3" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input id="timezone" defaultValue="America/New_York" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <CardTitle>Notification Preferences</CardTitle>
              </div>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive push notifications</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Attendance Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get alerted about attendance issues</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Grade Updates</Label>
                  <p className="text-sm text-muted-foreground">Notify about grade changes</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>System Announcements</Label>
                  <p className="text-sm text-muted-foreground">Receive system-wide announcements</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <CardTitle>Email Configuration</CardTitle>
              </div>
              <CardDescription>Configure email server settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="smtpHost">SMTP Host</Label>
                <Input id="smtpHost" placeholder="smtp.example.com" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input id="smtpPort" type="number" defaultValue="587" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpEncryption">Encryption</Label>
                  <Input id="smtpEncryption" defaultValue="TLS" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpUsername">Username</Label>
                <Input id="smtpUsername" type="email" placeholder="noreply@school.edu" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPassword">Password</Label>
                <Input id="smtpPassword" type="password" placeholder="••••••••" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Email Sending</Label>
                  <p className="text-sm text-muted-foreground">Allow system to send emails</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button variant="outline">Test Email Configuration</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <CardTitle>Security Settings</CardTitle>
              </div>
              <CardDescription>Manage security and authentication settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Require 2FA for all users</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Password Expiration</Label>
                  <p className="text-sm text-muted-foreground">Force password change every 90 days</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Session Timeout</Label>
                  <p className="text-sm text-muted-foreground">Auto-logout after 30 minutes of inactivity</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minPasswordLength">Minimum Password Length</Label>
                <Input id="minPasswordLength" type="number" defaultValue="8" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Special Characters</Label>
                  <p className="text-sm text-muted-foreground">Passwords must include special characters</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5" />
                <CardTitle>System Configuration</CardTitle>
              </div>
              <CardDescription>Advanced system settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">Temporarily disable site access</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Debug Mode</Label>
                  <p className="text-sm text-muted-foreground">Enable detailed error logging</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Backup</Label>
                  <p className="text-sm text-muted-foreground">Daily automatic database backups</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="backupTime">Backup Time</Label>
                <Input id="backupTime" type="time" defaultValue="02:00" />
              </div>
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold">Danger Zone</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    Clear Cache
                  </Button>
                  <Button variant="outline" className="w-full">
                    Export Database
                  </Button>
                  <Button variant="destructive" className="w-full">
                    Reset All Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
