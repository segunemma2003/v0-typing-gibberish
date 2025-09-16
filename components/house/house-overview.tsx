"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Users, Star } from "lucide-react"

const houses = [
  {
    id: 1,
    name: "Phoenix House",
    color: "bg-red-500",
    textColor: "text-red-500",
    houseMaster: "Mr. Johnson",
    totalStudents: 145,
    points: 2450,
    rank: 1,
    recentActivity: "Won Inter-House Quiz Competition",
  },
  {
    id: 2,
    name: "Dragon House",
    color: "bg-blue-500",
    textColor: "text-blue-500",
    houseMaster: "Ms. Williams",
    totalStudents: 138,
    points: 2380,
    rank: 2,
    recentActivity: "Second in Sports Day",
  },
  {
    id: 3,
    name: "Griffin House",
    color: "bg-green-500",
    textColor: "text-green-500",
    houseMaster: "Mr. Davis",
    totalStudents: 142,
    points: 2320,
    rank: 3,
    recentActivity: "Won Art Competition",
  },
  {
    id: 4,
    name: "Eagle House",
    color: "bg-yellow-500",
    textColor: "text-yellow-500",
    houseMaster: "Mrs. Brown",
    totalStudents: 140,
    points: 2290,
    rank: 4,
    recentActivity: "Third in Debate Competition",
  },
]

export function HouseOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {houses.map((house) => (
        <Card key={house.id} className="relative overflow-hidden">
          <div className={`absolute top-0 left-0 right-0 h-1 ${house.color}`} />
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">{house.name}</CardTitle>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Trophy className="h-3 w-3" />#{house.rank}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">House Master: {house.houseMaster}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{house.totalStudents} Students</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className={`h-4 w-4 ${house.textColor}`} />
                <span className="font-semibold">{house.points} pts</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Recent Activity:</p>
              <p className="text-sm">{house.recentActivity}</p>
            </div>
            <Button variant="outline" size="sm" className="w-full bg-transparent">
              View Details
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
