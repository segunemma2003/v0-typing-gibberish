"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Trophy, Calendar, Users, Medal } from "lucide-react"

export default function SportsPage() {
  const events = [
    {
      id: "1",
      name: "Annual Sports Day",
      date: "2024-04-20",
      venue: "Main Stadium",
      participants: 450,
      events: 25,
      status: "Upcoming",
      coordinator: "Coach Mike Johnson",
    },
    {
      id: "2",
      name: "Inter-School Basketball Tournament",
      date: "2024-04-15",
      venue: "School Gymnasium",
      participants: 80,
      events: 12,
      status: "In Progress",
      coordinator: "Coach Sarah Williams",
    },
    {
      id: "3",
      name: "Swimming Championship",
      date: "2024-05-05",
      venue: "School Pool",
      participants: 120,
      events: 18,
      status: "Upcoming",
      coordinator: "Coach David Chen",
    },
  ]

  const teams = [
    {
      id: "1",
      sport: "Football",
      teamName: "School Eagles",
      coach: "Coach Mike Johnson",
      players: 22,
      wins: 15,
      losses: 3,
      status: "Active",
    },
    {
      id: "2",
      sport: "Basketball",
      teamName: "School Warriors",
      coach: "Coach Sarah Williams",
      players: 15,
      wins: 12,
      losses: 5,
      status: "Active",
    },
    {
      id: "3",
      sport: "Cricket",
      teamName: "School Challengers",
      coach: "Coach Robert Davis",
      players: 16,
      wins: 10,
      losses: 4,
      status: "Active",
    },
    {
      id: "4",
      sport: "Volleyball",
      teamName: "School Titans",
      coach: "Coach Emily Johnson",
      players: 12,
      wins: 8,
      losses: 6,
      status: "Active",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sports Management</h1>
          <p className="text-muted-foreground">Manage sports events, teams, and activities</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Team
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
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
            <div className="text-2xl font-bold">{teams.length}</div>
            <p className="text-xs text-muted-foreground">Across all sports</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Players</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teams.reduce((acc, t) => acc + t.players, 0)}</div>
            <p className="text-xs text-muted-foreground">Active athletes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.filter((e) => e.status === "Upcoming").length}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Wins</CardTitle>
            <Medal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teams.reduce((acc, t) => acc + t.wins, 0)}</div>
            <p className="text-xs text-muted-foreground">This season</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Scheduled sports events and competitions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{event.name}</h3>
                    <p className="text-sm text-muted-foreground">{event.venue}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-muted-foreground">Date: {event.date}</span>
                      <span className="text-xs text-muted-foreground">
                        Participants: {event.participants}
                      </span>
                      <span className="text-xs text-muted-foreground">Events: {event.events}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">Coordinator</p>
                    <p className="text-sm text-muted-foreground">{event.coordinator}</p>
                  </div>
                  <Badge
                    variant={
                      event.status === "In Progress"
                        ? "default"
                        : event.status === "Upcoming"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {event.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Teams */}
      <div className="grid gap-6 md:grid-cols-2">
        {teams.map((team) => (
          <Card key={team.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{team.teamName}</CardTitle>
                  <CardDescription className="mt-1">{team.sport}</CardDescription>
                </div>
                <Badge variant="default">{team.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Coach:</span>
                  <span className="font-medium">{team.coach}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="w-4 h-4 mr-1" />
                    Players
                  </div>
                  <span className="font-medium">{team.players}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Record:</span>
                  <span className="font-medium">
                    {team.wins}W - {team.losses}L
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Win Rate:</span>
                  <span className="font-bold text-green-600">
                    {Math.round((team.wins / (team.wins + team.losses)) * 100)}%
                  </span>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Roster
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Schedule
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Stats
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
