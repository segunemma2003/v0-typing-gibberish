"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Bus, User, Wrench, Calendar, Plus } from "lucide-react"

const detailedFleet = [
  {
    id: 1,
    busNumber: "SCH-001",
    model: "Mercedes Sprinter",
    year: 2020,
    capacity: 45,
    driver: "John Smith",
    driverPhone: "+1 234-567-8901",
    route: "Route A - Downtown",
    status: "active",
    mileage: 45000,
    lastService: "2024-02-15",
    nextService: "2024-03-15",
    fuelType: "Diesel",
    insurance: "Valid until 2024-12-31",
    registration: "ABC-123",
  },
  {
    id: 2,
    busNumber: "SCH-002",
    model: "Ford Transit",
    year: 2019,
    capacity: 50,
    driver: "Mary Johnson",
    driverPhone: "+1 234-567-8902",
    route: "Route B - Suburbs",
    status: "active",
    mileage: 52000,
    lastService: "2024-02-10",
    nextService: "2024-03-10",
    fuelType: "Diesel",
    insurance: "Valid until 2024-11-30",
    registration: "DEF-456",
  },
  {
    id: 3,
    busNumber: "SCH-003",
    model: "Iveco Daily",
    year: 2018,
    capacity: 40,
    driver: "Robert Davis",
    driverPhone: "+1 234-567-8903",
    route: "Route C - Industrial",
    status: "maintenance",
    mileage: 68000,
    lastService: "2024-02-28",
    nextService: "2024-03-05",
    fuelType: "Diesel",
    insurance: "Valid until 2024-10-15",
    registration: "GHI-789",
  },
]

export default function FleetPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bus Fleet Management</h1>
          <p className="text-muted-foreground">Manage buses, drivers, and maintenance schedules</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Bus
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search buses..." className="pl-10" />
        </div>
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {detailedFleet.map((bus) => (
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
              <p className="text-sm text-muted-foreground">
                {bus.model} ({bus.year})
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Capacity:</span>
                  <p className="font-medium">{bus.capacity} seats</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Mileage:</span>
                  <p className="font-medium">{bus.mileage.toLocaleString()} km</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Fuel:</span>
                  <p className="font-medium">{bus.fuelType}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Registration:</span>
                  <p className="font-medium">{bus.registration}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{bus.driver}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Route:</span>
                  <span className="font-medium">{bus.route}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                  <span>Last Service: {bus.lastService}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Next Service: {bus.nextService}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  Maintenance
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
