"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Package, AlertTriangle, TrendingDown, Edit, Trash2, X, Loader2 } from "lucide-react"
import {
  useInventoryItems,
  useCreateInventoryItem,
  useUpdateInventoryItem,
  useDeleteInventoryItem,
  useInventoryCategories,
  useCreateInventoryCategory,
} from "@/lib/api/inventory"
import { toast } from "sonner"

export default function InventoryPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  const { data: itemsResponse, isLoading, error, refetch } = useInventoryItems({
    search: searchTerm || undefined,
    category_id: selectedCategory || undefined,
    per_page: 100,
  })

  const { data: categoriesResponse, refetch: refetchCategories } = useInventoryCategories()

  const items = itemsResponse?.data || []
  const categories = categoriesResponse?.data || []

  const createItem = useCreateInventoryItem()
  const updateItem = useUpdateInventoryItem()
  const deleteItem = useDeleteInventoryItem()
  const createCategory = useCreateInventoryCategory()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category_id: "",
    quantity: "",
    unit: "",
    min_stock_level: "",
    location: "",
  })

  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    description: "",
  })

  const handleAdd = async () => {
    if (!formData.name || !formData.category_id || !formData.quantity || !formData.unit || !formData.min_stock_level) {
      toast.error("Please fill in required fields")
      return
    }

    try {
      await createItem.mutateAsync({
        name: formData.name,
        description: formData.description || undefined,
        category_id: parseInt(formData.category_id),
        quantity: parseInt(formData.quantity),
        unit: formData.unit,
        min_stock_level: parseInt(formData.min_stock_level),
        location: formData.location || undefined,
      })
      toast.success("Inventory item created successfully")
      setFormData({ name: "", description: "", category_id: "", quantity: "", unit: "", min_stock_level: "", location: "" })
      setShowAddForm(false)
      refetch()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create inventory item")
    }
  }

  const handleEdit = (item: any) => {
    setFormData({
      name: item.name || "",
      description: item.description || "",
      category_id: item.category_id?.toString() || "",
      quantity: item.quantity?.toString() || "",
      unit: item.unit || "",
      min_stock_level: item.min_stock_level?.toString() || "",
      location: item.location || "",
    })
    setEditingId(item.id)
    setShowAddForm(true)
  }

  const handleUpdate = async () => {
    if (!editingId || !formData.name || !formData.category_id || !formData.quantity || !formData.unit || !formData.min_stock_level) {
      toast.error("Please fill in required fields")
      return
    }

    try {
      await updateItem.mutateAsync({
        id: editingId,
        data: {
          name: formData.name,
          description: formData.description || undefined,
          category_id: parseInt(formData.category_id),
          quantity: parseInt(formData.quantity),
          unit: formData.unit,
          min_stock_level: parseInt(formData.min_stock_level),
          location: formData.location || undefined,
        },
      })
      toast.success("Inventory item updated successfully")
      setFormData({ name: "", description: "", category_id: "", quantity: "", unit: "", min_stock_level: "", location: "" })
      setEditingId(null)
      setShowAddForm(false)
      refetch()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update inventory item")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this inventory item?")) return

    try {
      await deleteItem.mutateAsync(id)
      toast.success("Inventory item deleted successfully")
      refetch()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete inventory item")
    }
  }

  const handleCreateCategory = async () => {
    if (!categoryFormData.name) {
      toast.error("Category name is required")
      return
    }

    try {
      await createCategory.mutateAsync({
        name: categoryFormData.name,
        description: categoryFormData.description || undefined,
      })
      toast.success("Category created successfully")
      setCategoryFormData({ name: "", description: "" })
      setShowCategoryForm(false)
      refetchCategories()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create category")
    }
  }

  const getStatusBadge = (item: any) => {
    if (item.quantity <= 0) {
      return <Badge variant="destructive">Out of Stock</Badge>
    }
    if (item.quantity < item.min_stock_level) {
      return <Badge variant="secondary">Low Stock</Badge>
    }
    return <Badge variant="default">In Stock</Badge>
  }

  const stats = {
    totalItems: items.length,
    lowStock: items.filter((item: any) => item.quantity < item.min_stock_level && item.quantity > 0).length,
    outOfStock: items.filter((item: any) => item.quantity <= 0).length,
    critical: items.filter((item: any) => item.quantity < item.min_stock_level / 2 && item.quantity > 0).length,
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Error loading inventory: {error?.message || "Unknown error"}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">Track and manage school assets and supplies</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowCategoryForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
          <Button
            onClick={() => {
              setShowAddForm(true)
              setEditingId(null)
              setFormData({ name: "", description: "", category_id: "", quantity: "", unit: "", min_stock_level: "", location: "" })
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
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
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.outOfStock}</div>
            <p className="text-xs text-muted-foreground">Urgent restock needed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
            <p className="text-xs text-muted-foreground">Below 50% threshold</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Form */}
      {showCategoryForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Add Category</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowCategoryForm(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Category Name *</Label>
                <Input
                  value={categoryFormData.name}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                  placeholder="e.g., Electronics"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Description</Label>
                <Textarea
                  value={categoryFormData.description}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                  placeholder="Category description"
                  rows={2}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleCreateCategory} disabled={createCategory.isPending}>
                {createCategory.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Category"
                )}
              </Button>
              <Button variant="outline" onClick={() => setShowCategoryForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{editingId ? "Edit Inventory Item" : "Add New Inventory Item"}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Item Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Laptop"
                />
              </div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category: any) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Item description"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Quantity *</Label>
                <Input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Unit *</Label>
                <Input
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="e.g., pieces, units"
                />
              </div>
              <div className="space-y-2">
                <Label>Min Stock Level *</Label>
                <Input
                  type="number"
                  value={formData.min_stock_level}
                  onChange={(e) => setFormData({ ...formData, min_stock_level: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Store Room 1"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={editingId ? handleUpdate : handleAdd} disabled={createItem.isPending || updateItem.isPending}>
                {createItem.isPending || updateItem.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>{editingId ? "Update" : "Add"} Item</>
                )}
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search inventory..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={selectedCategory?.toString() || "all"}
              onValueChange={(value) => setSelectedCategory(value === "all" ? null : parseInt(value))}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category: any) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            {items.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No inventory items found</p>
            ) : (
              items.map((item: any) => (
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
                      <p className="text-sm text-muted-foreground">{item.category?.name || "Uncategorized"}</p>
                      {item.description && <p className="text-sm text-muted-foreground mt-1">{item.description}</p>}
                      <div className="flex items-center gap-4 mt-2">
                        {item.location && <span className="text-xs text-muted-foreground">Location: {item.location}</span>}
                        <span className="text-xs text-muted-foreground">Unit: {item.unit}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">Quantity</p>
                      <p
                        className={`text-lg font-bold ${
                          item.quantity < item.min_stock_level
                            ? item.quantity <= 0
                              ? "text-red-600"
                              : "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {item.quantity} / {item.min_stock_level}
                      </p>
                    </div>
                    {getStatusBadge(item)}
                    <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)} disabled={deleteItem.isPending}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
