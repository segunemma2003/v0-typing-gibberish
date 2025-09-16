"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Minus, TrendingUp } from "lucide-react"

const housePoints = [
  {
    house: "Phoenix House",
    color: "bg-red-500",
    points: 2450,
    change: +45,
    activities: [
      { activity: "Quiz Competition", points: +50, date: "2024-02-28" },
      { activity: "Late Submission", points: -5, date: "2024-02-27" },
      { activity: "Community Service", points: +25, date: "2024-02-26" },
    ],
  },
  {
    house: "Dragon House",
    color: "bg-blue-500",
    points: 2380,
    change: +30,
    activities: [
      { activity: "Sports Day", points: +40, date: "2024-02-28" },
      { activity: "Uniform Violation", points: -10, date: "2024-02-27" },
      { activity: "Academic Excellence", points: +35, date: "2024-02-25" },
    ],
  },
  {
    house: "Griffin House",
    color: "bg-green-500",
    points: 2320,
    change: +25,
    activities: [
      { activity: "Art Competition", points: +50, date: "2024-02-20" },
      { activity: "Punctuality Award", points: +15, date: "2024-02-19" },
      { activity: "Discipline Issue", points: -15, date: "2024-02-18" },
    ],
  },
  {
    house: "Eagle House",
    color: "bg-yellow-500",
    points: 2290,
    change: +20,
    activities: [
      { activity: "Debate Competition", points: +30, date: "2024-02-25" },
      { activity: "Environmental Project", points: +20, date: "2024-02-24" },
      { activity: "Attendance Bonus", points: +10, date: "2024-02-23" },
    ],
  },
]

export function HousePoints() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">House Points System</h3>
        <Button>Award Points</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {housePoints.map((house) => (
          <Card key={house.house}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${house.color}`} />
                  <CardTitle className="text-base">{house.house}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />+{house.change}
                  </Badge>
                  <span className="text-lg font-bold">{house.points}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Recent Activities:</p>
                {house.activities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{activity.activity}</p>
                      <p className="text-xs text-muted-foreground">{activity.date}</p>
                    </div>
                    <Badge
                      variant={activity.points > 0 ? "default" : "destructive"}
                      className="flex items-center gap-1"
                    >
                      {activity.points > 0 ? <Plus className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                      {Math.abs(activity.points)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
