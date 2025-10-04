"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Bell, Send, Trash2, Edit, Search } from "lucide-react"

export default function AnnouncementsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    priority: "normal",
  })

  const announcements = [
    {
      id: "1",
      title: "Parent-Teacher Meeting",
      message: "Annual parent-teacher meeting scheduled for April 15th. All parents are requested to attend.",
      date: "2024-03-28",
      priority: "high",
      author: "Principal",
      recipients: "All Parents",
      status: "Published",
    },
    {
      id: "2",
      title: "Sports Day Announcement",
      message: "The annual sports day will be held on April 20th. Students are encouraged to participate.",
      date: "2024-03-25",
      priority: "normal",
      author: "Sports Coordinator",
      recipients: "All Students",
      status: "Published",
    },
    {
      id: "3",
      title: "Library Hours Extended",
      message: "Library will now be open until 6 PM on weekdays to accommodate student study needs.",
      date: "2024-03-20",
      priority: "low",
      author: "Librarian",
      recipients: "All Students",
      status: "Published",
    },
    {
      id: "4",
      title: "Exam Schedule Released",
      message: "Mid-term examination schedule has been released. Please check the student portal for details.",
      date: "2024-03-18",
      priority: "high",
      author: "Academic Coordinator",
      recipients: "All Students & Parents",
      status: "Published",
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Creating announcement:", formData)
    setShowCreateForm(false)
    setFormData({ title: "", message: "", priority: "normal" })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "normal":
        return "default"
      case "low":
        return "secondary"
      default:
        return "default"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
          <p className="text-muted-foreground">Manage school announcements and notifications</p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus className="w-4 h-4 mr-2" />
          New Announcement
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Announcement</CardTitle>
            <CardDescription>Broadcast important information to students, parents, and staff</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="Enter announcement title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  placeholder="Enter announcement message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Priority</label>
                <div className="flex gap-2 mt-2">
                  {["low", "normal", "high"].map((priority) => (
                    <Button
                      key={priority}
                      type="button"
                      variant={formData.priority === priority ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFormData({ ...formData, priority })}
                    >
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">
                  <Send className="w-4 h-4 mr-2" />
                  Publish Announcement
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
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
            <Input placeholder="Search announcements..." className="pl-10" />
          </div>
        </CardContent>
      </Card>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <Card key={announcement.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Bell className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{announcement.title}</CardTitle>
                    <CardDescription className="mt-1">{announcement.message}</CardDescription>
                    <div className="flex items-center gap-3 mt-3">
                      <Badge variant={getPriorityColor(announcement.priority)}>
                        {announcement.priority.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">By: {announcement.author}</span>
                      <span className="text-xs text-muted-foreground">To: {announcement.recipients}</span>
                      <span className="text-xs text-muted-foreground">{announcement.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
