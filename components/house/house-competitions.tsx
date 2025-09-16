"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Calendar, Users } from "lucide-react"

const competitions = [
  {
    id: 1,
    name: "Inter-House Sports Day",
    date: "2024-03-15",
    status: "upcoming",
    participants: 120,
    categories: ["Athletics", "Swimming", "Football", "Basketball"],
    winner: null,
  },
  {
    id: 2,
    name: "Academic Quiz Competition",
    date: "2024-02-28",
    status: "completed",
    participants: 48,
    categories: ["Science", "Mathematics", "Literature", "History"],
    winner: "Phoenix House",
  },
  {
    id: 3,
    name: "Art & Craft Exhibition",
    date: "2024-02-20",
    status: "completed",
    participants: 85,
    categories: ["Painting", "Sculpture", "Digital Art", "Crafts"],
    winner: "Griffin House",
  },
  {
    id: 4,
    name: "Debate Championship",
    date: "2024-04-10",
    status: "upcoming",
    participants: 32,
    categories: ["Junior", "Senior", "Parliamentary", "Oxford"],
    winner: null,
  },
]

export function HouseCompetitions() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">House Competitions</h3>
        <Button>Add Competition</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {competitions.map((competition) => (
          <Card key={competition.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{competition.name}</CardTitle>
                <Badge variant={competition.status === "completed" ? "default" : "secondary"}>
                  {competition.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(competition.date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {competition.participants} participants
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Categories:</p>
                <div className="flex flex-wrap gap-1">
                  {competition.categories.map((category) => (
                    <Badge key={category} variant="outline" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              {competition.winner && (
                <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                  <Trophy className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">Winner: {competition.winner}</span>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  View Details
                </Button>
                {competition.status === "upcoming" && (
                  <Button size="sm" className="flex-1">
                    Manage
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
