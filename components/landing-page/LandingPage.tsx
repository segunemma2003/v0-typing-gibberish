"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  GraduationCap,
  Users,
  UserCheck,
  BookOpen,
  Calendar,
  BarChart3,
  Bell,
  Bus,
  Building,
  Trophy,
  Package,
  DollarSign,
  Library,
  FileText,
  MessageSquare,
  Clock,
  Award,
  Camera,
  UsersRound,
  School,
  CreditCard,
  BookMarked,
  FolderOpen,
  Monitor,
  FileCheck,
  Navigation,
  Shield,
  Zap,
  Sparkles,
  CheckCircle2,
  Send,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react'

export function LandingPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    schoolName: '',
    schoolType: '',
    studentCount: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // TODO: Replace with actual API endpoint
      const response = await fetch('/api/quotation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({
          name: '',
          email: '',
          phone: '',
          schoolName: '',
          schoolType: '',
          studentCount: '',
          message: '',
        })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const features = [
    {
      icon: GraduationCap,
      title: 'Student Management',
      description: 'Comprehensive student records, admissions, academic progress tracking, and profile management.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: UserCheck,
      title: 'Teacher Management',
      description: 'Manage teacher profiles, assignments, schedules, and performance tracking.',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Users,
      title: 'Staff Management',
      description: 'Complete staff directory, roles, permissions, and administrative tools.',
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      icon: BookOpen,
      title: 'Class & Subject Management',
      description: 'Organize classes, subjects, curriculum mapping, and academic structures.',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Calendar,
      title: 'Timetable Management',
      description: 'Create and manage class schedules, teacher assignments, and room allocations.',
      color: 'from-orange-500 to-orange-600',
    },
    {
      icon: BarChart3,
      title: 'Reports & Analytics',
      description: 'Generate comprehensive reports, analytics dashboards, and performance insights.',
      color: 'from-red-500 to-red-600',
    },
    {
      icon: Bell,
      title: 'Announcements',
      description: 'Broadcast school-wide announcements and important updates instantly.',
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      icon: DollarSign,
      title: 'Finance Management',
      description: 'Fee collection, payment tracking, fee structures, student accounts, and financial reporting.',
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      icon: Library,
      title: 'Library Management',
      description: 'Digital catalog, book borrowing, digital resources, and library statistics.',
      color: 'from-teal-500 to-teal-600',
    },
    {
      icon: FileText,
      title: 'Quiz & Assessment',
      description: 'Create and manage quizzes, conduct CBT exams, and track assessment results.',
      color: 'from-pink-500 to-pink-600',
    },
    {
      icon: MessageSquare,
      title: 'Communication Hub',
      description: 'Messaging system for teachers, students, and parents with notification management.',
      color: 'from-cyan-500 to-cyan-600',
    },
    {
      icon: Bus,
      title: 'Transport Management',
      description: 'Fleet management, route planning, student transport tracking, and driver assignments.',
      color: 'from-amber-500 to-amber-600',
    },
    {
      icon: Building,
      title: 'House System',
      description: 'Manage house competitions, points tracking, member assignments, and inter-house activities.',
      color: 'from-violet-500 to-violet-600',
    },
    {
      icon: Trophy,
      title: 'Sports Management',
      description: 'Organize sports activities, track competitions, manage teams, and record achievements.',
      color: 'from-rose-500 to-rose-600',
    },
    {
      icon: Package,
      title: 'Inventory Management',
      description: 'Track school assets, supplies, equipment, and manage inventory efficiently.',
      color: 'from-slate-500 to-slate-600',
    },
    {
      icon: UsersRound,
      title: 'Parent Portal',
      description: 'View children\'s progress, assignments, attendance, events, payments, and communicate with teachers.',
      color: 'from-blue-600 to-blue-700',
    },
    {
      icon: Monitor,
      title: 'Student Portal',
      description: 'Access courses, assignments, grades, schedule, attendance, achievements, and messages.',
      color: 'from-green-600 to-green-700',
    },
    {
      icon: FileCheck,
      title: 'Teacher Portal',
      description: 'Manage classes, assignments, attendance, grades, schedule, students, and communications.',
      color: 'from-purple-600 to-purple-700',
    },
  ]

  const benefits = [
    'Cloud-based access from anywhere',
    'Multi-tenant architecture for security',
    'Mobile-responsive design',
    'Real-time updates and notifications',
    'Comprehensive reporting and analytics',
    '24/7 technical support',
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <Image
                src="/logo.jpg"
                alt="Compasse Logo"
                width={50}
                height={50}
                className="rounded-lg object-contain"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Compasse
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Features
              </a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Contact
              </a>
              <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <a href="#quotation">Request Quote</a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <Image
                  src="/logo.jpg"
                  alt="Compasse Logo"
                  width={120}
                  height={120}
                  className="rounded-2xl object-contain shadow-2xl ring-4 ring-white"
                />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white animate-pulse"></div>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight">
              Modern School Management
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Transform your school operations with Africa's leading all-in-one management platform.
              Streamline processes, enhance learning, and foster collaboration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                asChild
              >
                <a href="#quotation">Get Free Quote</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 rounded-full border-2 hover:bg-gray-50 transition-all"
                asChild
              >
                <a href="#features">Explore Features</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              Comprehensive Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Everything Your School Needs
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A complete suite of tools designed to manage every aspect of school operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group border-2 hover:border-blue-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 overflow-hidden"
              >
                <CardHeader>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Why Choose Compasse?
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Built for African schools, designed for excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all"
              >
                <CheckCircle2 className="w-6 h-6 text-green-300 flex-shrink-0 mt-1" />
                <p className="text-lg font-medium">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '500+', label: 'Schools' },
              { number: '100K+', label: 'Active Users' },
              { number: '10+', label: 'Countries' },
              { number: '24/7', label: 'Support' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-semibold text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quotation Form Section */}
      <section id="quotation" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
              <Mail className="w-4 h-4" />
              Get Your Quote
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Request a Custom Quotation
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tell us about your school and we'll prepare a personalized quote for you
            </p>
          </div>

          <Card className="border-2 shadow-2xl">
            <CardContent className="p-8 md:p-12">
              {submitStatus === 'success' ? (
                <div className="text-center space-y-6 py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">Request Submitted!</h3>
                  <p className="text-lg text-gray-600">
                    We've received your request and will get back to you within 24 hours.
                  </p>
                  <Button
                    onClick={() => setSubmitStatus('idle')}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    Submit Another Request
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Your Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+234 123 456 7890"
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label htmlFor="schoolName" className="block text-sm font-semibold text-gray-700 mb-2">
                        School Name *
                      </label>
                      <Input
                        id="schoolName"
                        name="schoolName"
                        type="text"
                        required
                        value={formData.schoolName}
                        onChange={handleChange}
                        placeholder="Your School Name"
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="schoolType" className="block text-sm font-semibold text-gray-700 mb-2">
                        School Type *
                      </label>
                      <select
                        id="schoolType"
                        name="schoolType"
                        required
                        value={formData.schoolType}
                        onChange={handleChange}
                        className="w-full h-12 rounded-md border border-gray-300 bg-white px-3 py-2 text-base shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                      >
                        <option value="">Select school type</option>
                        <option value="primary">Primary School</option>
                        <option value="secondary">Secondary School</option>
                        <option value="mixed">Mixed (Primary & Secondary)</option>
                        <option value="tertiary">Tertiary Institution</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="studentCount" className="block text-sm font-semibold text-gray-700 mb-2">
                        Number of Students
                      </label>
                      <Input
                        id="studentCount"
                        name="studentCount"
                        type="number"
                        value={formData.studentCount}
                        onChange={handleChange}
                        placeholder="500"
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                      Additional Information
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your specific needs, requirements, or questions..."
                      rows={5}
                      className="resize-none"
                    />
                  </div>

                  {submitStatus === 'error' && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                      There was an error submitting your request. Please try again or contact us directly.
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg py-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-5 h-5" />
                        Send Request
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600">
              Have questions? We're here to help
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Mail,
                title: 'Email',
                content: 'info@compasse.africa',
                link: 'mailto:info@compasse.africa',
              },
              {
                icon: Phone,
                title: 'Phone',
                content: '+234 (0) 123 456 7890',
                link: 'tel:+2341234567890',
              },
              {
                icon: MapPin,
                title: 'Location',
                content: 'Lagos, Nigeria',
                link: '#',
              },
            ].map((contact, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all border-2 hover:border-blue-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <contact.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{contact.title}</h3>
                  <a
                    href={contact.link}
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {contact.content}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <Image
                src="/logo.jpg"
                alt="Compasse Logo"
                width={40}
                height={40}
                className="rounded-lg object-contain"
              />
              <span className="text-xl font-bold text-white">Compasse</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#contact" className="hover:text-white transition-colors">Contact Us</a>
            </div>
            <p className="text-sm">&copy; {new Date().getFullYear()} Compasse Africa. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  )
}