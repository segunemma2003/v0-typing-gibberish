"use client"

import React, { useState, useEffect } from 'react'
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
  UsersRound,
  Monitor,
  FileCheck,
  Sparkles,
  CheckCircle2,
  Send,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Star,
  Shield,
  Zap,
  TrendingUp,
  Menu,
  X,
  ArrowDown,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
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
      color: 'from-emerald-500 to-teal-600',
    },
    {
      icon: UserCheck,
      title: 'Teacher Management',
      description: 'Manage teacher profiles, assignments, schedules, and performance tracking.',
      color: 'from-blue-500 to-cyan-600',
    },
    {
      icon: Users,
      title: 'Staff Management',
      description: 'Complete staff directory, roles, permissions, and administrative tools.',
      color: 'from-indigo-500 to-purple-600',
    },
    {
      icon: BookOpen,
      title: 'Class & Subjects',
      description: 'Organize classes, subjects, curriculum mapping, and academic structures.',
      color: 'from-violet-500 to-fuchsia-600',
    },
    {
      icon: Calendar,
      title: 'Timetable',
      description: 'Create and manage class schedules, teacher assignments, and room allocations.',
      color: 'from-rose-500 to-pink-600',
    },
    {
      icon: BarChart3,
      title: 'Reports & Analytics',
      description: 'Generate comprehensive reports, analytics dashboards, and performance insights.',
      color: 'from-orange-500 to-red-600',
    },
    {
      icon: Bell,
      title: 'Announcements',
      description: 'Broadcast school-wide announcements and important updates instantly.',
      color: 'from-amber-500 to-yellow-600',
    },
    {
      icon: DollarSign,
      title: 'Finance Management',
      description: 'Fee collection, payment tracking, fee structures, student accounts, and financial reporting.',
      color: 'from-green-500 to-emerald-600',
    },
    {
      icon: Library,
      title: 'Library System',
      description: 'Digital catalog, book borrowing, digital resources, and library statistics.',
      color: 'from-sky-500 to-blue-600',
    },
    {
      icon: FileText,
      title: 'Quiz & Assessment',
      description: 'Create and manage quizzes, conduct CBT exams, and track assessment results.',
      color: 'from-purple-500 to-indigo-600',
    },
    {
      icon: MessageSquare,
      title: 'Communication',
      description: 'Messaging system for teachers, students, and parents with notification management.',
      color: 'from-cyan-500 to-blue-600',
    },
    {
      icon: Bus,
      title: 'Transport',
      description: 'Fleet management, route planning, student transport tracking, and driver assignments.',
      color: 'from-lime-500 to-green-600',
    },
    {
      icon: Building,
      title: 'House System',
      description: 'Manage house competitions, points tracking, member assignments, and inter-house activities.',
      color: 'from-pink-500 to-rose-600',
    },
    {
      icon: Trophy,
      title: 'Sports',
      description: 'Organize sports activities, track competitions, manage teams, and record achievements.',
      color: 'from-yellow-500 to-orange-600',
    },
    {
      icon: Package,
      title: 'Inventory',
      description: 'Track school assets, supplies, equipment, and manage inventory efficiently.',
      color: 'from-gray-500 to-slate-600',
    },
    {
      icon: UsersRound,
      title: 'Parent Portal',
      description: 'View children\'s progress, assignments, attendance, events, payments, and communicate with teachers.',
      color: 'from-emerald-600 to-teal-700',
    },
    {
      icon: Monitor,
      title: 'Student Portal',
      description: 'Access courses, assignments, grades, schedule, attendance, achievements, and messages.',
      color: 'from-blue-600 to-indigo-700',
    },
    {
      icon: FileCheck,
      title: 'Teacher Portal',
      description: 'Manage classes, assignments, attendance, grades, schedule, students, and communications.',
      color: 'from-purple-600 to-violet-700',
    },
  ]

  const benefits = [
    { icon: Shield, text: 'Bank-level security & data protection', color: 'from-emerald-400 to-teal-500' },
    { icon: Zap, text: 'Lightning-fast performance', color: 'from-yellow-400 to-orange-500' },
    { icon: TrendingUp, text: 'Real-time analytics & insights', color: 'from-blue-400 to-cyan-500' },
    { icon: Sparkles, text: 'Modern, intuitive interface', color: 'from-purple-400 to-pink-500' },
    { icon: Users, text: 'Scalable for any school size', color: 'from-indigo-400 to-blue-500' },
    { icon: Phone, text: '24/7 dedicated support', color: 'from-green-400 to-emerald-500' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur-md opacity-30"></div>
                <Image
                  src="/logo.jpg"
                  alt="Compasse Logo"
                  width={45}
                  height={45}
                  className="relative rounded-xl object-contain"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Compasse
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium text-sm relative group">
                Features
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium text-sm relative group">
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <Button 
                asChild 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <a href="#quotation">Get Quote</a>
              </Button>
            </div>
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#contact" className="block text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setMobileMenuOpen(false)}>Contact</a>
              <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">
                <a href="#quotation" onClick={() => setMobileMenuOpen(false)}>Get Quote</a>
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        {/* Background Image */}
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80"
            alt="Education background"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="relative max-w-7xl mx-auto text-center space-y-12 z-10">
          {/* Logo with glass effect */}
          <div className="flex justify-center mb-8 animate-fade-in-up">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative backdrop-blur-xl bg-white/40 rounded-3xl p-4 shadow-2xl border border-white/20">
                <Image
                  src="/logo.jpg"
                  alt="Compasse Logo"
                  width={160}
                  height={160}
                  className="rounded-2xl object-contain"
                />
              </div>
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-6 animate-fade-in-up animation-delay-200">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight">
              <span className="block text-gray-900 leading-tight">Transform Your</span>
              <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                School Management
              </span>
              <span className="block text-gray-900 leading-tight">Experience</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
              All-in-one platform designed for African schools. Streamline operations, enhance learning, 
              and empower your community with cutting-edge technology.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 animate-fade-in-up animation-delay-400">
            <Button
              size="lg"
              className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg px-10 py-8 rounded-2xl shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 font-bold"
              asChild
            >
              <a href="#quotation" className="flex items-center gap-3">
                Get Free Quote
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="group backdrop-blur-xl bg-white/60 border-2 border-gray-200 hover:border-blue-300 text-lg px-10 py-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 font-bold"
              asChild
            >
              <a href="#features" className="flex items-center gap-3">
                Explore Features
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              </a>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-16 flex flex-wrap justify-center items-center gap-8 text-sm animate-fade-in-up animation-delay-600">
            {[
              { icon: CheckCircle2, text: 'Trusted by 500+ Schools', color: 'text-emerald-500' },
              { icon: Shield, text: 'Bank-Level Security', color: 'text-blue-500' },
              { icon: Star, text: '4.9/5 Rating', color: 'text-yellow-500' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-gray-600 group hover:scale-110 transition-transform duration-300">
                <item.icon className={`w-5 h-5 ${item.color} group-hover:scale-125 transition-transform duration-300`} />
                <span className="font-medium">{item.text}</span>
              </div>
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className="pt-12 animate-bounce">
            <a href="#features" className="flex flex-col items-center gap-2 text-gray-400 hover:text-blue-600 transition-colors">
              <span className="text-sm font-medium">Scroll to explore</span>
              <ArrowDown className="w-6 h-6" />
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/50 to-transparent"></div>
        <div className="absolute inset-0 opacity-5">
          <Image
            src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1920&q=80"
            alt="School building"
            fill
            className="object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20 space-y-6">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 backdrop-blur-xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-200/50 text-blue-700 rounded-full text-sm font-bold shadow-lg">
              <Sparkles className="w-4 h-4" />
              Comprehensive Platform
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900">
              Everything Your School Needs
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A complete suite of tools designed to manage every aspect of school operations seamlessly
            </p>
          </div>

          {/* Feature Showcase Image */}
          <div className="mb-16 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl bg-white/70 border border-white/20">
            <div className="relative h-64 md:h-96">
              <Image
                src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1920&q=80"
                alt="School management dashboard"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group relative border-0 backdrop-blur-xl bg-white/70 hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                <CardHeader className="relative z-10">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900"></div>
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1920&q=80"
            alt="Students learning"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwIDMuMzE0LTIuNjg2IDYtNiA2cy02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiA2IDIuNjg2IDYgNnoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvZz48L3N2Zz4=')] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto z-10">
          <div className="text-center mb-20 space-y-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white">
              Why Schools Choose Compasse
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Built specifically for African schools with excellence in mind
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group backdrop-blur-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl p-6 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <p className="text-lg font-semibold text-white">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section with Images */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-white to-gray-50">
        <div className="absolute inset-0 opacity-5">
          <Image
            src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1920&q=80"
            alt="Classroom"
            fill
            className="object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Image Gallery */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 rounded-2xl overflow-hidden">
            <div className="relative h-48 md:h-64 group overflow-hidden rounded-xl">
              <Image
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80"
                alt="Students in classroom"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="relative h-48 md:h-64 group overflow-hidden rounded-xl">
              <Image
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80"
                alt="Teacher teaching"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="relative h-48 md:h-64 group overflow-hidden rounded-xl">
              <Image
                src="https://images.unsplash.com/photo-1529390079861-9deac712f043?w=800&q=80"
                alt="School library"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="relative h-48 md:h-64 group overflow-hidden rounded-xl">
              <Image
                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80"
                alt="School campus"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { number: '500+', label: 'Schools', sublabel: 'Trusted Partner', color: 'from-emerald-500 to-teal-600' },
              { number: '100K+', label: 'Active Users', sublabel: 'Daily Active', color: 'from-blue-500 to-cyan-600' },
              { number: '10+', label: 'Countries', sublabel: 'Across Africa', color: 'from-indigo-500 to-purple-600' },
              { number: '24/7', label: 'Support', sublabel: 'Always Available', color: 'from-purple-500 to-pink-600' },
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className={`text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-500 inline-block`}>
                  {stat.number}
                </div>
                <div className="text-gray-900 font-bold text-lg md:text-xl mb-1">{stat.label}</div>
                <div className="text-gray-500 text-sm">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quotation Form Section */}
      <section id="quotation" className="py-32 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-50/50 to-transparent"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16 space-y-6">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 backdrop-blur-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-200/50 text-emerald-700 rounded-full text-sm font-bold shadow-lg">
              <Mail className="w-4 h-4" />
              Get Your Custom Quote
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900">
              Request Your Quotation
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tell us about your school and we'll prepare a personalized quote tailored to your needs
            </p>
          </div>

          {/* Feature Preview Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="relative h-64 rounded-2xl overflow-hidden shadow-xl group">
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80"
                alt="Collaborative learning"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h3 className="font-bold text-xl mb-2">Smart Learning</h3>
                  <p className="text-sm text-white/90">Technology-enhanced education</p>
                </div>
              </div>
            </div>
            <div className="relative h-64 rounded-2xl overflow-hidden shadow-xl group">
              <Image
                src="https://images.unsplash.com/photo-1543269664-7eef42226a21?w=800&q=80"
                alt="Digital transformation"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h3 className="font-bold text-xl mb-2">Digital Transformation</h3>
                  <p className="text-sm text-white/90">Modernize your school operations</p>
                </div>
              </div>
            </div>
          </div>

          <Card className="border-0 backdrop-blur-xl bg-white/80 shadow-2xl overflow-hidden">
            <CardContent className="p-8 md:p-12">
              {submitStatus === 'success' ? (
                <div className="text-center space-y-6 py-12">
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-scale-in">
                    <CheckCircle2 className="w-14 h-14 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">Request Submitted!</h3>
                  <p className="text-lg text-gray-600 max-w-md mx-auto">
                    We've received your request and will get back to you within 24 hours with a personalized quote.
                  </p>
                  <Button
                    onClick={() => setSubmitStatus('idle')}
                    variant="outline"
                    className="mt-4"
                  >
                    Submit Another Request
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-bold text-gray-700">
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
                        className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 backdrop-blur-sm bg-white/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-bold text-gray-700">
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
                        className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 backdrop-blur-sm bg-white/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="phone" className="block text-sm font-bold text-gray-700">
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
                        className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 backdrop-blur-sm bg-white/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="schoolName" className="block text-sm font-bold text-gray-700">
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
                        className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 backdrop-blur-sm bg-white/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="schoolType" className="block text-sm font-bold text-gray-700">
                        School Type *
                      </label>
                      <select
                        id="schoolType"
                        name="schoolType"
                        required
                        value={formData.schoolType}
                        onChange={handleChange}
                        className="w-full h-12 rounded-xl border border-gray-200 backdrop-blur-sm bg-white/50 px-4 py-2 text-base shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
                      >
                        <option value="">Select school type</option>
                        <option value="primary">Primary School</option>
                        <option value="secondary">Secondary School</option>
                        <option value="mixed">Mixed (Primary & Secondary)</option>
                        <option value="tertiary">Tertiary Institution</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="studentCount" className="block text-sm font-bold text-gray-700">
                        Number of Students
                      </label>
                      <Input
                        id="studentCount"
                        name="studentCount"
                        type="number"
                        value={formData.studentCount}
                        onChange={handleChange}
                        placeholder="500"
                        className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 backdrop-blur-sm bg-white/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-bold text-gray-700">
                      Additional Information
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your specific needs, requirements, or questions..."
                      rows={5}
                      className="resize-none rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 backdrop-blur-sm bg-white/50"
                    />
                  </div>

                  {submitStatus === 'error' && (
                    <div className="p-4 backdrop-blur-xl bg-red-50/80 border-2 border-red-200 rounded-xl text-red-700 font-medium">
                      There was an error submitting your request. Please try again or contact us directly.
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg py-7 rounded-2xl shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
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
      <section id="contact" className="py-32 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 opacity-5">
          <Image
            src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1920&q=80"
            alt="Office workspace"
            fill
            className="object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20 space-y-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600">
              Have questions? We're here to help you succeed
            </p>
          </div>

          {/* Team Image */}
          <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl mb-16 group">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80"
              alt="Our team"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent flex items-end p-12">
              <div className="text-white max-w-2xl">
                <h3 className="text-3xl md:text-4xl font-bold mb-4">Expert Support Team</h3>
                <p className="text-lg text-white/90">
                  Our dedicated team is ready to help you transform your school management experience
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Mail,
                title: 'Email Us',
                content: 'info@compasse.africa',
                link: 'mailto:info@compasse.africa',
                description: 'Send us an email anytime',
                color: 'from-blue-500 to-cyan-600',
              },
              {
                icon: Phone,
                title: 'Call Us',
                content: '+234 (0) 123 456 7890',
                link: 'tel:+2341234567890',
                description: 'Mon-Fri 9am-5pm WAT',
                color: 'from-emerald-500 to-teal-600',
              },
              {
                icon: MapPin,
                title: 'Visit Us',
                content: 'Lagos, Nigeria',
                link: '#',
                description: 'Schedule a meeting',
                color: 'from-purple-500 to-indigo-600',
              },
            ].map((contact, index) => (
              <Card key={index} className="text-center border-0 backdrop-blur-xl bg-white/70 hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
                <CardContent className="p-8">
                  <div className={`w-20 h-20 bg-gradient-to-br ${contact.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                    <contact.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{contact.title}</h3>
                  <p className="text-gray-500 mb-4 text-sm">{contact.description}</p>
                  <a
                    href={contact.link}
                    className="text-blue-600 hover:text-blue-700 font-bold text-lg transition-colors inline-block group/link"
                  >
                    {contact.content}
                    <ArrowRight className="w-4 h-4 inline-block ml-2 group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
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
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#contact" className="hover:text-white transition-colors">Contact Us</a>
            </div>
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Compasse Africa. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
