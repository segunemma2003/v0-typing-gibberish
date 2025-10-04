"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Download, Calendar } from "lucide-react"

export default function TimetablePage() {
  const [selectedClass, setSelectedClass] = useState("Grade 10A")

  const classes = ["Grade 9A", "Grade 10A", "Grade 11B", "Grade 12C"]
  
  const timetable = {
    Monday: [
      { time: "8:00 - 9:00", subject: "Mathematics", teacher: "Dr. Sarah Wilson", room: "Room 201" },
      { time: "9:00 - 10:00", subject: "English", teacher: "Mr. John Davis", room: "Room 202" },
      { time: "10:00 - 11:00", subject: "Physics", teacher: "Dr. Sarah Wilson", room: "Lab 1" },
      { time: "11:00 - 12:00", subject: "History", teacher: "Ms. Emily Chen", room: "Room 203" },
      { time: "12:00 - 1:00", subject: "Lunch Break", teacher: "-", room: "-" },
      { time: "1:00 - 2:00", subject: "Chemistry", teacher: "Dr. Robert Johnson", room: "Lab 2" },
    ],
    Tuesday: [
      { time: "8:00 - 9:00", subject: "English", teacher: "Mr. John Davis", room: "Room 202" },
      { time: "9:00 - 10:00", subject: "Mathematics", teacher: "Dr. Sarah Wilson", room: "Room 201" },
      { time: "10:00 - 11:00", subject: "Computer Science", teacher: "Mr. David Lee", room: "Lab 3" },
      { time: "11:00 - 12:00", subject: "Physical Education", teacher: "Coach Mike", room: "Gym" },
      { time: "12:00 - 1:00", subject: "Lunch Break", teacher: "-", room: "-" },
      { time: "1:00 - 2:00", subject: "Biology", teacher: "Dr. Lisa Brown", room: "Lab 1" },
    ],
    Wednesday: [
      { time: "8:00 - 9:00", subject: "Physics", teacher: "Dr. Sarah Wilson", room: "Lab 1" },
      { time: "9:00 - 10:00", subject: "History", teacher: "Ms. Emily Chen", room: "Room 203" },
      { time: "10:00 - 11:00", subject: "Mathematics", teacher: "Dr. Sarah Wilson", room: "Room 201" },
      { time: "11:00 - 12:00", subject: "English", teacher: "Mr. John Davis", room: "Room 202" },
      { time: "12:00 - 1:00", subject: "Lunch Break", teacher: "-", room: "-" },
      { time: "1:00 - 2:00", subject: "Art", teacher: "Ms. Jennifer Kim", room: "Art Room" },
    ],
    Thursday: [
      { time: "8:00 - 9:00", subject: "Chemistry", teacher: "Dr. Robert Johnson", room: "Lab 2" },
      { time: "9:00 - 10:00", subject: "Computer Science", teacher: "Mr. David Lee", room: "Lab 3" },
      { time: "10:00 - 11:00", subject: "English", teacher: "Mr. John Davis", room: "Room 202" },
      { time: "11:00 - 12:00", subject: "Mathematics", teacher: "Dr. Sarah Wilson", room: "Room 201" },
      { time: "12:00 - 1:00", subject: "Lunch Break", teacher: "-", room: "-" },
      { time: "1:00 - 2:00", subject: "Music", teacher: "Mr. Carlos Garcia", room: "Music Room" },
    ],
    Friday: [
      { time: "8:00 - 9:00", subject: "Mathematics", teacher: "Dr. Sarah Wilson", room: "Room 201" },
      { time: "9:00 - 10:00", subject: "Physics", teacher: "Dr. Sarah Wilson", room: "Lab 1" },
      { time: "10:00 - 11:00", subject: "History", teacher: "Ms. Emily Chen", room: "Room 203" },
      { time: "11:00 - 12:00", subject: "English", teacher: "Mr. John Davis", room: "Room 202" },
      { time: "12:00 - 1:00", subject: "Lunch Break", teacher: "-", room: "-" },
      { time: "1:00 - 2:00", subject: "Library Period", teacher: "Ms. Jennifer Lee", room: "Library" },
    ],
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Timetable</h1>
          <p className="text-muted-foreground">Manage class schedules and timetables</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Timetable
          </Button>
        </div>
      </div>

      {/* Class Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium">Select Class:</span>
            <div className="flex gap-2">
              {classes.map((className) => (
                <Button
                  key={className}
                  variant={selectedClass === className ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedClass(className)}
                >
                  {className}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timetable */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule - {selectedClass}</CardTitle>
          <CardDescription>Current academic week timetable</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {Object.entries(timetable).map(([day, periods]) => (
              <div key={day} className="space-y-3">
                <h3 className="font-semibold text-lg pb-2 border-b">{day}</h3>
                <div className="space-y-2">
                  {periods.map((period, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border ${
                        period.subject === "Lunch Break"
                          ? "bg-muted/50"
                          : "bg-card hover:shadow-md transition-shadow cursor-pointer"
                      }`}
                    >
                      <div className="text-xs text-muted-foreground mb-1">{period.time}</div>
                      <div className="font-medium text-sm">{period.subject}</div>
                      {period.teacher !== "-" && (
                        <>
                          <div className="text-xs text-muted-foreground mt-1">{period.teacher}</div>
                          <div className="text-xs text-muted-foreground">{period.room}</div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
