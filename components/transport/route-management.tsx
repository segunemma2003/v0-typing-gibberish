"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Users, Navigation } from "lucide-react"

const routes = [
  {
    id: 1,
    name: "Route A - Downtown",
    busNumber: "SCH-001",
    totalStops: 8,
    totalStudents: 38,
    estimatedTime: "45 min",
    status: "active",
    stops: [
      { name: "School", time: "07:00", students: 0 },
      { name: "Main Street", time: "07:15", students: 8 },
      { name: "City Center", time: "07:25", students: 12 },
      { name: "Park Avenue", time: "07:35", students: 10 },
      { name: "Downtown Mall", time: "07:45", students: 8 },
    ],
  },
  {
    id: 2,
    name: "Route B - Suburbs",
    busNumber: "SCH-002",
    totalStops: 10,
    totalStudents: 42,
    estimatedTime: "55 min",
    status: "active",
    stops: [
      { name: "School", time: "07:00", students: 0 },
      { name: "Oak Avenue", time: "07:12", students: 9 },
      { name: "Maple Street", time: "07:22", students: 11 },
      { name: "Elm Road", time: "07:32", students: 8 },
      { name: "Birch Lane", time: "07:42", students: 14 },
    ],
  },
  {
    id: 3,
    name: "Route C - Industrial",
    busNumber: "SCH-003",
    totalStops: 6,
    totalStudents: 0,
    estimatedTime: "35 min",
    status: "maintenance",
    stops: [
      { name: "School", time: "07:00", students: 0 },
      { name: "Factory District", time: "07:10", students: 0 },
      { name: "Industrial Park", time: "07:20", students: 0 },
      { name: "Warehouse Area", time: "07:30", students: 0 },
    ],
  },
]

export function RouteManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Route Management</h3>
        <Button>Create Route</Button>
      </div>

      <div className="space-y-6">
        {routes.map((route) => (
          <Card key={route.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Navigation className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">{route.name}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{route.busNumber}</Badge>
                  <Badge variant={route.status === "active" ? "default" : "destructive"}>{route.status}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{route.totalStops} stops</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{route.totalStudents} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{route.estimatedTime}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="bg-transparent">
                    View Map
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    Edit Route
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Route Stops:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {route.stops.map((stop, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg text-sm">
                      <div>
                        <p className="font-medium">{stop.name}</p>
                        <p className="text-muted-foreground">{stop.time}</p>
                      </div>
                      <Badge variant="secondary">{stop.students}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
