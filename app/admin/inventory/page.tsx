"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Package, AlertTriangle, TrendingDown } from "lucide-react"

export default function InventoryPage() {
  const inventory = [
    {
      id: "1",
      name: "Textbooks - Mathematics Grade 10",
      category: "Books",
      quantity: 45,
      minStock: 50,
      location: "Main Library",
      value: 2250,
      status: "Low Stock",
    },
    {
      id: "2",
      name: "Laboratory Equipment - Microscopes",
      category: "Science Equipment",
      quantity: 15,
      minStock: 10,
      location: "Science Lab 1",
      value: 15000,
      status: "In Stock",
    },
    {
      id: "3",
      name: "Sports Equipment - Footballs",
      category: "Sports",
      quantity: 8,
      minStock: 15,
      location: "Sports Storage",
      value: 400,
      status: "Low Stock",
    },
    {
      id: "4",
      name: "Computer - Desktop PCs",
      category: "IT Equipment",
      quantity: 35,
      minStock: 30,
      location: "Computer Lab",
      value: 52500,
      status: "In Stock",
    },
    {
      id: "5",
      name: "Chairs - Classroom",
      category: "Furniture",
      quantity: 5,
      minStock: 20,
      location: "Storage Room A",
      value: 250,
      status: "Critical",
    },
    {
      id: "6",
      name: "Projectors",
      category: "IT Equipment",
      quantity: 12,
      minStock: 8,
      location: "AV Room",
      value: 18000,
      status: "In Stock",
    },
  ]

  const stats = {
    totalItems: inventory.length,
    totalValue: inventory.reduce((acc, item) => acc + item.value, 0),
    lowStock: inventory.filter((item) => item.status === "Low Stock").length,
    critical: inventory.filter((item) => item.status === "Critical").length,
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In Stock":
        return <Badge variant="default">In Stock</Badge>
      case "Low Stock":
        return <Badge variant="secondary">Low Stock</Badge>
      case "Critical":
        return <Badge variant="destructive">Critical</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">Track and manage school assets and supplies</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
            <p className="text-xs text-muted-foreground">Inventory items</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Asset value</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.lowStock}</div>
            <p className="text-xs text-muted-foreground">Items need reorder</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
            <p className="text-xs text-muted-foreground">Urgent restock needed</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="Search inventory..." className="pl-10" />
          </div>
        </CardContent>
      </Card>

      {/* Inventory List */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>All school assets and supplies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inventory.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Package className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-muted-foreground">Location: {item.location}</span>
                      <span className="text-xs text-muted-foreground">Value: ${item.value}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">Quantity</p>
                    <p
                      className={`text-lg font-bold ${
                        item.quantity < item.minStock
                          ? item.status === "Critical"
                            ? "text-red-600"
                            : "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {item.quantity} / {item.minStock}
                    </p>
                  </div>
                  {getStatusBadge(item.status)}
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
