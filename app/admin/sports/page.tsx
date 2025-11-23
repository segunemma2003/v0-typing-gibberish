"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trophy, Calendar, Users, Medal, Edit, Trash2, X, Loader2 } from "lucide-react"
import {
  useSportsActivities,
  useCreateSportsActivity,
  useSportsTeams,
  useCreateSportsTeam,
  useSportsEvents,
  useCreateSportsEvent,
} from "@/lib/api/sports"
import { useTeachers } from "@/lib/api/teachers"
import { useStudents } from "@/lib/api/students"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SportsPage() {
  const [activeTab, setActiveTab] = useState<"events" | "teams" | "activities">("events")
  const [showEventForm, setShowEventForm] = useState(false)
  const [showTeamForm, setShowTeamForm] = useState(false)
  const [showActivityForm, setShowActivityForm] = useState(false)

  const { data: eventsResponse, isLoading: eventsLoading, refetch: refetchEvents } = useSportsEvents()
  const { data: teamsResponse, isLoading: teamsLoading, refetch: refetchTeams } = useSportsTeams()
  const { data: activitiesResponse, isLoading: activitiesLoading, refetch: refetchActivities } = useSportsActivities()
  const { data: teachersResponse } = useTeachers()
  const { data: studentsResponse } = useStudents()

  const events = eventsResponse?.data || []
  const teams = teamsResponse?.data || []
  const activities = activitiesResponse?.data || []
  const teachers = teachersResponse?.data || []
  const students = studentsResponse?.data || []

  const createEvent = useCreateSportsEvent()
  const createTeam = useCreateSportsTeam()
  const createActivity = useCreateSportsActivity()

  const [eventFormData, setEventFormData] = useState({
    name: "",
    description: "",
    sport: "",
    date: "",
    venue: "",
    team_ids: [] as number[],
  })

  const [teamFormData, setTeamFormData] = useState({
    name: "",
    sport: "",
    coach_id: "",
    member_ids: [] as number[],
  })

  const [activityFormData, setActivityFormData] = useState({
    name: "",
    description: "",
    category: "",
    coach_id: "",
    schedule: "",
  })

  const handleCreateEvent = async () => {
    if (!eventFormData.name || !eventFormData.sport || !eventFormData.date || eventFormData.team_ids.length === 0) {
      toast.error("Please fill in required fields")
      return
    }

    try {
      await createEvent.mutateAsync({
        name: eventFormData.name,
        description: eventFormData.description || undefined,
        sport: eventFormData.sport,
        date: eventFormData.date,
        venue: eventFormData.venue || undefined,
        team_ids: eventFormData.team_ids,
      })
      toast.success("Sports event created successfully")
      setEventFormData({ name: "", description: "", sport: "", date: "", venue: "", team_ids: [] })
      setShowEventForm(false)
      refetchEvents()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create event")
    }
  }

  const handleCreateTeam = async () => {
    if (!teamFormData.name || !teamFormData.sport || !teamFormData.coach_id) {
      toast.error("Please fill in required fields")
      return
    }

    try {
      await createTeam.mutateAsync({
        name: teamFormData.name,
        sport: teamFormData.sport,
        coach_id: parseInt(teamFormData.coach_id),
        member_ids: teamFormData.member_ids,
      })
      toast.success("Sports team created successfully")
      setTeamFormData({ name: "", sport: "", coach_id: "", member_ids: [] })
      setShowTeamForm(false)
      refetchTeams()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create team")
    }
  }

  const handleCreateActivity = async () => {
    if (!activityFormData.name || !activityFormData.category) {
      toast.error("Please fill in required fields")
      return
    }

    try {
      await createActivity.mutateAsync({
        name: activityFormData.name,
        description: activityFormData.description || undefined,
        category: activityFormData.category,
        coach_id: activityFormData.coach_id ? parseInt(activityFormData.coach_id) : undefined,
        schedule: activityFormData.schedule || undefined,
      })
      toast.success("Sports activity created successfully")
      setActivityFormData({ name: "", description: "", category: "", coach_id: "", schedule: "" })
      setShowActivityForm(false)
      refetchActivities()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create activity")
    }
  }

  const toggleTeamSelection = (teamId: number) => {
    setEventFormData((prev) => ({
      ...prev,
      team_ids: prev.team_ids.includes(teamId) ? prev.team_ids.filter((id) => id !== teamId) : [...prev.team_ids, teamId],
    }))
  }

  const toggleMemberSelection = (studentId: number) => {
    setTeamFormData((prev) => ({
      ...prev,
      member_ids: prev.member_ids.includes(studentId)
        ? prev.member_ids.filter((id) => id !== studentId)
        : [...prev.member_ids, studentId],
    }))
  }

  const stats = {
    activeTeams: teams.filter((t: any) => t.status === "active").length,
    totalPlayers: teams.reduce((acc: number, team: any) => acc + (team.members?.length || 0), 0),
    upcomingEvents: events.filter((e: any) => e.status === "scheduled").length,
    totalWins: 0, // This would come from match results API if available
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sports Management</h1>
          <p className="text-muted-foreground">Manage sports events, teams, and activities</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Teams</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeTeams}</div>
            <p className="text-xs text-muted-foreground">Across all sports</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Players</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPlayers}</div>
            <p className="text-xs text-muted-foreground">Active athletes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">Scheduled events</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Wins</CardTitle>
            <Medal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWins}</div>
            <p className="text-xs text-muted-foreground">This season</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
        <TabsList>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setShowEventForm(true)
                setEventFormData({ name: "", description: "", sport: "", date: "", venue: "", team_ids: [] })
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </div>

          {showEventForm && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Create Sports Event</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowEventForm(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Event Name *</Label>
                    <Input
                      value={eventFormData.name}
                      onChange={(e) => setEventFormData({ ...eventFormData, name: e.target.value })}
                      placeholder="e.g., Inter-House Football Match"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Sport *</Label>
                    <Input
                      value={eventFormData.sport}
                      onChange={(e) => setEventFormData({ ...eventFormData, sport: e.target.value })}
                      placeholder="e.g., Football"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date *</Label>
                    <Input
                      type="date"
                      value={eventFormData.date}
                      onChange={(e) => setEventFormData({ ...eventFormData, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Venue</Label>
                    <Input
                      value={eventFormData.venue}
                      onChange={(e) => setEventFormData({ ...eventFormData, venue: e.target.value })}
                      placeholder="e.g., School Field"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Description</Label>
                    <Textarea
                      value={eventFormData.description}
                      onChange={(e) => setEventFormData({ ...eventFormData, description: e.target.value })}
                      placeholder="Event description"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Teams *</Label>
                    <div className="flex flex-wrap gap-2 border rounded-lg p-3 min-h-[60px]">
                      {teams.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No teams available</p>
                      ) : (
                        teams.map((team: any) => (
                          <Badge
                            key={team.id}
                            variant={eventFormData.team_ids.includes(team.id) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => toggleTeamSelection(team.id)}
                          >
                            {team.name}
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleCreateEvent} disabled={createEvent.isPending}>
                    {createEvent.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Event"
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setShowEventForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Events List */}
          <div className="space-y-4">
            {events.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground py-8">No events found</p>
                </CardContent>
              </Card>
            ) : (
              events.map((event: any) => (
                <Card key={event.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{event.name}</CardTitle>
                        <CardDescription className="mt-1">{event.sport} - {event.venue || "TBD"}</CardDescription>
                      </div>
                      <Badge variant={event.status === "scheduled" ? "secondary" : event.status === "ongoing" ? "default" : "outline"}>
                        {event.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {event.description && <p className="text-sm text-muted-foreground mb-3">{event.description}</p>}
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">Date: {new Date(event.date).toLocaleDateString()}</span>
                      {event.teams && event.teams.length > 0 && (
                        <span className="text-muted-foreground">Teams: {event.teams.length}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Teams Tab */}
        <TabsContent value="teams" className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setShowTeamForm(true)
                setTeamFormData({ name: "", sport: "", coach_id: "", member_ids: [] })
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Team
            </Button>
          </div>

          {showTeamForm && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Create Sports Team</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowTeamForm(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Team Name *</Label>
                    <Input
                      value={teamFormData.name}
                      onChange={(e) => setTeamFormData({ ...teamFormData, name: e.target.value })}
                      placeholder="e.g., Junior Football Team"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Sport *</Label>
                    <Input
                      value={teamFormData.sport}
                      onChange={(e) => setTeamFormData({ ...teamFormData, sport: e.target.value })}
                      placeholder="e.g., Football"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Coach *</Label>
                    <Select value={teamFormData.coach_id} onValueChange={(value) => setTeamFormData({ ...teamFormData, coach_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a coach" />
                      </SelectTrigger>
                      <SelectContent>
                        {teachers.map((teacher: any) => (
                          <SelectItem key={teacher.id} value={teacher.id.toString()}>
                            {teacher.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Members</Label>
                    <div className="flex flex-wrap gap-2 border rounded-lg p-3 min-h-[60px] max-h-[200px] overflow-y-auto">
                      {students.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No students available</p>
                      ) : (
                        students.map((student: any) => (
                          <Badge
                            key={student.id}
                            variant={teamFormData.member_ids.includes(student.id) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => toggleMemberSelection(student.id)}
                          >
                            {student.first_name} {student.last_name}
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleCreateTeam} disabled={createTeam.isPending}>
                    {createTeam.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Team"
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setShowTeamForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Teams List */}
          <div className="grid gap-6 md:grid-cols-2">
            {teams.length === 0 ? (
              <Card className="md:col-span-2">
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground py-8">No teams found</p>
                </CardContent>
              </Card>
            ) : (
              teams.map((team: any) => (
                <Card key={team.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{team.name}</CardTitle>
                        <CardDescription className="mt-1">{team.sport}</CardDescription>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Coach:</span>
                        <span className="font-medium">{teachers.find((t: any) => t.id === team.coach_id)?.name || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Members:</span>
                        <span className="font-medium">{team.members?.length || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent value="activities" className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setShowActivityForm(true)
                setActivityFormData({ name: "", description: "", category: "", coach_id: "", schedule: "" })
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Activity
            </Button>
          </div>

          {showActivityForm && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Create Sports Activity</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowActivityForm(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Activity Name *</Label>
                    <Input
                      value={activityFormData.name}
                      onChange={(e) => setActivityFormData({ ...activityFormData, name: e.target.value })}
                      placeholder="e.g., Football"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Input
                      value={activityFormData.category}
                      onChange={(e) => setActivityFormData({ ...activityFormData, category: e.target.value })}
                      placeholder="e.g., Team Sport"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Coach</Label>
                    <Select
                      value={activityFormData.coach_id}
                      onValueChange={(value) => setActivityFormData({ ...activityFormData, coach_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a coach" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {teachers.map((teacher: any) => (
                          <SelectItem key={teacher.id} value={teacher.id.toString()}>
                            {teacher.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Schedule</Label>
                    <Input
                      value={activityFormData.schedule}
                      onChange={(e) => setActivityFormData({ ...activityFormData, schedule: e.target.value })}
                      placeholder="e.g., Monday, Wednesday, Friday"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Description</Label>
                    <Textarea
                      value={activityFormData.description}
                      onChange={(e) => setActivityFormData({ ...activityFormData, description: e.target.value })}
                      placeholder="Activity description"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleCreateActivity} disabled={createActivity.isPending}>
                    {createActivity.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Activity"
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setShowActivityForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Activities List */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activities.length === 0 ? (
              <Card className="md:col-span-3">
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground py-8">No activities found</p>
                </CardContent>
              </Card>
            ) : (
              activities.map((activity: any) => (
                <Card key={activity.id}>
                  <CardHeader>
                    <CardTitle>{activity.name}</CardTitle>
                    <CardDescription>{activity.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {activity.description && <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>}
                    {activity.schedule && (
                      <p className="text-sm text-muted-foreground">Schedule: {activity.schedule}</p>
                    )}
                    <Badge variant={activity.status === "active" ? "default" : "secondary"} className="mt-2">
                      {activity.status}
                    </Badge>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
