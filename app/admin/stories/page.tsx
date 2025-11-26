"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Plus,
  Image,
  Video,
  FileText,
  Megaphone,
  Award,
  Calendar,
  Search,
  Filter,
  Edit,
  Trash2,
  X,
  Loader2,
  Pin,
  Share2,
  Eye,
  Heart,
  MessageCircle,
  ThumbsUp,
  Smile,
  Sparkles,
  Handshake,
  Lightbulb,
  HelpCircle,
  BarChart3,
  Clock,
  Users,
} from "lucide-react"
import {
  useStories,
  useStory,
  useCreateStory,
  useUpdateStory,
  useDeleteStory,
  useReactToStory,
  useRemoveReaction,
  useAddComment,
  useDeleteComment,
  useShareStory,
  useStoryAnalytics,
  type StoryType,
  type VisibilityType,
  type ReactionType,
} from "@/lib/api/stories"
import { useClasses } from "@/lib/api/academic"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

const STORY_TYPES: { value: StoryType; label: string; icon: React.ElementType }[] = [
  { value: "photo", label: "Photo", icon: Image },
  { value: "video", label: "Video", icon: Video },
  { value: "text", label: "Text", icon: FileText },
  { value: "announcement", label: "Announcement", icon: Megaphone },
  { value: "achievement", label: "Achievement", icon: Award },
  { value: "event", label: "Event", icon: Calendar },
]

const VISIBILITY_OPTIONS: { value: VisibilityType; label: string }[] = [
  { value: "public", label: "Public (Everyone)" },
  { value: "students", label: "Students Only" },
  { value: "staff", label: "Staff Only" },
  { value: "parents", label: "Parents Only" },
  { value: "guardians", label: "Guardians Only" },
  { value: "teachers", label: "Teachers Only" },
  { value: "admin_only", label: "Admin Only" },
  { value: "class_specific", label: "Class Specific" },
]

const REACTION_TYPES: { value: ReactionType; label: string; icon: React.ElementType; emoji: string }[] = [
  { value: "like", label: "Like", icon: ThumbsUp, emoji: "👍" },
  { value: "love", label: "Love", icon: Heart, emoji: "❤️" },
  { value: "celebrate", label: "Celebrate", icon: Sparkles, emoji: "🎉" },
  { value: "support", label: "Support", icon: Handshake, emoji: "🤝" },
  { value: "insightful", label: "Insightful", icon: Lightbulb, emoji: "💡" },
  { value: "curious", label: "Curious", icon: HelpCircle, emoji: "🤔" },
]

