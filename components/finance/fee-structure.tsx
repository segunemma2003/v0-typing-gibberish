"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Plus, Trash2 } from "lucide-react"

const feeStructure = [
  {
    id: 1,
    category: "Tuition Fees",
    grades: [
      { grade: "Grade 1-5", amount: 4000, installments: 4 },
      { grade: "Grade 6-8", amount: 4500, installments: 4 },
      { grade: "Grade 9-10", amount: 5000, installments: 4 },
      { grade: "Grade 11-12", amount: 5500, installments: 4 },
    ],
    dueDate: "Monthly",
    description: "Academic year tuition fees",
  },
  {
    id: 2,
    category: "Transport Fees",
    grades: [{ grade: "All Grades", amount: 2500, installments: 1 }],
    dueDate: "Quarterly",
    description: "School bus transportation",
  },
  {
    id: 3,
    category: "Library Fees",
    grades: [{ grade: "All Grades", amount: 150, installments: 1 }],
    dueDate: "Annually",
    description: "Library access and book maintenance",
  },
  {
    id: 4,
    category: "Activity Fees",
    grades: [
      { grade: "Grade 1-5", amount: 300, installments: 1 },
      { grade: "Grade 6-8", amount: 400, installments: 1 },
      { grade: "Grade 9-12", amount: 500, installments: 1 },
    ],
    dueDate: "Annually",
    description: "Sports, clubs, and extracurricular activities",
  },
  {
    id: 5,
    category: "Examination Fees",
    grades: [
      { grade: "Grade 10", amount: 800, installments: 1 },
      { grade: "Grade 12", amount: 1000, installments: 1 },
    ],
    dueDate: "Per Exam",
    description: "Board examination and certification fees",
  },
]

export function FeeStructure() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Fee Structure Management</h3>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Fee Category
        </Button>
      </div>

      <div className="space-y-6">
        {feeStructure.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">{category.category}</CardTitle>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{category.dueDate}</Badge>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {category.grades.map((gradeInfo, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{gradeInfo.grade}</p>
                      <p className="text-sm text-muted-foreground">
                        {gradeInfo.installments > 1 ? `${gradeInfo.installments} installments` : "Single payment"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">${gradeInfo.amount.toLocaleString()}</p>
                      {gradeInfo.installments > 1 && (
                        <p className="text-sm text-muted-foreground">
                          ${(gradeInfo.amount / gradeInfo.installments).toLocaleString()} per installment
                        </p>
                      )}
                    </div>
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
