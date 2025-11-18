"use client"

import { useMemo } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, Building2, Plus, Users } from "lucide-react"
import { useTenants } from "@/lib/api/tenants"

export default function SuperAdminDashboard() {
  const { data, isLoading, isError, error } = useTenants()

  const tenants = useMemo(() => data?.tenants ?? [], [data])

  const { totalTenants, totalSchools, totalUsers, activeTenants } = useMemo(() => {
    return tenants.reduce(
      (acc, tenant) => {
        acc.totalSchools += tenant.schools_count ?? 0
        acc.totalUsers += tenant.users_count ?? 0
        acc.activeTenants += (tenant.status ?? "").toLowerCase() === "active" ? 1 : 0
        return acc
      },
      {
        totalTenants: tenants.length,
        totalSchools: 0,
        totalUsers: 0,
        activeTenants: 0,
      },
    )
  }, [tenants])

  const topTenants = useMemo(() => tenants.slice(0, 6), [tenants])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage all schools and system-wide operations</p>
        </div>
        <Link href="/super-admin/schools/new">
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            <Plus className="w-4 h-4 mr-2" />
            Add School
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="py-10 text-center text-gray-500">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p>Loading tenant information...</p>
            </div>
          </CardContent>
        </Card>
      ) : isError ? (
        <Card>
          <CardContent className="py-10 text-center text-destructive">
            <p>Unable to load dashboard data.</p>
            <p className="text-sm text-gray-500 mt-2">{(error as Error)?.message ?? "Unexpected error"}</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTenants}</div>
                <p className="text-xs text-muted-foreground">Across the Compasse platform</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSchools}</div>
                <p className="text-xs text-muted-foreground">
                  Aggregated from tenant records
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Active accounts across all tenants</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Tenants</CardTitle>
                <AlertCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{activeTenants}</div>
                <p className="text-xs text-muted-foreground">Tenants currently marked as active</p>
              </CardContent>
            </Card>
          </div>

          {/* Schools Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Schools Overview</CardTitle>
              <CardDescription>Manage and monitor all registered schools</CardDescription>
            </CardHeader>
            <CardContent>
              {topTenants.length === 0 ? (
                <div className="py-10 text-center text-gray-500">
                  No tenants available yet. Start by adding a school.
                </div>
              ) : (
                <div className="space-y-4">
                  {topTenants.map((tenant) => {
                    const domain = tenant.domain ?? (tenant.subdomain ? `${tenant.subdomain}.compasse.net` : null)
                    const subdomain = tenant.subdomain ?? domain?.split(".")[0] ?? "n/a"
                    return (
                      <div key={tenant.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{tenant.name}</h3>
                            <p className="text-sm text-gray-600 truncate max-w-xs">{domain ?? "Domain not assigned"}</p>
                            <p className="text-xs text-gray-500">
                              Schools: {tenant.schools_count ?? 0} · Users: {tenant.users_count ?? 0}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant={(tenant.status ?? "").toLowerCase() === "active" ? "default" : "secondary"}>
                            {tenant.status ?? "unknown"}
                          </Badge>
                          {domain ? (
                            <Button asChild variant="outline" size="sm">
                              <Link href={`https://${domain}`} target="_blank" rel="noopener noreferrer">
                                Visit
                              </Link>
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" disabled>
                              No domain
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
