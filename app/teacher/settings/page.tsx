"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Save, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useUser, useUpdateUser } from "@/lib/api/users"
import { toast } from "sonner"

export default function TeacherSettingsPage() {
  const { user } = useAuth()
  const { data: userData, isLoading } = useUser(user?.id ? Number(user.id) : 0)
  const updateUser = useUpdateUser()

  const [formData, setFormData] = useState({
    name: userData?.name || user?.name || "",
    phone: userData?.phone || "",
    emailNotifications: true,
    assignmentSubmissions: true,
    parentMessages: true,
  })

  // Update form data when user data loads
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        phone: userData.phone || "",
        emailNotifications: true,
        assignmentSubmissions: true,
        parentMessages: true,
      })
    }
  }, [userData])

  const handleSave = async () => {
    if (!user?.id) {
      toast.error("User information not available")
      return
    }

    try {
      await updateUser.mutateAsync({
        id: Number(user.id),
        data: {
          name: formData.name,
          phone: formData.phone,
        },
      })
      toast.success("Settings saved successfully")
    } catch (error: any) {
      console.error("Error saving settings:", error)
      toast.error(error?.response?.data?.message || "Failed to save settings")
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings</p>
        </div>
        <Button onClick={handleSave} disabled={updateUser.isPending}>
          {updateUser.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input 
                type="email" 
                value={userData?.email || user?.email || ""}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input 
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1234567890"
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input 
                value={userData?.role || user?.role || ""}
                disabled
                className="bg-muted"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Manage how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive email notifications</p>
            </div>
            <Switch 
              checked={formData.emailNotifications}
              onCheckedChange={(checked) => setFormData({ ...formData, emailNotifications: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Assignment Submissions</Label>
              <p className="text-sm text-muted-foreground">Notify when students submit</p>
            </div>
            <Switch 
              checked={formData.assignmentSubmissions}
              onCheckedChange={(checked) => setFormData({ ...formData, assignmentSubmissions: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Parent Messages</Label>
              <p className="text-sm text-muted-foreground">Notify about new messages</p>
            </div>
            <Switch 
              checked={formData.parentMessages}
              onCheckedChange={(checked) => setFormData({ ...formData, parentMessages: checked })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
