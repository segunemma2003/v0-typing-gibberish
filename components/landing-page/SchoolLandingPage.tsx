"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  GraduationCap,
  UserCheck,
  User,
  Users,
  BookOpen,
  ArrowRight,
  School,
  Shield,
  Globe,
  CheckCircle,
  Award,
  Calendar,
  BarChart3,
  Clock,
  Sparkles,
} from 'lucide-react'
import { useTenant } from '@/lib/tenant'
import Link from 'next/link'

const roleLinks = [
  {
    title: 'Administrator',
    description: 'Manage school operations and settings',
    href: '/admin',
    icon: Shield,
    color: 'from-blue-600 to-indigo-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
  },
  {
    title: 'Teacher',
    description: 'Access your classes, grades, and students',
    href: '/teacher',
    icon: UserCheck,
    color: 'from-green-600 to-emerald-600',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
  },
  {
    title: 'Student',
    description: 'View your courses, assignments, and grades',
    href: '/student',
    icon: GraduationCap,
    color: 'from-purple-600 to-violet-600',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
  },
  {
    title: 'Parent',
    description: 'Monitor your child\'s progress and activities',
    href: '/parent',
    icon: Users,
    color: 'from-orange-600 to-amber-600',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
  },
  {
    title: 'Librarian',
    description: 'Manage library resources and catalog',
    href: '/library',
    icon: BookOpen,
    color: 'from-teal-600 to-cyan-600',
    bgColor: 'bg-teal-50',
    textColor: 'text-teal-700',
  },
  {
    title: 'House Master',
    description: 'Oversee house activities and competitions',
    href: '/house',
    icon: Award,
    color: 'from-pink-600 to-rose-600',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-700',
  },
]

export function SchoolLandingPage() {
  const { currentTenant, subdomain, isLoading } = useTenant()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  const schoolName = currentTenant?.name || (subdomain ? `${subdomain.charAt(0).toUpperCase() + subdomain.slice(1)} School` : 'School')
  const displayName = currentTenant?.name || schoolName

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="relative z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <School className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{displayName}</h1>
                <p className="text-xs text-gray-600">School Portal</p>
              </div>
            </div>
            <Link href="/login">
              <Button variant="outline" className="backdrop-blur-xl bg-white/70 border-2">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-900">Welcome to {displayName}</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {displayName}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Access your personalized portal. Choose your role to get started.
            </p>
          </div>

          {/* Role Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {roleLinks.map((role, index) => (
              <Link key={index} href={role.href}>
                <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-gray-100 bg-white/80 backdrop-blur-xl overflow-hidden cursor-pointer">
                  <div className={`h-2 bg-gradient-to-r ${role.color}`}></div>
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                      <role.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {role.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {role.description}
                    </p>
                    <div className="flex items-center text-sm font-semibold text-blue-600 group-hover:translate-x-2 transition-transform">
                      Access Portal
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: GraduationCap, label: 'Students', value: '500+' },
              { icon: UserCheck, label: 'Teachers', value: '50+' },
              { icon: School, label: 'Active', value: '✓' },
              { icon: Award, label: 'Excellence', value: '99%' },
            ].map((stat, index) => (
              <Card key={index} className="text-center backdrop-blur-xl bg-white/60 border border-gray-200/50 p-6 hover:shadow-lg transition-shadow">
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </Card>
            ))}
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Calendar,
                title: 'Manage Schedule',
                description: 'View and manage your timetable and events',
              },
              {
                icon: BarChart3,
                title: 'Track Progress',
                description: 'Monitor academic performance and analytics',
              },
              {
                icon: Clock,
                title: 'Real-time Updates',
                description: 'Stay updated with instant notifications',
              },
            ].map((feature, index) => (
              <Card key={index} className="backdrop-blur-xl bg-white/60 border border-gray-200/50 p-6 hover:shadow-lg transition-all">
                <feature.icon className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/50 backdrop-blur-xl py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600">
            © {new Date().getFullYear()} {displayName}. Powered by{' '}
            <span className="font-semibold text-blue-600">Compasse</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Secure School Management System
          </p>
        </div>
      </footer>
    </div>
  )
}