export default function StoriesPage() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showDetailView, setShowDetailView] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [selectedStoryId, setSelectedStoryId] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<StoryType | "all">("all")
  const [filterPinned, setFilterPinned] = useState<boolean | "all">("all")
  const [commentText, setCommentText] = useState<Record<number, string>>({})
  const [replyText, setReplyText] = useState<Record<number, string>>({})

  const { data: classesResponse } = useClasses()
  const classes = classesResponse?.data || []

  const { data: storiesResponse, isLoading, error, refetch } = useStories({
    search: searchTerm || undefined,
    type: filterType !== "all" ? filterType : undefined,
    pinned: filterPinned !== "all" ? filterPinned : undefined,
    per_page: 50,
  })

  const stories = storiesResponse?.stories?.data || []

  const { data: storyDetail } = useStory(selectedStoryId || 0)
  const story = storyDetail?.story

  const { data: analyticsData } = useStoryAnalytics(selectedStoryId || 0)

  const createStory = useCreateStory()
  const updateStory = useUpdateStory()
  const deleteStory = useDeleteStory()
  const reactToStory = useReactToStory()
  const removeReaction = useRemoveReaction()
  const addComment = useAddComment()
  const deleteComment = useDeleteComment()
  const shareStory = useShareStory()

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "photo" as StoryType,
    media: [] as string[],
    thumbnail: "",
    visibility: "public" as VisibilityType,
    visible_to_classes: [] as number[],
    is_pinned: false,
    expires_at: "",
    allow_comments: true,
    allow_reactions: true,
    tags: [] as string[],
    category: "",
    newTag: "",
    newMediaUrl: "",
  })

  // Show toast error when error state changes
  useEffect(() => {
    if (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error loading stories"
      toast.error(`Error loading stories: ${errorMessage}`)
    }
  }, [error])

  const handleSubmit = async () => {
    try {
      if (!formData.type || !formData.visibility) {
        toast.error("Please select story type and visibility")
        return
      }

      if (formData.visibility === "class_specific" && formData.visible_to_classes.length === 0) {
        toast.error("Please select at least one class for class-specific visibility")
        return
      }

      const payload = {
        title: formData.title || undefined,
        content: formData.content || undefined,
        type: formData.type,
        media: formData.media.length > 0 ? formData.media : undefined,
        thumbnail: formData.thumbnail || undefined,
        visibility: formData.visibility,
        visible_to_classes: formData.visibility === "class_specific" ? formData.visible_to_classes : undefined,
        is_pinned: formData.is_pinned,
        expires_at: formData.expires_at || undefined,
        allow_comments: formData.allow_comments,
        allow_reactions: formData.allow_reactions,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
        category: formData.category || undefined,
      }

      if (editingId) {
        await updateStory.mutateAsync({ id: editingId, data: payload })
        toast.success("Story updated successfully")
      } else {
        await createStory.mutateAsync(payload)
        toast.success("Story created successfully")
      }

      setShowCreateForm(false)
      setEditingId(null)
      resetForm()
      refetch()
    } catch (error: any) {
      console.error("Error saving story:", error)
      let errorMessage = "Failed to save story"
      if (error?.response?.data) {
        const data = error.response.data
        errorMessage = data.message || data.error || data.detail || JSON.stringify(data)
        if (data.errors) {
          const errors = data.errors
          const errorMessages = Object.entries(errors).map(([field, messages]: [string, any]) => {
            const msg = Array.isArray(messages) ? messages.join(", ") : messages
            return `${field}: ${msg}`
          })
          errorMessage = errorMessages.join("; ")
        }
      } else if (error?.message) {
        errorMessage = error.message
      }
      toast.error(errorMessage)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      type: "photo",
      media: [],
      thumbnail: "",
      visibility: "public",
      visible_to_classes: [],
      is_pinned: false,
      expires_at: "",
      allow_comments: true,
      allow_reactions: true,
      tags: [],
      category: "",
      newTag: "",
      newMediaUrl: "",
    })
  }

  const handleEdit = (story: any) => {
    setFormData({
      title: story.title || "",
      content: story.content || "",
      type: story.type || "photo",
      media: story.media || [],
      thumbnail: story.thumbnail || "",
      visibility: story.visibility || "public",
      visible_to_classes: story.visible_to_classes || [],
      is_pinned: story.is_pinned || false,
      expires_at: story.expires_at ? story.expires_at.split("T")[0] + "T" + story.expires_at.split("T")[1]?.slice(0, 5) : "",
      allow_comments: story.allow_comments !== false,
      allow_reactions: story.allow_reactions !== false,
      tags: story.tags || [],
      category: story.category || "",
      newTag: "",
      newMediaUrl: "",
    })
    setEditingId(story.id)
    setShowCreateForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this story?")) return

    try {
      await deleteStory.mutateAsync(id)
      toast.success("Story deleted successfully")
      if (selectedStoryId === id) {
        setShowDetailView(false)
        setShowAnalytics(false)
        setSelectedStoryId(null)
      }
      refetch()
    } catch (error: any) {
      console.error("Error deleting story:", error)
      let errorMessage = "Failed to delete story"
      if (error?.response?.data) {
        const data = error.response.data
        errorMessage = data.message || data.error || data.detail || errorMessage
      } else if (error?.message) {
        errorMessage = error.message
      }
      toast.error(errorMessage)
    }
  }

  const handleViewStory = (storyId: number) => {
    setSelectedStoryId(storyId)
    setShowDetailView(true)
    refetch()
  }

  const handleReact = async (storyId: number, reactionType: ReactionType) => {
    try {
      if (story?.user_reaction === reactionType) {
        // Remove reaction if same
        await removeReaction.mutateAsync(storyId)
      } else {
        // Add or update reaction
        await reactToStory.mutateAsync({ storyId, reactionType })
      }
      refetch()
    } catch (error: any) {
      console.error("Error reacting to story:", error)
      toast.error(error?.response?.data?.message || "Failed to react to story")
    }
  }

  const handleAddComment = async (storyId: number, parentId?: number) => {
    const text = parentId ? replyText[parentId] : commentText[storyId]
    if (!text?.trim()) {
      toast.error("Please enter a comment")
      return
    }

    try {
      await addComment.mutateAsync({ storyId, comment: text.trim(), parentId })
      if (parentId) {
        setReplyText({ ...replyText, [parentId]: "" })
      } else {
        setCommentText({ ...commentText, [storyId]: "" })
      }
      refetch()
    } catch (error: any) {
      console.error("Error adding comment:", error)
      toast.error(error?.response?.data?.message || "Failed to add comment")
    }
  }

  const handleDeleteComment = async (storyId: number, commentId: number) => {
    if (!confirm("Are you sure you want to delete this comment?")) return

    try {
      await deleteComment.mutateAsync({ storyId, commentId })
      toast.success("Comment deleted successfully")
      refetch()
    } catch (error: any) {
      console.error("Error deleting comment:", error)
      toast.error(error?.response?.data?.message || "Failed to delete comment")
    }
  }

  const handleShare = async (storyId: number) => {
    try {
      await shareStory.mutateAsync(storyId)
      toast.success("Story shared successfully")
      refetch()
    } catch (error: any) {
      console.error("Error sharing story:", error)
      toast.error(error?.response?.data?.message || "Failed to share story")
    }
  }

  const addTag = () => {
    if (formData.newTag.trim() && !formData.tags.includes(formData.newTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, formData.newTag.trim()], newTag: "" })
    }
  }

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) })
  }

  const addMediaUrl = () => {
    if (formData.newMediaUrl.trim() && !formData.media.includes(formData.newMediaUrl.trim())) {
      setFormData({ ...formData, media: [...formData.media, formData.newMediaUrl.trim()], newMediaUrl: "" })
    }
  }

  const removeMediaUrl = (url: string) => {
    setFormData({ ...formData, media: formData.media.filter((m) => m !== url) })
  }

  const toggleClass = (classId: number) => {
    setFormData({
      ...formData,
      visible_to_classes: formData.visible_to_classes.includes(classId)
        ? formData.visible_to_classes.filter((id) => id !== classId)
        : [...formData.visible_to_classes, classId],
    })
  }

  if (isLoading && !stories.length) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error && !stories.length) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-500">Error loading stories: {error instanceof Error ? error.message : "Unknown error"}</p>
            <Button onClick={() => refetch()} className="mt-4">
              Retry
            </Button>
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
          <h1 className="text-3xl font-bold tracking-tight">School Stories</h1>
          <p className="text-muted-foreground">Create and manage school stories</p>
        </div>
        <Button onClick={() => { setShowCreateForm(true); setEditingId(null); resetForm() }}>
          <Plus className="w-4 h-4 mr-2" />
          Create Story
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search stories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={filterType} onValueChange={(value: StoryType | "all") => setFilterType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {STORY_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Pinned</Label>
              <Select
                value={filterPinned === "all" ? "all" : filterPinned ? "true" : "false"}
                onValueChange={(value) => setFilterPinned(value === "all" ? "all" : value === "true")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="true">Pinned Only</SelectItem>
                  <SelectItem value="false">Not Pinned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{editingId ? "Edit Story" : "Create New Story"}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => { setShowCreateForm(false); setEditingId(null); resetForm() }}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Story Type *</Label>
                <Select value={formData.type} onValueChange={(value: StoryType) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STORY_TYPES.map((type) => {
                      const Icon = type.icon
                      return (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Visibility *</Label>
                <Select
                  value={formData.visibility}
                  onValueChange={(value: VisibilityType) => setFormData({ ...formData, visibility: value, visible_to_classes: [] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VISIBILITY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.visibility === "class_specific" && (
                <div className="space-y-2 md:col-span-2">
                  <Label>Select Classes *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto border rounded-md p-4">
                    {classes.map((classItem: any) => (
                      <div key={classItem.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`class-${classItem.id}`}
                          checked={formData.visible_to_classes.includes(classItem.id)}
                          onCheckedChange={() => toggleClass(classItem.id)}
                        />
                        <Label htmlFor={`class-${classItem.id}`} className="cursor-pointer text-sm">
                          {classItem.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2 md:col-span-2">
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Story title (optional)"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Content</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Story content..."
                  rows={4}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Media URLs</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.newMediaUrl}
                    onChange={(e) => setFormData({ ...formData, newMediaUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addMediaUrl()
                      }
                    }}
                  />
                  <Button type="button" onClick={addMediaUrl} variant="outline">
                    Add
                  </Button>
                </div>
                {formData.media.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {formData.media.map((url, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                        <span className="text-sm flex-1 truncate">{url}</span>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeMediaUrl(url)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Thumbnail URL</Label>
                <Input
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  placeholder="https://example.com/thumb.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., sports, academics, events"
                />
              </div>

              <div className="space-y-2">
                <Label>Expires At</Label>
                <Input
                  type="datetime-local"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.newTag}
                    onChange={(e) => setFormData({ ...formData, newTag: e.target.value })}
                    placeholder="Add tag"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    Add
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                        {tag}
                        <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4 md:col-span-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_pinned"
                    checked={formData.is_pinned}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_pinned: !!checked })}
                  />
                  <Label htmlFor="is_pinned" className="cursor-pointer">
                    Pin this story
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="allow_comments"
                    checked={formData.allow_comments}
                    onCheckedChange={(checked) => setFormData({ ...formData, allow_comments: !!checked })}
                  />
                  <Label htmlFor="allow_comments" className="cursor-pointer">
                    Allow comments
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="allow_reactions"
                    checked={formData.allow_reactions}
                    onCheckedChange={(checked) => setFormData({ ...formData, allow_reactions: !!checked })}
                  />
                  <Label htmlFor="allow_reactions" className="cursor-pointer">
                    Allow reactions
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                onClick={handleSubmit}
              >
                {(createStory.isPending || updateStory.isPending) ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {editingId ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    {editingId ? "Update" : "Create"} Story
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => { setShowCreateForm(false); setEditingId(null); resetForm() }}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Story Detail View */}
      {showDetailView && story && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Story Details</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowAnalytics(true)}>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleEdit(story)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => { setShowDetailView(false); setSelectedStoryId(null) }}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Story Content */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {story.title && <h3 className="text-xl font-semibold mb-2">{story.title}</h3>}
                  {story.content && <p className="text-muted-foreground whitespace-pre-wrap">{story.content}</p>}
                  {story.media && story.media.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {story.media.map((url, index) => (
                        <div key={index} className="aspect-video bg-muted rounded-lg overflow-hidden">
                          {story.type === "video" ? (
                            <video src={url} controls className="w-full h-full object-cover" />
                          ) : (
                            <img src={url} alt={`Story media ${index + 1}`} className="w-full h-full object-cover" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {story.is_pinned && (
                  <Badge variant="default" className="gap-1">
                    <Pin className="w-3 h-3" />
                    Pinned
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{STORY_TYPES.find((t) => t.value === story.type)?.label || story.type}</Badge>
                <Badge variant="outline">{VISIBILITY_OPTIONS.find((v) => v.value === story.visibility)?.label || story.visibility}</Badge>
                {story.category && <Badge variant="secondary">{story.category}</Badge>}
                {story.tags && story.tags.map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {story.views_count} views
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {story.reactions_count} reactions
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  {story.comments_count} comments
                </div>
                <div className="flex items-center gap-1">
                  <Share2 className="w-4 h-4" />
                  {story.shares_count} shares
                </div>
                {story.expires_at && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Expires {formatDistanceToNow(new Date(story.expires_at), { addSuffix: true })}
                  </div>
                )}
              </div>
            </div>

            {/* Reactions */}
            {story.allow_reactions && (
              <div className="border-t pt-4">
                <Label className="mb-2">Reactions</Label>
                <div className="flex gap-2 flex-wrap">
                  {REACTION_TYPES.map((reaction) => {
                    const Icon = reaction.icon
                    const isActive = story.user_reaction === reaction.value
                    return (
                      <Button
                        key={reaction.value}
                        type="button"
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleReact(story.id, reaction.value)}
                      >
                        <span className="mr-1">{reaction.emoji}</span>
                        <Icon className="w-3 h-3 mr-1" />
                        {reaction.label}
                      </Button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Comments */}
            {story.allow_comments && (
              <div className="border-t pt-4 space-y-4">
                <Label>Comments ({story.comments_count})</Label>

                {/* Add Comment */}
                <div className="flex gap-2">
                  <Textarea
                    value={commentText[story.id] || ""}
                    onChange={(e) => setCommentText({ ...commentText, [story.id]: e.target.value })}
                    placeholder="Add a comment..."
                    rows={2}
                  />
                  <Button type="button" onClick={() => handleAddComment(story.id)}>
                    Post
                  </Button>
                </div>

                {/* Comments List */}
                {story.comments && story.comments.length > 0 && (
                  <div className="space-y-4">
                    {story.comments.map((comment) => (
                      <div key={comment.id} className="space-y-2">
                        <div className="flex items-start justify-between p-3 bg-muted rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{comment.user.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                              </span>
                            </div>
                            <p className="text-sm">{comment.comment}</p>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="mt-2 h-6"
                              onClick={() => setReplyText({ ...replyText, [comment.id]: replyText[comment.id] || "" })}
                            >
                              Reply
                            </Button>
                            {replyText[comment.id] !== undefined && (
                              <div className="flex gap-2 mt-2">
                                <Textarea
                                  value={replyText[comment.id] || ""}
                                  onChange={(e) => setReplyText({ ...replyText, [comment.id]: e.target.value })}
                                  placeholder="Reply to comment..."
                                  rows={1}
                                  className="text-sm"
                                />
                                <Button type="button" size="sm" onClick={() => handleAddComment(story.id, comment.id)}>
                                  Post
                                </Button>
                              </div>
                            )}
                            {comment.replies && comment.replies.length > 0 && (
                              <div className="ml-6 mt-2 space-y-2">
                                {comment.replies.map((reply) => (
                                  <div key={reply.id} className="flex items-start justify-between p-2 bg-background rounded">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-sm">{reply.user.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                          {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                                        </span>
                                      </div>
                                      <p className="text-sm">{reply.comment}</p>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteComment(story.id, reply.id)}
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteComment(story.id, comment.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => handleShare(story.id)}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button type="button" variant="destructive" onClick={() => handleDelete(story.id)}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analytics View */}
      {showAnalytics && analyticsData && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Story Analytics</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowAnalytics(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{analyticsData.analytics.views_count}</div>
                <div className="text-sm text-muted-foreground">Views</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{analyticsData.analytics.reactions_count}</div>
                <div className="text-sm text-muted-foreground">Reactions</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{analyticsData.analytics.comments_count}</div>
                <div className="text-sm text-muted-foreground">Comments</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{analyticsData.analytics.shares_count}</div>
                <div className="text-sm text-muted-foreground">Shares</div>
              </div>
            </div>

            {analyticsData.analytics.reactions_breakdown && analyticsData.analytics.reactions_breakdown.length > 0 && (
              <div>
                <Label className="mb-2">Reactions Breakdown</Label>
                <div className="space-y-2">
                  {analyticsData.analytics.reactions_breakdown.map((reaction) => (
                    <div key={reaction.reaction_type} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="flex items-center gap-2">
                        {REACTION_TYPES.find((r) => r.value === reaction.reaction_type)?.emoji}
                        {REACTION_TYPES.find((r) => r.value === reaction.reaction_type)?.label || reaction.reaction_type}
                      </span>
                      <span className="font-medium">{reaction.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analyticsData.analytics.top_viewers && analyticsData.analytics.top_viewers.length > 0 && (
              <div>
                <Label className="mb-2">Top Viewers</Label>
                <div className="space-y-2">
                  {analyticsData.analytics.top_viewers.map((viewer) => (
                    <div key={viewer.id} className="flex items-center justify-between p-2 bg-muted rounded">
                      <div>
                        <div className="font-medium">{viewer.user.name}</div>
                        <div className="text-sm text-muted-foreground">{viewer.user.email}</div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(viewer.viewed_at), { addSuffix: true })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stories List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stories.map((story: any) => {
          const TypeIcon = STORY_TYPES.find((t) => t.value === story.type)?.icon || FileText
          return (
            <Card key={story.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleViewStory(story.id)}>
              {story.thumbnail && (
                <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                  <img src={story.thumbnail} alt={story.title || "Story"} className="w-full h-full object-cover" />
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <TypeIcon className="w-4 h-4 text-muted-foreground" />
                      <Badge variant="outline" className="text-xs">
                        {STORY_TYPES.find((t) => t.value === story.type)?.label}
                      </Badge>
                      {story.is_pinned && (
                        <Badge variant="default" className="text-xs">
                          <Pin className="w-3 h-3 mr-1" />
                          Pinned
                        </Badge>
                      )}
                    </div>
                    {story.title && <CardTitle className="text-lg">{story.title}</CardTitle>}
                    {story.content && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{story.content}</p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {story.views_count}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {story.reactions_count}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {story.comments_count}
                    </div>
                  </div>
                  <span className="text-xs">{formatDistanceToNow(new Date(story.created_at), { addSuffix: true })}</span>
                </div>
                {story.expires_at && (
                  <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Expires {formatDistanceToNow(new Date(story.expires_at), { addSuffix: true })}
                  </div>
                )}
                <div className="flex gap-2 mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEdit(story)
                    }}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(story.id)
                    }}
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {stories.length === 0 && !isLoading && (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No stories found</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

