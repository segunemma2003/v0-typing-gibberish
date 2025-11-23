"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Plus, Bell, Send, Trash2, Edit, Search, X, Loader2 } from "lucide-react"
import { useAnnouncements, useCreateAnnouncement, useUpdateAnnouncement, useDeleteAnnouncement, usePublishAnnouncement } from "@/lib/api/announcements"
import { toast } from "sonner"

export default function AnnouncementsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const { data: announcementsResponse, isLoading, error, refetch } = useAnnouncements({
    search: searchTerm || undefined,
    per_page: 100,
  })

  const createAnnouncement = useCreateAnnouncement()
  const updateAnnouncement = useUpdateAnnouncement()
  const deleteAnnouncement = useDeleteAnnouncement()
  const publishAnnouncement = usePublishAnnouncement()

  const announcements = announcementsResponse?.data || []

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "general",
    status: "draft" as "draft" | "published",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.content) {
      toast.error("Please fill in required fields")
      return
    }

    try {
      if (editingId) {
        await updateAnnouncement.mutateAsync({
          id: editingId,
          data: {
            title: formData.title,
            content: formData.content,
            type: formData.type || undefined,
            status: formData.status,
          },
        })
        toast.success("Announcement updated successfully")
      } else {
        await createAnnouncement.mutateAsync({
          title: formData.title,
          content: formData.content,
          type: formData.type || undefined,
          status: formData.status,
        })
        toast.success("Announcement created successfully")
      }
      setShowCreateForm(false)
      setEditingId(null)
      setFormData({ title: "", content: "", type: "general", status: "draft" })
      refetch()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to save announcement")
    }
  }

  const handleEdit = (announcement: any) => {
    setFormData({
      title: announcement.title || "",
      content: announcement.content || "",
      type: announcement.type || "general",
      status: announcement.status || "draft",
    })
    setEditingId(announcement.id)
    setShowCreateForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return

    try {
      await deleteAnnouncement.mutateAsync(id)
      toast.success("Announcement deleted successfully")
      refetch()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete announcement")
    }
  }

  const handlePublish = async (id: number) => {
    try {
      await publishAnnouncement.mutateAsync(id)
      toast.success("Announcement published successfully")
      refetch()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to publish announcement")
    }
  }

  const getPriorityColor = (status: string) => {
    switch (status) {
      case "published":
        return "default"
      case "draft":
        return "secondary"
      default:
        return "outline"
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Error loading announcements: {error?.message || "Unknown error"}</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
          <p className="text-muted-foreground">Manage school announcements and notifications</p>
        </div>
        <Button
          onClick={() => {
            setShowCreateForm(true)
            setEditingId(null)
            setFormData({ title: "", content: "", type: "general", status: "draft" })
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Announcement
        </Button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{editingId ? "Edit Announcement" : "Create New Announcement"}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowCreateForm(false)
                  setEditingId(null)
                  setFormData({ title: "", content: "", type: "general", status: "draft" })
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <CardDescription>Broadcast important information to students, parents, and staff</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  placeholder="Enter announcement title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Content *</Label>
                <Textarea
                  placeholder="Enter announcement content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Input
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  placeholder="e.g., general, urgent, event"
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex gap-2">
                  {(["draft", "published"] as const).map((status) => (
                    <Button
                      key={status}
                      type="button"
                      variant={formData.status === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFormData({ ...formData, status })}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={createAnnouncement.isPending || updateAnnouncement.isPending}
                >
                  {createAnnouncement.isPending || updateAnnouncement.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      {editingId ? "Update" : "Create"} Announcement
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false)
                    setEditingId(null)
                    setFormData({ title: "", content: "", type: "general", status: "draft" })
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search announcements..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground py-8">No announcements found</p>
            </CardContent>
          </Card>
        ) : (
          announcements.map((announcement: any) => (
            <Card key={announcement.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Bell className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{announcement.title}</CardTitle>
                      <CardDescription className="mt-1">{announcement.content}</CardDescription>
                      <div className="flex items-center gap-3 mt-3">
                        {announcement.type && (
                          <Badge variant="outline">{announcement.type}</Badge>
                        )}
                        <Badge variant={getPriorityColor(announcement.status)}>
                          {announcement.status}
                        </Badge>
                        {announcement.published_at && (
                          <span className="text-xs text-muted-foreground">
                            Published: {new Date(announcement.published_at).toLocaleDateString()}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          Created: {new Date(announcement.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {announcement.status === "draft" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePublish(announcement.id)}
                        disabled={publishAnnouncement.isPending}
                      >
                        <Send className="w-4 h-4 mr-1" />
                        Publish
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => handleEdit(announcement)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(announcement.id)}
                      disabled={deleteAnnouncement.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
