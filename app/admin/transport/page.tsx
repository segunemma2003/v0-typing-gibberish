"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Bus, MapPin, Users, Clock } from "lucide-react"

export default function TransportPage() {
  const buses = [
    {
      id: "1",
      number: "BUS-001",
      route: "North Route",
      driver: "John Smith",
      capacity: 40,
      students: 35,
      stops: 8,
      status: "Active",
      departure: "7:00 AM",
    },
    {
      id: "2",
      number: "BUS-002",
      route: "South Route",
      driver: "Mary Johnson",
      capacity: 45,
      students: 42,
      stops: 10,
      status: "Active",
      departure: "7:15 AM",
    },
    {
      id: "3",
      number: "BUS-003",
      route: "East Route",
      driver: "Robert Davis",
      capacity: 35,
      students: 28,
      stops: 6,
      status: "Active",
      departure: "7:30 AM",
    },
    {
      id: "4",
      number: "BUS-004",
      route: "West Route",
      driver: "Lisa Wilson",
      capacity: 40,
      students: 38,
      stops: 9,
      status: "Maintenance",
      departure: "7:00 AM",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transport Management</h1>
          <p className="text-muted-foreground">Manage school buses, routes, and transportation</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Bus
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Buses</CardTitle>
            <Bus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{buses.length}</div>
            <p className="text-xs text-muted-foreground">
              {buses.filter((b) => b.status === "Active").length} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{buses.reduce((acc, b) => acc + b.students, 0)}</div>
            <p className="text-xs text-muted-foreground">Using transport</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Routes</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Active routes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stops</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{buses.reduce((acc, b) => acc + b.stops, 0)}</div>
            <p className="text-xs text-muted-foreground">Across all routes</p>
          </CardContent>
        </Card>
      </div>

      {/* Bus Fleet */}
      <Card>
        <CardHeader>
          <CardTitle>Bus Fleet</CardTitle>
          <CardDescription>Manage school transportation fleet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {buses.map((bus) => (
              <div
                key={bus.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Bus className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{bus.number}</h3>
                    <p className="text-sm text-muted-foreground">{bus.route}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Users className="w-3 h-3 mr-1" />
                        {bus.students}/{bus.capacity} students
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3 mr-1" />
                        {bus.stops} stops
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        {bus.departure}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">Driver</p>
                    <p className="text-sm text-muted-foreground">{bus.driver}</p>
                  </div>
                  <Badge variant={bus.status === "Active" ? "default" : "secondary"}>
                    {bus.status}
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
    </div>
  )
}
