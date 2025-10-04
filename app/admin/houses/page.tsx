"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Trophy, Users, Award } from "lucide-react"

export default function HousesPage() {
  const houses = [
    {
      id: "1",
      name: "Phoenix House",
      color: "Red",
      captain: "Sarah Anderson",
      points: 1250,
      members: 120,
      achievements: 8,
      rank: 1,
      motto: "Rise from the Ashes",
    },
    {
      id: "2",
      name: "Dragon House",
      color: "Blue",
      captain: "Michael Chen",
      points: 1180,
      members: 115,
      achievements: 7,
      rank: 2,
      motto: "Strength and Honor",
    },
    {
      id: "3",
      name: "Griffin House",
      color: "Green",
      captain: "Emily Johnson",
      points: 1100,
      members: 118,
      achievements: 6,
      rank: 3,
      motto: "Courage and Wisdom",
    },
    {
      id: "4",
      name: "Eagle House",
      color: "Yellow",
      captain: "David Martinez",
      points: 1050,
      members: 112,
      achievements: 5,
      rank: 4,
      motto: "Soar to New Heights",
    },
  ]

  const getColorClass = (color: string) => {
    switch (color) {
      case "Red":
        return "bg-red-100 text-red-600 border-red-200"
      case "Blue":
        return "bg-blue-100 text-blue-600 border-blue-200"
      case "Green":
        return "bg-green-100 text-green-600 border-green-200"
      case "Yellow":
        return "bg-yellow-100 text-yellow-600 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-600 border-gray-200"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">House System</h1>
          <p className="text-muted-foreground">Manage school houses and competitions</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add House
        </Button>
      </div>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>House Leaderboard</CardTitle>
          <CardDescription>Current year standings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {houses
              .sort((a, b) => b.points - a.points)
              .map((house, index) => (
                <div
                  key={house.id}
                  className={`flex items-center justify-between p-4 border-2 rounded-lg ${getColorClass(
                    house.color
                  )}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl font-bold">#{index + 1}</div>
                    <div>
                      <h3 className="font-bold text-lg">{house.name}</h3>
                      <p className="text-sm opacity-75">{house.motto}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-2xl font-bold">{house.points}</div>
                      <div className="text-xs opacity-75">points</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">{house.members}</div>
                      <div className="text-xs opacity-75">members</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">{house.achievements}</div>
                      <div className="text-xs opacity-75">awards</div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* House Details */}
      <div className="grid gap-6 md:grid-cols-2">
        {houses.map((house) => (
          <Card key={house.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{house.name}</CardTitle>
                  <CardDescription className="mt-1">{house.motto}</CardDescription>
                </div>
                <div className={`p-3 rounded-full ${getColorClass(house.color)}`}>
                  <Trophy className="w-6 h-6" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">House Captain:</span>
                  <span className="font-medium">{house.captain}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Color:</span>
                  <Badge className={getColorClass(house.color)}>{house.color}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="w-4 h-4 mr-1" />
                    Members
                  </div>
                  <span className="font-medium">{house.members}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Award className="w-4 h-4 mr-1" />
                    Achievements
                  </div>
                  <span className="font-medium">{house.achievements}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Trophy className="w-4 h-4 mr-1" />
                    Total Points
                  </div>
                  <span className="font-bold text-lg">{house.points}</span>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Members
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Add Points
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
