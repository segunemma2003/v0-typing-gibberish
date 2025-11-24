"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Filter, Download, ShoppingCart, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useInventoryItems } from "@/lib/api/inventory"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"

export default function InventoryPaymentsPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading] = useState(false)

  const { data: inventoryResponse } = useInventoryItems({ per_page: 100 })
  const inventoryItems = inventoryResponse?.data || []

  const [formData, setFormData] = useState({
    item_id: "",
    quantity: "",
    unit_price: "",
    total_amount: "",
    supplier: "",
    payment_method: "",
    reference: "",
    notes: "",
  })

  const handleQuantityChange = (value: string) => {
    const qty = parseFloat(value) || 0
    const price = parseFloat(formData.unit_price) || 0
    setFormData({
      ...formData,
      quantity: value,
      total_amount: (qty * price).toFixed(2),
    })
  }

  const handlePriceChange = (value: string) => {
    const qty = parseFloat(formData.quantity) || 0
    const price = parseFloat(value) || 0
    setFormData({
      ...formData,
      unit_price: value,
      total_amount: (qty * price).toFixed(2),
    })
  }

  const handleSubmit = async () => {
    if (!formData.item_id || !formData.quantity || !formData.unit_price || !formData.total_amount) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      // TODO: Implement API call for inventory payment
      toast.success("Inventory payment recorded successfully")
      setFormData({
        item_id: "",
        quantity: "",
        unit_price: "",
        total_amount: "",
        supplier: "",
        payment_method: "",
        reference: "",
        notes: "",
      })
      setShowAddForm(false)
    } catch (error: any) {
      console.error("Error recording inventory payment:", error)
      toast.error(error?.response?.data?.message || "Failed to record inventory payment")
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Payments</h1>
          <p className="text-muted-foreground">Record and manage payments for inventory items</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Record Payment
        </Button>
      </div>

      {/* Add Payment Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Record Inventory Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Inventory Item *</Label>
                <Select 
                  value={formData.item_id || undefined} 
                  onValueChange={(value) => setFormData({ ...formData, item_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select inventory item" />
                  </SelectTrigger>
                  <SelectContent>
                    {inventoryItems.map((item: any) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.name} {item.code ? `(${item.code})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Supplier</Label>
                <Input
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  placeholder="Supplier name"
                />
              </div>
              <div className="space-y-2">
                <Label>Quantity *</Label>
                <Input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Unit Price *</Label>
                <Input
                  type="number"
                  value={formData.unit_price}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Total Amount *</Label>
                <Input
                  type="number"
                  value={formData.total_amount}
                  readOnly
                  className="bg-muted font-semibold"
                />
              </div>
              <div className="space-y-2">
                <Label>Payment Method *</Label>
                <Select 
                  value={formData.payment_method || undefined} 
                  onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Reference Number</Label>
                <Input
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                  placeholder="Payment reference"
                />
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
                Record Payment
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
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
                placeholder="Search inventory payments..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by item" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
                <SelectItem value="card">Card</SelectItem>
              </SelectContent>
            </Select>
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

      {/* Inventory Payments List */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Payment Records</CardTitle>
          <CardDescription>View all inventory payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Inventory payments feature coming soon</p>
              <p className="text-sm text-muted-foreground mt-2">API integration pending</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

