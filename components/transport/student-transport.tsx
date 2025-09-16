"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Clock, Phone } from "lucide-react"

const transportStudents = [
  {
    id: 1,
    name: "Alice Johnson",
    grade: "Grade 10",
    route: "Route A - Downtown",
    busNumber: "SCH-001",
    pickupStop: "Main Street",
    pickupTime: "07:15",
    dropoffStop: "Main Street",
    dropoffTime: "15:30",
    parentContact: "+1 234-567-8901",
    status: "active",
  },
  {
    id: 2,
    name: "Bob Smith",
    grade: "Grade 8",
    route: "Route B - Suburbs",
    busNumber: "SCH-002",
    pickupStop: "Oak Avenue",
    pickupTime: "07:12",
    dropoffStop: "Oak Avenue",
    dropoffTime: "15:25",
    parentContact: "+1 234-567-8902",
    status: "active",
  },
  {
    id: 3,
    name: "Carol Davis",
    grade: "Grade 12",
    route: "Route A - Downtown",
    busNumber: "SCH-001",
    pickupStop: "City Center",
    pickupTime: "07:25",
    dropoffStop: "City Center",
    dropoffTime: "15:40",
    parentContact: "+1 234-567-8903",
    status: "suspended",
  },
  {
    id: 4,
    name: "David Wilson",
    grade: "Grade 9",
    route: "Route D - Residential",
    busNumber: "SCH-004",
    pickupStop: "Pine Street",
    pickupTime: "07:20",
    dropoffStop: "Pine Street",
    dropoffTime: "15:35",
    parentContact: "+1 234-567-8904",
    status: "active",
  },
]

export function StudentTransport() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Student Transport Management</h3>
        <Button>Assign Transport</Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search students..." className="pl-10" />
        </div>
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by route" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Routes</SelectItem>
            <SelectItem value="route-a">Route A - Downtown</SelectItem>
            <SelectItem value="route-b">Route B - Suburbs</SelectItem>
            <SelectItem value="route-c">Route C - Industrial</SelectItem>
            <SelectItem value="route-d">Route D - Residential</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {transportStudents.map((student) => (
          <Card key={student.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">{student.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{student.grade}</p>
                </div>
                <Badge variant={student.status === "active" ? "default" : "destructive"}>{student.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Route:</span>
                  <span className="font-medium">{student.route}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Bus:</span>
                  <span className="font-medium">{student.busNumber}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Pickup</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span>{student.pickupStop}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span>{student.pickupTime}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Dropoff</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span>{student.dropoffStop}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span>{student.dropoffTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>Parent: {student.parentContact}</span>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  Edit Assignment
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  Track Bus
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
