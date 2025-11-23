"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trophy, Users, Award, Edit, Trash2, X, Loader2 } from "lucide-react"
import { useHouses, useCreateHouse, useUpdateHouse, useDeleteHouse, useAddHousePoints } from "@/lib/api/houses"
import { useHouseMembers } from "@/lib/api/houses"
import { useStudents } from "@/lib/api/students"
import { toast } from "sonner"

export default function HousesPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [showPointsForm, setShowPointsForm] = useState(false)
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)

  const { data: housesResponse, isLoading, error, refetch } = useHouses()
  const { data: studentsResponse } = useStudents()

  const houses = housesResponse?.data || []
  const students = studentsResponse?.data || []

  const createHouse = useCreateHouse()
  const updateHouse = useUpdateHouse()
  const deleteHouse = useDeleteHouse()
  const addHousePoints = useAddHousePoints()

  const [formData, setFormData] = useState({
    name: "",
    color: "#FF0000",
    description: "",
  })

  const [pointsFormData, setPointsFormData] = useState({
    points: "",
    reason: "",
    student_id: "",
  })

  const handleAdd = async () => {
    if (!formData.name || !formData.color) {
      toast.error("Please fill in required fields")
      return
    }

    try {
      await createHouse.mutateAsync({
        name: formData.name,
        color: formData.color,
        description: formData.description || undefined,
      })
      toast.success("House created successfully")
      setFormData({ name: "", color: "#FF0000", description: "" })
      setShowAddForm(false)
      refetch()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create house")
    }
  }

  const handleEdit = (house: any) => {
    setFormData({
      name: house.name || "",
      color: house.color || "#FF0000",
      description: house.description || "",
    })
    setEditingId(house.id)
    setShowAddForm(true)
  }

  const handleUpdate = async () => {
    if (!editingId || !formData.name || !formData.color) {
      toast.error("Please fill in required fields")
      return
    }

    try {
      await updateHouse.mutateAsync({
        id: editingId,
        data: {
          name: formData.name,
          color: formData.color,
          description: formData.description || undefined,
        },
      })
      toast.success("House updated successfully")
      setFormData({ name: "", color: "#FF0000", description: "" })
      setEditingId(null)
      setShowAddForm(false)
      refetch()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update house")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this house?")) return

    try {
      await deleteHouse.mutateAsync(id)
      toast.success("House deleted successfully")
      refetch()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete house")
    }
  }

  const handleAddPoints = async () => {
    if (!selectedHouse || !pointsFormData.points || !pointsFormData.reason) {
      toast.error("Please fill in required fields")
      return
    }

    try {
      await addHousePoints.mutateAsync({
        id: selectedHouse,
        data: {
          points: parseInt(pointsFormData.points),
          reason: pointsFormData.reason,
          student_id: pointsFormData.student_id ? parseInt(pointsFormData.student_id) : undefined,
        },
      })
      toast.success("Points added successfully")
      setPointsFormData({ points: "", reason: "", student_id: "" })
      setShowPointsForm(false)
      setSelectedHouse(null)
      refetch()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to add points")
    }
  }

  const getColorClass = (color: string) => {
    return `bg-[${color}]/20 text-[${color}] border-[${color}]/30`
  }

  // Sort houses by points
  const sortedHouses = [...houses].sort((a: any, b: any) => (b.total_points || 0) - (a.total_points || 0))

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
            <p className="text-destructive">Error loading houses: {error?.message || "Unknown error"}</p>
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
          <h1 className="text-3xl font-bold tracking-tight">House System</h1>
          <p className="text-muted-foreground">Manage school houses and competitions</p>
        </div>
        <Button
          onClick={() => {
            setShowAddForm(true)
            setEditingId(null)
            setFormData({ name: "", color: "#FF0000", description: "" })
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add House
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{editingId ? "Edit House" : "Add New House"}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>House Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Red House"
                />
              </div>
              <div className="space-y-2">
                <Label>Color *</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="#FF0000"
                  />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="House description or motto"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={editingId ? handleUpdate : handleAdd} disabled={createHouse.isPending || updateHouse.isPending}>
                {createHouse.isPending || updateHouse.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>{editingId ? "Update" : "Create"} House</>
                )}
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Points Form */}
      {showPointsForm && selectedHouse && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Add Points</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowPointsForm(false)
                  setSelectedHouse(null)
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Points *</Label>
                <Input
                  type="number"
                  value={pointsFormData.points}
                  onChange={(e) => setPointsFormData({ ...pointsFormData, points: e.target.value })}
                  placeholder="10"
                />
              </div>
              <div className="space-y-2">
                <Label>Student (Optional)</Label>
                <Select
                  value={pointsFormData.student_id}
                  onValueChange={(value) => setPointsFormData({ ...pointsFormData, student_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All members" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Members</SelectItem>
                    {students.map((student: any) => (
                      <SelectItem key={student.id} value={student.id.toString()}>
                        {student.first_name} {student.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Reason *</Label>
                <Input
                  value={pointsFormData.reason}
                  onChange={(e) => setPointsFormData({ ...pointsFormData, reason: e.target.value })}
                  placeholder="e.g., Sports competition win"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleAddPoints} disabled={addHousePoints.isPending}>
                {addHousePoints.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Points"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowPointsForm(false)
                  setSelectedHouse(null)
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>House Leaderboard</CardTitle>
          <CardDescription>Current year standings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedHouses.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No houses found</p>
            ) : (
              sortedHouses.map((house: any, index: number) => (
                <div
                  key={house.id}
                  className="flex items-center justify-between p-4 border-2 rounded-lg"
                  style={{
                    borderColor: `${house.color}40`,
                    backgroundColor: `${house.color}10`,
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl font-bold" style={{ color: house.color }}>
                      #{index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg" style={{ color: house.color }}>
                        {house.name}
                      </h3>
                      {house.description && <p className="text-sm opacity-75">{house.description}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-2xl font-bold">{house.total_points || 0}</div>
                      <div className="text-xs opacity-75">points</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">{house.member_count || 0}</div>
                      <div className="text-xs opacity-75">members</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* House Details */}
      <div className="grid gap-6 md:grid-cols-2">
        {houses.length === 0 ? (
          <Card className="md:col-span-2">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground py-8">No houses found</p>
            </CardContent>
          </Card>
        ) : (
          houses.map((house: any) => (
            <Card key={house.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{house.name}</CardTitle>
                    {house.description && <CardDescription className="mt-1">{house.description}</CardDescription>}
                  </div>
                  <div
                    className="p-3 rounded-full"
                    style={{
                      backgroundColor: `${house.color}20`,
                      color: house.color,
                    }}
                  >
                    <Trophy className="w-6 h-6" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Color:</span>
                    <Badge style={{ backgroundColor: house.color, color: "white" }}>{house.color}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="w-4 h-4 mr-1" />
                      Members
                    </div>
                    <span className="font-medium">{house.member_count || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Trophy className="w-4 h-4 mr-1" />
                      Total Points
                    </div>
                    <span className="font-bold text-lg">{house.total_points || 0}</span>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setSelectedHouse(house.id)
                      setShowPointsForm(true)
                      setPointsFormData({ points: "", reason: "", student_id: "" })
                    }}
                  >
                    Add Points
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(house)}>
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDelete(house.id)}
                    disabled={deleteHouse.isPending}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
