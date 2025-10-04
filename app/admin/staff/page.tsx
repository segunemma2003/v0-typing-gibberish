import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Plus, Filter, Download, Mail, Phone } from "lucide-react"

export default function StaffPage() {
  const staff = [
    {
      id: "1",
      name: "Michael Brown",
      email: "michael.brown@school.edu",
      phone: "+1 555-0101",
      role: "Administrative Assistant",
      department: "Administration",
      status: "Active",
      joinDate: "2021-03-15",
    },
    {
      id: "2",
      name: "Jennifer Lee",
      email: "jennifer.lee@school.edu",
      phone: "+1 555-0102",
      role: "Librarian",
      department: "Library",
      status: "Active",
      joinDate: "2020-09-01",
    },
    {
      id: "3",
      name: "David Martinez",
      email: "david.martinez@school.edu",
      phone: "+1 555-0103",
      role: "IT Support Specialist",
      department: "IT",
      status: "Active",
      joinDate: "2022-01-10",
    },
    {
      id: "4",
      name: "Lisa Anderson",
      email: "lisa.anderson@school.edu",
      phone: "+1 555-0104",
      role: "Nurse",
      department: "Health Services",
      status: "Active",
      joinDate: "2019-08-20",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff</h1>
          <p className="text-muted-foreground">Manage staff members and roles</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Staff Member
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="Search staff..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Staff List */}
      <Card>
        <CardHeader>
          <CardTitle>All Staff Members</CardTitle>
          <CardDescription>A list of all staff members in the school</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {staff.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>{member.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Mail className="w-3 h-3 mr-1" />
                        {member.email}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Phone className="w-3 h-3 mr-1" />
                        {member.phone}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{member.department}</p>
                    <p className="text-xs text-muted-foreground">Joined: {member.joinDate}</p>
                  </div>
                  <Badge variant={member.status === "Active" ? "default" : "secondary"}>
                    {member.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    View Details
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
