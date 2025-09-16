"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bus, User, MapPin, Clock, AlertTriangle } from "lucide-react"

const busFleet = [
  {
    id: 1,
    busNumber: "SCH-001",
    driver: "John Smith",
    route: "Route A - Downtown",
    capacity: 45,
    currentOccupancy: 38,
    status: "active",
    lastMaintenance: "2024-02-15",
    nextMaintenance: "2024-03-15",
    location: "Main Street Stop",
  },
  {
    id: 2,
    busNumber: "SCH-002",
    driver: "Mary Johnson",
    route: "Route B - Suburbs",
    capacity: 50,
    currentOccupancy: 42,
    status: "active",
    lastMaintenance: "2024-02-10",
    nextMaintenance: "2024-03-10",
    location: "Oak Avenue Stop",
  },
  {
    id: 3,
    busNumber: "SCH-003",
    driver: "Robert Davis",
    route: "Route C - Industrial",
    capacity: 40,
    currentOccupancy: 0,
    status: "maintenance",
    lastMaintenance: "2024-02-28",
    nextMaintenance: "2024-03-05",
    location: "School Depot",
  },
  {
    id: 4,
    busNumber: "SCH-004",
    driver: "Lisa Wilson",
    route: "Route D - Residential",
    capacity: 48,
    currentOccupancy: 35,
    status: "active",
    lastMaintenance: "2024-02-20",
    nextMaintenance: "2024-03-20",
    location: "Pine Street Stop",
  },
]

export function BusFleet() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Bus Fleet Management</h3>
        <Button>Add Bus</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {busFleet.map((bus) => (
          <Card key={bus.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bus className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">{bus.busNumber}</CardTitle>
                </div>
                <Badge
                  variant={
                    bus.status === "active" ? "default" : bus.status === "maintenance" ? "destructive" : "secondary"
                  }
                >
                  {bus.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Driver: {bus.driver}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{bus.route}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Current Location: {bus.location}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Occupancy:</span>
                  <span className="font-medium">
                    {bus.currentOccupancy}/{bus.capacity} students
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${(bus.currentOccupancy / bus.capacity) * 100}%` }}
                  />
                </div>
              </div>

              {new Date(bus.nextMaintenance) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && (
                <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800">Maintenance due: {bus.nextMaintenance}</span>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  Track Live
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
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
