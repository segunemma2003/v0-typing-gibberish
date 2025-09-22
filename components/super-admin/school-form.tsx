"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import type { School } from "@/lib/auth"
import { Building2, Save, X } from "lucide-react"

interface SchoolFormProps {
  school?: School
  onSave: (school: Partial<School>) => void
  onCancel: () => void
  isLoading?: boolean
}

export function SchoolForm({ school, onSave, onCancel, isLoading }: SchoolFormProps) {
  const [formData, setFormData] = useState({
    name: school?.name || "",
    subdomain: school?.subdomain || "",
    address: school?.address || "",
    phone: school?.phone || "",
    email: school?.email || "",
    principalName: school?.principalName || "",
    isActive: school?.isActive ?? true,
    timezone: school?.settings?.timezone || "America/New_York",
    currency: school?.settings?.currency || "USD",
    academicYearStart: school?.settings?.academicYearStart || "",
    academicYearEnd: school?.settings?.academicYearEnd || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      settings: {
        timezone: formData.timezone,
        currency: formData.currency,
        academicYearStart: formData.academicYearStart,
        academicYearEnd: formData.academicYearEnd,
      },
    })
  }

  const handleSubdomainChange = (value: string) => {
    // Convert to lowercase and remove special characters
    const cleanSubdomain = value.toLowerCase().replace(/[^a-z0-9-]/g, "")
    setFormData({ ...formData, subdomain: cleanSubdomain })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="w-5 h-5" />
            <span>School Information</span>
          </CardTitle>
          <CardDescription>Basic information about the school</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">School Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter school name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subdomain">Subdomain *</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="subdomain"
                  value={formData.subdomain}
                  onChange={(e) => handleSubdomainChange(e.target.value)}
                  placeholder="schoolname"
                  required
                />
                <span className="text-sm text-gray-500">.compasse.com</span>
              </div>
              {formData.subdomain && (
                <Badge variant="outline" className="text-xs">
                  URL: {formData.subdomain}.compasse.com
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter school address"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1-555-0123"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="info@school.edu"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="principalName">Principal Name *</Label>
            <Input
              id="principalName"
              value={formData.principalName}
              onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
              placeholder="Dr. John Smith"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
            <Label htmlFor="isActive">School is active</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Academic Settings</CardTitle>
          <CardDescription>Configure academic year and regional settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={formData.timezone}
                onValueChange={(value) => setFormData({ ...formData, timezone: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                  <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                  <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData({ ...formData, currency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">US Dollar (USD)</SelectItem>
                  <SelectItem value="EUR">Euro (EUR)</SelectItem>
                  <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                  <SelectItem value="CAD">Canadian Dollar (CAD)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="academicYearStart">Academic Year Start</Label>
              <Input
                id="academicYearStart"
                type="date"
                value={formData.academicYearStart}
                onChange={(e) => setFormData({ ...formData, academicYearStart: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="academicYearEnd">Academic Year End</Label>
              <Input
                id="academicYearEnd"
                type="date"
                value={formData.academicYearEnd}
                onChange={(e) => setFormData({ ...formData, academicYearEnd: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? "Saving..." : school ? "Update School" : "Create School"}
        </Button>
      </div>
    </form>
  )
}
