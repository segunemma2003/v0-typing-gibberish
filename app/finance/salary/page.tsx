"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2, Wallet, Loader2, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStaff } from "@/lib/api/staff"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"

export default function SalaryStructurePage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const { data: staffResponse, isLoading, refetch } = useStaff({ per_page: 100 })
  const staff = staffResponse?.data || []

  const [formData, setFormData] = useState({
    staff_id: "",
    base_salary: "",
    allowances: [] as Array<{ name: string; amount: string }>,
    deductions: [] as Array<{ name: string; amount: string }>,
    pay_frequency: "monthly",
    effective_date: "",
    notes: "",
  })

  const [newAllowance, setNewAllowance] = useState({ name: "", amount: "" })
  const [newDeduction, setNewDeduction] = useState({ name: "", amount: "" })

  const handleAddAllowance = () => {
    if (newAllowance.name && newAllowance.amount) {
      setFormData({
        ...formData,
        allowances: [...formData.allowances, { name: newAllowance.name, amount: newAllowance.amount }],
      })
      setNewAllowance({ name: "", amount: "" })
    }
  }

  const handleRemoveAllowance = (index: number) => {
    setFormData({
      ...formData,
      allowances: formData.allowances.filter((_, i) => i !== index),
    })
  }

  const handleAddDeduction = () => {
    if (newDeduction.name && newDeduction.amount) {
      setFormData({
        ...formData,
        deductions: [...formData.deductions, { name: newDeduction.name, amount: newDeduction.amount }],
      })
      setNewDeduction({ name: "", amount: "" })
    }
  }

  const handleRemoveDeduction = (index: number) => {
    setFormData({
      ...formData,
      deductions: formData.deductions.filter((_, i) => i !== index),
    })
  }

  const calculateTotal = () => {
    const base = parseFloat(formData.base_salary) || 0
    const allowanceTotal = formData.allowances.reduce((sum, a) => sum + (parseFloat(a.amount) || 0), 0)
    const deductionTotal = formData.deductions.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0)
    return base + allowanceTotal - deductionTotal
  }

  const handleSubmit = async () => {
    if (!formData.staff_id || !formData.base_salary) {
      toast.error("Please fill in required fields (Staff and Base Salary)")
      return
    }

    try {
      // TODO: Implement API call for salary structure
      toast.success("Salary structure saved successfully")
      setFormData({
        staff_id: "",
        base_salary: "",
        allowances: [],
        deductions: [],
        pay_frequency: "monthly",
        effective_date: "",
        notes: "",
      })
      setShowAddForm(false)
      setEditingId(null)
    } catch (error: any) {
      console.error("Error saving salary structure:", error)
      toast.error(error?.response?.data?.message || "Failed to save salary structure")
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Salary Structure</h1>
          <p className="text-muted-foreground">Manage staff salary structures and payment schedules</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Salary Structure
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{editingId ? "Edit Salary Structure" : "Add Salary Structure"}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => { setShowAddForm(false); setEditingId(null) }}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Staff Member *</Label>
                <Select 
                  value={formData.staff_id || undefined} 
                  onValueChange={(value) => setFormData({ ...formData, staff_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {staff.map((member: any) => (
                      <SelectItem key={member.id} value={member.id.toString()}>
                        {member.name || `${member.first_name} ${member.last_name}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Base Salary *</Label>
                <Input
                  type="number"
                  value={formData.base_salary}
                  onChange={(e) => setFormData({ ...formData, base_salary: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Pay Frequency *</Label>
                <Select 
                  value={formData.pay_frequency} 
                  onValueChange={(value) => setFormData({ ...formData, pay_frequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Effective Date</Label>
                <Input
                  type="date"
                  value={formData.effective_date}
                  onChange={(e) => setFormData({ ...formData, effective_date: e.target.value })}
                />
              </div>
            </div>

            {/* Allowances */}
            <div className="space-y-2">
              <Label>Allowances</Label>
              <div className="flex gap-2">
                <Input
                  value={newAllowance.name}
                  onChange={(e) => setNewAllowance({ ...newAllowance, name: e.target.value })}
                  placeholder="Allowance name"
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={newAllowance.amount}
                  onChange={(e) => setNewAllowance({ ...newAllowance, amount: e.target.value })}
                  placeholder="Amount"
                  className="w-32"
                />
                <Button type="button" onClick={handleAddAllowance}>
                  Add
                </Button>
              </div>
              {formData.allowances.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.allowances.map((allowance, index) => (
                    <Badge key={index} variant="default" className="flex items-center gap-1">
                      {allowance.name}: ₦{parseFloat(allowance.amount || "0").toLocaleString()}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => handleRemoveAllowance(index)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Deductions */}
            <div className="space-y-2">
              <Label>Deductions</Label>
              <div className="flex gap-2">
                <Input
                  value={newDeduction.name}
                  onChange={(e) => setNewDeduction({ ...newDeduction, name: e.target.value })}
                  placeholder="Deduction name"
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={newDeduction.amount}
                  onChange={(e) => setNewDeduction({ ...newDeduction, amount: e.target.value })}
                  placeholder="Amount"
                  className="w-32"
                />
                <Button type="button" onClick={handleAddDeduction}>
                  Add
                </Button>
              </div>
              {formData.deductions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.deductions.map((deduction, index) => (
                    <Badge key={index} variant="destructive" className="flex items-center gap-1">
                      {deduction.name}: ₦{parseFloat(deduction.amount || "0").toLocaleString()}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => handleRemoveDeduction(index)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Total Calculation */}
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Net Salary:</span>
                <span className="text-2xl font-bold">₦{calculateTotal().toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes..."
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSubmit}>
                {editingId ? "Update" : "Save"} Salary Structure
              </Button>
              <Button variant="outline" onClick={() => { setShowAddForm(false); setEditingId(null) }}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by staff name..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Salary Structures List */}
      <Card>
        <CardHeader>
          <CardTitle>Salary Structures</CardTitle>
          <CardDescription>View and manage staff salary structures</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Wallet className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Salary structure management coming soon</p>
            <p className="text-sm text-muted-foreground mt-2">API integration pending</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

