"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, UserPlus } from "lucide-react"

const houseMembers = [
  {
    id: 1,
    name: "Alice Johnson",
    house: "Phoenix House",
    role: "House Captain",
    grade: "Grade 12",
    points: 145,
    color: "bg-red-500",
  },
  {
    id: 2,
    name: "Bob Smith",
    house: "Dragon House",
    role: "Vice Captain",
    grade: "Grade 11",
    points: 132,
    color: "bg-blue-500",
  },
  {
    id: 3,
    name: "Carol Davis",
    house: "Griffin House",
    role: "Member",
    grade: "Grade 10",
    points: 98,
    color: "bg-green-500",
  },
  {
    id: 4,
    name: "David Wilson",
    house: "Eagle House",
    role: "Sports Captain",
    grade: "Grade 12",
    points: 156,
    color: "bg-yellow-500",
  },
  {
    id: 5,
    name: "Emma Brown",
    house: "Phoenix House",
    role: "Member",
    grade: "Grade 9",
    points: 87,
    color: "bg-red-500",
  },
  {
    id: 6,
    name: "Frank Miller",
    house: "Dragon House",
    role: "Academic Captain",
    grade: "Grade 11",
    points: 143,
    color: "bg-blue-500",
  },
]

export default function HouseMembersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">House Members</h1>
          <p className="text-muted-foreground">Manage house membership and roles</p>
        </div>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add Member
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search members..." className="pl-10" />
        </div>
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by house" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Houses</SelectItem>
            <SelectItem value="phoenix">Phoenix House</SelectItem>
            <SelectItem value="dragon">Dragon House</SelectItem>
            <SelectItem value="griffin">Griffin House</SelectItem>
            <SelectItem value="eagle">Eagle House</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="captain">House Captain</SelectItem>
            <SelectItem value="vice-captain">Vice Captain</SelectItem>
            <SelectItem value="sports-captain">Sports Captain</SelectItem>
            <SelectItem value="academic-captain">Academic Captain</SelectItem>
            <SelectItem value="member">Member</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {houseMembers.map((member) => (
          <Card key={member.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${member.color}`} />
                  <CardTitle className="text-base">{member.name}</CardTitle>
                </div>
                <Badge variant="secondary">{member.points} pts</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">House:</span>
                  <span className="font-medium">{member.house}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Role:</span>
                  <span className="font-medium">{member.role}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Grade:</span>
                  <span className="font-medium">{member.grade}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
