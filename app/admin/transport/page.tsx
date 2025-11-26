"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Bus, MapPin, Users, Clock, Edit, Trash2, X, Loader2 } from "lucide-react"
import {
  useVehicles,
  useCreateVehicle,
  useUpdateVehicle,
  useDeleteVehicle,
  useTransportRoutes,
  useCreateTransportRoute,
  useUpdateTransportRoute,
  useDeleteTransportRoute,
  useDrivers,
  useCreateDriver,
  useUpdateDriver,
  useDeleteDriver,
} from "@/lib/api/transport"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TransportPage() {
  const [activeTab, setActiveTab] = useState<"vehicles" | "routes" | "drivers">("vehicles")
  const [showVehicleForm, setShowVehicleForm] = useState(false)
  const [showRouteForm, setShowRouteForm] = useState(false)
  const [showDriverForm, setShowDriverForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const { data: vehiclesResponse, isLoading: vehiclesLoading, refetch: refetchVehicles } = useVehicles()
  const { data: routesResponse, isLoading: routesLoading, refetch: refetchRoutes } = useTransportRoutes()
  const { data: driversResponse, isLoading: driversLoading, refetch: refetchDrivers } = useDrivers()

  const vehicles = vehiclesResponse?.data || []
  const routes = routesResponse?.data || []
  const drivers = driversResponse?.data || []

  const createVehicle = useCreateVehicle()
  const updateVehicle = useUpdateVehicle()
  const deleteVehicle = useDeleteVehicle()
  const createRoute = useCreateTransportRoute()
  const updateRoute = useUpdateTransportRoute()
  const deleteRoute = useDeleteTransportRoute()
  const createDriver = useCreateDriver()
  const updateDriver = useUpdateDriver()
  const deleteDriver = useDeleteDriver()

  const [vehicleFormData, setVehicleFormData] = useState({
    registration_number: "",
    make: "",
    model: "",
    year: "",
    capacity: "",
    driver_id: "",
    route_id: "",
  })

  const [routeFormData, setRouteFormData] = useState({
    name: "",
    start_location: "",
    end_location: "",
    distance: "",
    estimated_time: "",
    fare: "",
  })

  const [driverFormData, setDriverFormData] = useState({
    name: "",
    license_number: "",
    phone: "",
    email: "",
  })

  const handleCreateVehicle = async () => {
    if (!vehicleFormData.registration_number || !vehicleFormData.make || !vehicleFormData.model || !vehicleFormData.capacity) {
      toast.error("Please fill in required fields")
      return
    }

    try {
      await createVehicle.mutateAsync({
        registration_number: vehicleFormData.registration_number,
        make: vehicleFormData.make,
        model: vehicleFormData.model,
        year: vehicleFormData.year ? parseInt(vehicleFormData.year) : undefined,
        capacity: parseInt(vehicleFormData.capacity),
        driver_id: vehicleFormData.driver_id ? parseInt(vehicleFormData.driver_id) : undefined,
        route_id: vehicleFormData.route_id ? parseInt(vehicleFormData.route_id) : undefined,
      })
      toast.success("Vehicle created successfully")
      setVehicleFormData({ registration_number: "", make: "", model: "", year: "", capacity: "", driver_id: "", route_id: "" })
      setShowVehicleForm(false)
      refetchVehicles()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create vehicle")
    }
  }

  const handleCreateRoute = async () => {
    if (!routeFormData.name || !routeFormData.start_location || !routeFormData.end_location) {
      toast.error("Please fill in required fields")
      return
    }

    try {
      await createRoute.mutateAsync({
        name: routeFormData.name,
        start_location: routeFormData.start_location,
        end_location: routeFormData.end_location,
        distance: routeFormData.distance ? parseFloat(routeFormData.distance) : undefined,
        estimated_time: routeFormData.estimated_time || undefined,
        fare: routeFormData.fare ? parseFloat(routeFormData.fare) : undefined,
      })
      toast.success("Route created successfully")
      setRouteFormData({ name: "", start_location: "", end_location: "", distance: "", estimated_time: "", fare: "" })
      setShowRouteForm(false)
      refetchRoutes()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create route")
    }
  }

  const handleCreateDriver = async () => {
    if (!driverFormData.name || !driverFormData.license_number || !driverFormData.phone) {
      toast.error("Please fill in required fields")
      return
    }

    try {
      await createDriver.mutateAsync({
        name: driverFormData.name,
        license_number: driverFormData.license_number,
        phone: driverFormData.phone,
        email: driverFormData.email || undefined,
      })
      toast.success("Driver created successfully")
      setDriverFormData({ name: "", license_number: "", phone: "", email: "" })
      setShowDriverForm(false)
      refetchDrivers()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create driver")
    }
  }

  const handleEditVehicle = (vehicle: any) => {
    setVehicleFormData({
      registration_number: vehicle.registration_number || "",
      make: vehicle.make || "",
      model: vehicle.model || "",
      year: vehicle.year?.toString() || "",
      capacity: vehicle.capacity?.toString() || "",
      driver_id: vehicle.driver_id?.toString() || "",
      route_id: vehicle.route_id?.toString() || "",
    })
    setEditingId(vehicle.id)
    setShowVehicleForm(true)
  }

  const handleUpdateVehicle = async () => {
    if (!editingId) return

    try {
      await updateVehicle.mutateAsync({
        id: editingId,
        data: {
          registration_number: vehicleFormData.registration_number,
          make: vehicleFormData.make,
          model: vehicleFormData.model,
          year: vehicleFormData.year ? parseInt(vehicleFormData.year) : undefined,
          capacity: parseInt(vehicleFormData.capacity),
          driver_id: vehicleFormData.driver_id ? parseInt(vehicleFormData.driver_id) : undefined,
          route_id: vehicleFormData.route_id ? parseInt(vehicleFormData.route_id) : undefined,
        },
      })
      toast.success("Vehicle updated successfully")
      setVehicleFormData({ registration_number: "", make: "", model: "", year: "", capacity: "", driver_id: "", route_id: "" })
      setEditingId(null)
      setShowVehicleForm(false)
      refetchVehicles()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update vehicle")
    }
  }

  const handleDeleteVehicle = async (id: number) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return

    try {
      await deleteVehicle.mutateAsync(id)
      toast.success("Vehicle deleted successfully")
      refetchVehicles()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete vehicle")
    }
  }

  const handleDeleteRoute = async (id: number) => {
    if (!confirm("Are you sure you want to delete this route?")) return

    try {
      await deleteRoute.mutateAsync(id)
      toast.success("Route deleted successfully")
      refetchRoutes()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete route")
    }
  }

  const handleDeleteDriver = async (id: number) => {
    if (!confirm("Are you sure you want to delete this driver?")) return

    try {
      await deleteDriver.mutateAsync(id)
      toast.success("Driver deleted successfully")
      refetchDrivers()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete driver")
    }
  }

  const stats = {
    totalBuses: vehicles.length,
    activeBuses: vehicles.filter((v: any) => v.status === "active").length,
    totalRoutes: routes.length,
    activeRoutes: routes.filter((r: any) => r.status === "active").length,
    totalDrivers: drivers.length,
    activeDrivers: drivers.filter((d: any) => d.status === "active").length,
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transport Management</h1>
          <p className="text-muted-foreground">Manage school buses, routes, and transportation</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <Bus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBuses}</div>
            <p className="text-xs text-muted-foreground">{stats.activeBuses} active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Routes</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRoutes}</div>
            <p className="text-xs text-muted-foreground">{stats.activeRoutes} active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drivers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDrivers}</div>
            <p className="text-xs text-muted-foreground">{stats.activeDrivers} active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Using transport</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
        <TabsList>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
        </TabsList>

        {/* Vehicles Tab */}
        <TabsContent value="vehicles" className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setShowVehicleForm(true)
                setEditingId(null)
                setVehicleFormData({ registration_number: "", make: "", model: "", year: "", capacity: "", driver_id: "", route_id: "" })
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Vehicle
            </Button>
          </div>

          {showVehicleForm && (
      <Card>
        <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{editingId ? "Edit Vehicle" : "Add New Vehicle"}</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowVehicleForm(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
        </CardHeader>
        <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Registration Number *</Label>
                    <Input
                      value={vehicleFormData.registration_number}
                      onChange={(e) => setVehicleFormData({ ...vehicleFormData, registration_number: e.target.value })}
                      placeholder="e.g., BUS-001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Make *</Label>
                    <Input
                      value={vehicleFormData.make}
                      onChange={(e) => setVehicleFormData({ ...vehicleFormData, make: e.target.value })}
                      placeholder="e.g., Toyota"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Model *</Label>
                    <Input
                      value={vehicleFormData.model}
                      onChange={(e) => setVehicleFormData({ ...vehicleFormData, model: e.target.value })}
                      placeholder="e.g., Coaster"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Input
                      type="number"
                      value={vehicleFormData.year}
                      onChange={(e) => setVehicleFormData({ ...vehicleFormData, year: e.target.value })}
                      placeholder="2020"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Capacity *</Label>
                    <Input
                      type="number"
                      value={vehicleFormData.capacity}
                      onChange={(e) => setVehicleFormData({ ...vehicleFormData, capacity: e.target.value })}
                      placeholder="50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Driver</Label>
                    <Select 
                      value={vehicleFormData.driver_id || undefined} 
                      onValueChange={(value) => setVehicleFormData({ ...vehicleFormData, driver_id: value === "none" ? "" : value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a driver" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {drivers.map((driver: any) => (
                          <SelectItem key={driver.id} value={driver.id.toString()}>
                            {driver.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Route</Label>
                    <Select 
                      value={vehicleFormData.route_id || undefined} 
                      onValueChange={(value) => setVehicleFormData({ ...vehicleFormData, route_id: value === "none" ? "" : value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a route" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {routes.map((route: any) => (
                          <SelectItem key={route.id} value={route.id.toString()}>
                            {route.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={editingId ? handleUpdateVehicle : handleCreateVehicle}>
                    {createVehicle.isPending || updateVehicle.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>{editingId ? "Update" : "Create"} Vehicle</>
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setShowVehicleForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Vehicles List */}
          <div className="space-y-4">
            {vehicles.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground py-8">No vehicles found</p>
                </CardContent>
              </Card>
            ) : (
              vehicles.map((vehicle: any) => (
                <Card key={vehicle.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Bus className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                          <CardTitle>{vehicle.registration_number}</CardTitle>
                          <CardDescription>{vehicle.make} {vehicle.model} {vehicle.year ? `(${vehicle.year})` : ""}</CardDescription>
                        </div>
                      </div>
                      <Badge variant={vehicle.status === "active" ? "default" : "secondary"}>{vehicle.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Capacity</p>
                        <p className="font-medium">{vehicle.capacity} seats</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Driver</p>
                        <p className="font-medium">{drivers.find((d: any) => d.id === vehicle.driver_id)?.name || "Not assigned"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Route</p>
                        <p className="font-medium">{routes.find((r: any) => r.id === vehicle.route_id)?.name || "Not assigned"}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" onClick={() => handleEditVehicle(vehicle)}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteVehicle(vehicle.id)}>
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Routes Tab */}
        <TabsContent value="routes" className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setShowRouteForm(true)
                setRouteFormData({ name: "", start_location: "", end_location: "", distance: "", estimated_time: "", fare: "" })
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Route
            </Button>
          </div>

          {showRouteForm && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Add New Route</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowRouteForm(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Route Name *</Label>
                    <Input
                      value={routeFormData.name}
                      onChange={(e) => setRouteFormData({ ...routeFormData, name: e.target.value })}
                      placeholder="e.g., Route 1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Start Location *</Label>
                    <Input
                      value={routeFormData.start_location}
                      onChange={(e) => setRouteFormData({ ...routeFormData, start_location: e.target.value })}
                      placeholder="e.g., Main Gate"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Location *</Label>
                    <Input
                      value={routeFormData.end_location}
                      onChange={(e) => setRouteFormData({ ...routeFormData, end_location: e.target.value })}
                      placeholder="e.g., City Center"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Distance (km)</Label>
                    <Input
                      type="number"
                      value={routeFormData.distance}
                      onChange={(e) => setRouteFormData({ ...routeFormData, distance: e.target.value })}
                      placeholder="10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Estimated Time</Label>
                    <Input
                      value={routeFormData.estimated_time}
                      onChange={(e) => setRouteFormData({ ...routeFormData, estimated_time: e.target.value })}
                      placeholder="30 minutes"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Fare</Label>
                    <Input
                      type="number"
                      value={routeFormData.fare}
                      onChange={(e) => setRouteFormData({ ...routeFormData, fare: e.target.value })}
                      placeholder="500"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleCreateRoute}>
                    {createRoute.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Route"
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setShowRouteForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Routes List */}
          <div className="space-y-4">
            {routes.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground py-8">No routes found</p>
                </CardContent>
              </Card>
            ) : (
              routes.map((route: any) => (
                <Card key={route.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 rounded-lg">
                          <MapPin className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <CardTitle>{route.name}</CardTitle>
                          <CardDescription>
                            {route.start_location} → {route.end_location}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant={route.status === "active" ? "default" : "secondary"}>{route.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      {route.distance && (
                        <div>
                          <p className="text-sm text-muted-foreground">Distance</p>
                          <p className="font-medium">{route.distance} km</p>
                        </div>
                      )}
                      {route.estimated_time && (
                        <div>
                          <p className="text-sm text-muted-foreground">Estimated Time</p>
                          <p className="font-medium">{route.estimated_time}</p>
                        </div>
                      )}
                      {route.fare && (
                        <div>
                          <p className="text-sm text-muted-foreground">Fare</p>
                          <p className="font-medium">${route.fare}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" onClick={() => handleDeleteRoute(route.id)}>
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Drivers Tab */}
        <TabsContent value="drivers" className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setShowDriverForm(true)
                setDriverFormData({ name: "", license_number: "", phone: "", email: "" })
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Driver
            </Button>
          </div>

          {showDriverForm && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Add New Driver</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowDriverForm(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Name *</Label>
                    <Input
                      value={driverFormData.name}
                      onChange={(e) => setDriverFormData({ ...driverFormData, name: e.target.value })}
                      placeholder="e.g., John Smith"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>License Number *</Label>
                    <Input
                      value={driverFormData.license_number}
                      onChange={(e) => setDriverFormData({ ...driverFormData, license_number: e.target.value })}
                      placeholder="DL123456"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone *</Label>
                    <Input
                      value={driverFormData.phone}
                      onChange={(e) => setDriverFormData({ ...driverFormData, phone: e.target.value })}
                      placeholder="+1234567890"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={driverFormData.email}
                      onChange={(e) => setDriverFormData({ ...driverFormData, email: e.target.value })}
                      placeholder="driver@email.com"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleCreateDriver}>
                    {createDriver.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Driver"
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setShowDriverForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Drivers List */}
          <div className="grid gap-6 md:grid-cols-2">
            {drivers.length === 0 ? (
              <Card className="md:col-span-2">
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground py-8">No drivers found</p>
                </CardContent>
              </Card>
            ) : (
              drivers.map((driver: any) => (
                <Card key={driver.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{driver.name}</CardTitle>
                      <Badge variant={driver.status === "active" ? "default" : "secondary"}>{driver.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">License:</span>
                        <span className="font-medium">{driver.license_number}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Phone:</span>
                        <span className="font-medium">{driver.phone}</span>
                      </div>
                      {driver.email && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Email:</span>
                          <span className="font-medium">{driver.email}</span>
                        </div>
                      )}
              </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" onClick={() => handleDeleteDriver(driver.id)}>
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
          </div>
        </CardContent>
      </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
