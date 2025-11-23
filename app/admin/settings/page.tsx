"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Building, Loader2 } from "lucide-react"
import { useSchools, useUpdateSchool } from "@/lib/api/schools"
import { toast } from "sonner"

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const { data: schoolsResponse, isLoading } = useSchools()
  const updateSchool = useUpdateSchool()

  const schools = schoolsResponse?.data || []
  const currentSchool = schools?.[0] // Get first school (admin should only have access to one school)

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    website: "",
  })

  useEffect(() => {
    if (currentSchool) {
      setFormData({
        name: currentSchool.name || "",
        address: currentSchool.address || "",
        phone: currentSchool.phone || "",
        email: currentSchool.email || "",
        website: currentSchool.website || "",
      })
    }
  }, [currentSchool])

  const handleSave = async () => {
    if (!currentSchool) {
      toast.error("School information not available")
      return
    }

    if (!formData.name) {
      toast.error("School name is required")
      return
    }

    try {
      await updateSchool.mutateAsync({
        id: currentSchool.id,
        data: {
          name: formData.name,
          address: formData.address || undefined,
          phone: formData.phone || undefined,
          email: formData.email || undefined,
          website: formData.website || undefined,
        },
      })
      setSaved(true)
      toast.success("School information updated successfully")
      setTimeout(() => setSaved(false), 3000)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update school information")
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  if (!currentSchool) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">School information not available</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage school settings and preferences</p>
        </div>
        <Button onClick={handleSave} disabled={updateSchool.isPending}>
          <Save className="w-4 h-4 mr-2" />
          {updateSchool.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : saved ? (
            "Saved!"
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
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
                  <Label htmlFor="schoolName">School Name *</Label>
                  <Input
                    id="schoolName"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter school name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="admin@school.edu"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Education Street, Knowledge City, 12345"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://school.edu"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

