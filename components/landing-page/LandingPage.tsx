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
  Play,
  Globe,
  Award,
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

  // Using vibrant colors that typically appear in educational logos (orange, green, blue)
  const features = [
    {
      icon: GraduationCap,
      title: 'Student Management',
      description: 'Comprehensive student records, admissions, academic progress tracking.',
      gradient: 'from-orange-500 via-amber-500 to-yellow-500',
      bg: 'bg-orange-50',
    },
    {
      icon: UserCheck,
      title: 'Teacher Management',
      description: 'Manage teacher profiles, assignments, schedules, and performance.',
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      bg: 'bg-green-50',
    },
    {
      icon: Users,
      title: 'Staff Management',
      description: 'Complete staff directory, roles, permissions, and admin tools.',
      gradient: 'from-blue-500 via-cyan-500 to-sky-500',
      bg: 'bg-blue-50',
    },
    {
      icon: BookOpen,
      title: 'Class & Subjects',
      description: 'Organize classes, subjects, curriculum mapping seamlessly.',
      gradient: 'from-red-500 via-rose-500 to-pink-500',
      bg: 'bg-red-50',
    },
    {
      icon: Calendar,
      title: 'Timetable',
      description: 'Create and manage schedules, assignments, room allocations.',
      gradient: 'from-purple-500 via-violet-500 to-fuchsia-500',
      bg: 'bg-purple-50',
    },
    {
      icon: BarChart3,
      title: 'Reports & Analytics',
      description: 'Generate comprehensive reports and performance insights.',
      gradient: 'from-indigo-500 via-blue-500 to-cyan-500',
      bg: 'bg-indigo-50',
    },
    {
      icon: Bell,
      title: 'Announcements',
      description: 'Broadcast school-wide announcements instantly.',
      gradient: 'from-yellow-500 via-orange-500 to-red-500',
      bg: 'bg-yellow-50',
    },
    {
      icon: DollarSign,
      title: 'Finance Management',
      description: 'Fee collection, payment tracking, financial reporting.',
      gradient: 'from-emerald-500 via-green-500 to-lime-500',
      bg: 'bg-emerald-50',
    },
    {
      icon: Library,
      title: 'Library System',
      description: 'Digital catalog, book borrowing, digital resources.',
      gradient: 'from-teal-500 via-cyan-500 to-blue-500',
      bg: 'bg-teal-50',
    },
    {
      icon: FileText,
      title: 'Quiz & Assessment',
      description: 'Create quizzes, conduct CBT exams, track results.',
      gradient: 'from-pink-500 via-rose-500 to-red-500',
      bg: 'bg-pink-50',
    },
    {
      icon: MessageSquare,
      title: 'Communication',
      description: 'Messaging for teachers, students, and parents.',
      gradient: 'from-sky-500 via-blue-500 to-indigo-500',
      bg: 'bg-sky-50',
    },
    {
      icon: Bus,
      title: 'Transport',
      description: 'Fleet management, route planning, tracking.',
      gradient: 'from-amber-500 via-orange-500 to-red-500',
      bg: 'bg-amber-50',
    },
    {
      icon: Building,
      title: 'House System',
      description: 'Manage competitions, points, member assignments.',
      gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
      bg: 'bg-violet-50',
    },
    {
      icon: Trophy,
      title: 'Sports',
      description: 'Organize activities, track competitions, teams.',
      gradient: 'from-orange-500 via-amber-500 to-yellow-500',
      bg: 'bg-orange-50',
    },
    {
      icon: Package,
      title: 'Inventory',
      description: 'Track assets, supplies, equipment.',
      gradient: 'from-slate-500 via-gray-500 to-zinc-500',
      bg: 'bg-slate-50',
    },
    {
      icon: UsersRound,
      title: 'Parent Portal',
      description: 'View children\'s progress, assignments, payments.',
      gradient: 'from-green-600 via-emerald-600 to-teal-600',
      bg: 'bg-green-50',
    },
    {
      icon: Monitor,
      title: 'Student Portal',
      description: 'Access courses, grades, schedule, achievements.',
      gradient: 'from-blue-600 via-cyan-600 to-sky-600',
      bg: 'bg-blue-50',
    },
    {
      icon: FileCheck,
      title: 'Teacher Portal',
      description: 'Manage classes, assignments, grades, students.',
      gradient: 'from-purple-600 via-indigo-600 to-blue-600',
      bg: 'bg-purple-50',
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-2xl shadow-2xl border-b border-gray-100/50' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <a href="#" className="flex items-center group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-blue-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <Image
                  src="/logo.jpg"
                  alt="Logo"
                  width={50}
                  height={50}
                  className="relative rounded-xl object-contain transition-transform group-hover:scale-110"
                />
              </div>
            </a>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-orange-600 transition-all duration-300 font-semibold text-sm relative group">
                Features
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#contact" className="text-gray-700 hover:text-orange-600 transition-all duration-300 font-semibold text-sm relative group">
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <Button 
                asChild 
                className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-white font-bold"
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
        
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-2xl border-t border-gray-200">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-gray-700 hover:text-orange-600 transition-colors font-semibold" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#contact" className="block text-gray-700 hover:text-orange-600 transition-colors font-semibold" onClick={() => setMobileMenuOpen(false)}>Contact</a>
              <Button asChild className="w-full bg-gradient-to-r from-orange-500 to-blue-500 text-white font-bold">
                <a href="#quotation" onClick={() => setMobileMenuOpen(false)}>Get Quote</a>
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - Split Layout */}
      <section className="relative min-h-screen flex items-center pt-20 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-orange-50 via-white to-blue-50">
        {/* Dynamic Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        {/* Background Image */}
        <div className="absolute inset-0 opacity-5">
          <Image
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80"
            alt="Education"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center z-10">
          {/* Left: Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-block">
              <div className="flex justify-center lg:justify-start mb-6">
                <div className="relative group">
                  <div className="absolute -inset-3 bg-gradient-to-r from-orange-500 to-blue-500 rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 animate-pulse"></div>
                  <div className="relative backdrop-blur-2xl bg-white/60 rounded-3xl p-6 shadow-2xl border-2 border-white/30">
                    <Image
                      src="/logo.jpg"
                      alt="Logo"
                      width={180}
                      height={180}
                      className="rounded-2xl object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight">
                <span className="block text-gray-900">Transform Your</span>
                <span className="block bg-gradient-to-r from-orange-600 via-amber-500 to-blue-600 bg-clip-text text-transparent">
                  School Management
                </span>
                <span className="block text-gray-900">Experience</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-xl lg:max-w-none leading-relaxed font-medium">
                All-in-one platform for African schools. Streamline operations, enhance learning, 
                and empower your community with cutting-edge technology.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                className="group bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 text-white text-lg px-10 py-8 rounded-2xl shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-105 font-bold"
                asChild
              >
                <a href="#quotation" className="flex items-center justify-center gap-3">
                  Get Free Quote
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="group backdrop-blur-xl bg-white/70 border-2 border-gray-300 hover:border-orange-400 text-lg px-10 py-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 font-bold"
                asChild
              >
                <a href="#features" className="flex items-center justify-center gap-3">
                  <Play className="w-5 h-5" />
                  Watch Demo
                </a>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 pt-8 text-sm">
              {[
                { icon: CheckCircle2, text: '500+ Schools', color: 'text-green-600' },
                { icon: Shield, text: 'Secure', color: 'text-blue-600' },
                { icon: Star, text: '4.9/5 Rating', color: 'text-orange-600' },
                { icon: Globe, text: '10+ Countries', color: 'text-purple-600' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-gray-700 group hover:scale-110 transition-transform duration-300">
                  <item.icon className={`w-5 h-5 ${item.color} group-hover:rotate-12 transition-transform duration-300`} />
                  <span className="font-semibold">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual Element */}
          <div className="relative hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-blue-500/20 rounded-3xl blur-3xl transform rotate-6"></div>
              <div className="relative backdrop-blur-2xl bg-white/40 rounded-3xl p-8 shadow-2xl border-2 border-white/30">
                <div className="relative h-96 rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80"
                    alt="Dashboard preview"
                    fill
                    className="object-cover rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <a href="#features" className="flex flex-col items-center gap-2 text-gray-400 hover:text-orange-600 transition-colors">
            <span className="text-sm font-semibold">Explore</span>
            <ArrowDown className="w-6 h-6" />
          </a>
        </div>
      </section>

      {/* Features Section - Dynamic Grid */}
      <section id="features" className="py-32 px-4 sm:px-6 lg:px-8 relative bg-white">
        {/* Subtle Background */}
        <div className="absolute inset-0 opacity-3">
          <Image
            src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1920&q=80"
            alt="School"
            fill
            className="object-cover"
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-20 space-y-6">
            <div className="inline-flex items-center gap-2 px-6 py-3 backdrop-blur-xl bg-gradient-to-r from-orange-100/80 to-blue-100/80 border border-orange-200/50 rounded-full text-orange-700 font-bold shadow-lg">
              <Sparkles className="w-5 h-5" />
              Comprehensive Platform
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900">
              Everything You Need
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-medium">
              A complete suite of tools to manage every aspect of your school
            </p>
          </div>

          {/* Hero Feature Showcase */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <div className="relative h-80 rounded-3xl overflow-hidden group shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80"
                alt="Collaborative learning"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent flex items-end p-8">
                <div className="text-white">
                  <h3 className="text-3xl font-black mb-3">Smart Learning</h3>
                  <p className="text-lg text-white/90">Technology-enhanced education platform</p>
                </div>
              </div>
            </div>
            <div className="relative h-80 rounded-3xl overflow-hidden group shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1543269664-7eef42226a21?w=800&q=80"
                alt="Digital transformation"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent flex items-end p-8">
                <div className="text-white">
                  <h3 className="text-3xl font-black mb-3">Digital Transformation</h3>
                  <p className="text-lg text-white/90">Modernize your school operations</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group relative border-0 backdrop-blur-xl bg-white/70 hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                <CardHeader className="relative z-10">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-xl`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-black text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-orange-600 group-hover:to-blue-600 transition-all duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <CardDescription className="text-gray-600 text-base leading-relaxed font-medium">
                    {feature.description}
                  </CardDescription>
                </CardContent>
                <div className={`absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section - Asymmetric Layout */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-orange-900/50 to-blue-900"></div>
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1920&q=80"
            alt="Students"
            fill
            className="object-cover"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 backdrop-blur-xl bg-white/10 border border-white/20 text-white rounded-full text-sm font-bold">
                <Award className="w-4 h-4" />
                Why Choose Us
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white">
                Built for Excellence
              </h2>
              <p className="text-xl text-blue-100 max-w-xl leading-relaxed">
                Designed specifically for African schools with world-class features and support
              </p>

              <div className="space-y-4 pt-8">
                {[
                  { icon: Shield, text: 'Bank-level security & data protection', gradient: 'from-green-400 to-emerald-500' },
                  { icon: Zap, text: 'Lightning-fast performance', gradient: 'from-yellow-400 to-orange-500' },
                  { icon: TrendingUp, text: 'Real-time analytics & insights', gradient: 'from-blue-400 to-cyan-500' },
                  { icon: Sparkles, text: 'Modern, intuitive interface', gradient: 'from-purple-400 to-pink-500' },
                  { icon: Users, text: 'Scalable for any school size', gradient: 'from-indigo-400 to-blue-500' },
                  { icon: Phone, text: '24/7 dedicated support', gradient: 'from-green-400 to-teal-500' },
                ].map((benefit, index) => (
                  <div
                    key={index}
                    className="group flex items-start space-x-4 p-5 backdrop-blur-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg`}>
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-lg font-bold text-white pt-2">{benefit.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Visual */}
            <div className="relative">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/30 to-blue-500/30 rounded-3xl blur-2xl"></div>
                <div className="relative backdrop-blur-2xl bg-white/10 rounded-3xl p-6 border border-white/20 shadow-2xl">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative h-48 rounded-xl overflow-hidden group">
                      <Image
                        src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80"
                        alt="Students"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="relative h-48 rounded-xl overflow-hidden group">
                      <Image
                        src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80"
                        alt="Teacher"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="relative h-48 rounded-xl overflow-hidden group">
                      <Image
                        src="https://images.unsplash.com/photo-1529390079861-9deac712f043?w=600&q=80"
                        alt="Library"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="relative h-48 rounded-xl overflow-hidden group">
                      <Image
                        src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80"
                        alt="Campus"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Dynamic */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-white via-orange-50/30 to-blue-50/30">
        <div className="absolute inset-0 opacity-3">
          <Image
            src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1920&q=80"
            alt="Classroom"
            fill
            className="object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { number: '500+', label: 'Schools', sublabel: 'Trusted', gradient: 'from-orange-500 to-amber-500' },
              { number: '100K+', label: 'Users', sublabel: 'Active', gradient: 'from-blue-500 to-cyan-500' },
              { number: '10+', label: 'Countries', sublabel: 'Africa', gradient: 'from-green-500 to-emerald-500' },
              { number: '24/7', label: 'Support', sublabel: 'Available', gradient: 'from-purple-500 to-indigo-500' },
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className={`text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-500 inline-block`}>
                  {stat.number}
                </div>
                <div className="text-gray-900 font-black text-xl md:text-2xl mb-1">{stat.label}</div>
                <div className="text-gray-600 text-sm font-semibold uppercase tracking-wide">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quotation Form - Split Layout */}
      <section id="quotation" className="py-32 px-4 sm:px-6 lg:px-8 relative bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left: Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-6 py-3 backdrop-blur-xl bg-gradient-to-r from-green-100/80 to-emerald-100/80 border border-green-200/50 rounded-full text-green-700 font-bold shadow-lg">
                <Mail className="w-5 h-5" />
                Get Your Quote
              </div>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-tight">
                Request Your
                <span className="block bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
                  Custom Quotation
                </span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed font-medium">
                Tell us about your school and we'll prepare a personalized quote tailored to your specific needs and requirements.
              </p>

              {/* Quick Benefits */}
              <div className="pt-8 space-y-4">
                {[
                  'Custom pricing based on your school size',
                  'Flexible payment plans available',
                  'No hidden fees or charges',
                  'Free setup and onboarding support',
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Form */}
            <Card className="border-0 backdrop-blur-xl bg-white/80 shadow-2xl overflow-hidden">
              <CardContent className="p-8 md:p-12">
                {submitStatus === 'success' ? (
                  <div className="text-center space-y-6 py-12">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-scale-in">
                      <CheckCircle2 className="w-14 h-14 text-white" />
                    </div>
                    <h3 className="text-3xl font-black text-gray-900">Request Submitted!</h3>
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
                        <label htmlFor="name" className="block text-sm font-black text-gray-700">
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
                          className="h-12 rounded-xl border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 backdrop-blur-sm bg-white/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-black text-gray-700">
                          Email *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          className="h-12 rounded-xl border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 backdrop-blur-sm bg-white/50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="phone" className="block text-sm font-black text-gray-700">
                          Phone *
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+234 123 456 7890"
                          className="h-12 rounded-xl border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 backdrop-blur-sm bg-white/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="schoolName" className="block text-sm font-black text-gray-700">
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
                          className="h-12 rounded-xl border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 backdrop-blur-sm bg-white/50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="schoolType" className="block text-sm font-black text-gray-700">
                          School Type *
                        </label>
                        <select
                          id="schoolType"
                          name="schoolType"
                          required
                          value={formData.schoolType}
                          onChange={handleChange}
                          className="w-full h-12 rounded-xl border border-gray-200 backdrop-blur-sm bg-white/50 px-4 py-2 text-base shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-colors"
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
                        <label htmlFor="studentCount" className="block text-sm font-black text-gray-700">
                          Number of Students
                        </label>
                        <Input
                          id="studentCount"
                          name="studentCount"
                          type="number"
                          value={formData.studentCount}
                          onChange={handleChange}
                          placeholder="500"
                          className="h-12 rounded-xl border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 backdrop-blur-sm bg-white/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="block text-sm font-black text-gray-700">
                        Additional Information
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about your specific needs, requirements, or questions..."
                        rows={5}
                        className="resize-none rounded-xl border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 backdrop-blur-sm bg-white/50"
                      />
                    </div>

                    {submitStatus === 'error' && (
                      <div className="p-4 backdrop-blur-xl bg-red-50/80 border-2 border-red-200 rounded-xl text-red-700 font-bold">
                        There was an error submitting your request. Please try again or contact us directly.
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      size="lg"
                      className="w-full bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 text-white text-lg py-7 rounded-2xl shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 font-black disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
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
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-gray-50 to-white">
        <div className="absolute inset-0 opacity-3">
          <Image
            src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1920&q=80"
            alt="Office"
            fill
            className="object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20 space-y-6">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900">
              Get in Touch
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 font-medium">
              Have questions? We're here to help you succeed
            </p>
          </div>

          {/* Team Hero */}
          <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl mb-16 group">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80"
              alt="Our team"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent flex items-end p-12">
              <div className="text-white max-w-3xl">
                <h3 className="text-4xl md:text-5xl font-black mb-4">Expert Support Team</h3>
                <p className="text-xl text-white/90 font-medium">
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
                gradient: 'from-blue-500 to-cyan-500',
              },
              {
                icon: Phone,
                title: 'Call Us',
                content: '+234 (0) 123 456 7890',
                link: 'tel:+2341234567890',
                description: 'Mon-Fri 9am-5pm WAT',
                gradient: 'from-green-500 to-emerald-500',
              },
              {
                icon: MapPin,
                title: 'Visit Us',
                content: 'Lagos, Nigeria',
                link: '#',
                description: 'Schedule a meeting',
                gradient: 'from-orange-500 to-amber-500',
              },
            ].map((contact, index) => (
              <Card key={index} className="text-center border-0 backdrop-blur-xl bg-white/70 hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
                <CardContent className="p-8">
                  <div className={`w-20 h-20 bg-gradient-to-br ${contact.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 shadow-xl`}>
                    <contact.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">{contact.title}</h3>
                  <p className="text-gray-500 mb-4 text-sm font-semibold">{contact.description}</p>
                  <a
                    href={contact.link}
                    className="text-orange-600 hover:text-blue-600 font-black text-lg transition-colors inline-block group/link"
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
            <a href="#" className="flex items-center group">
              <Image
                src="/logo.jpg"
                alt="Logo"
                width={40}
                height={40}
                className="rounded-lg object-contain transition-transform group-hover:scale-110"
              />
            </a>
            <div className="flex flex-wrap justify-center gap-8 text-sm font-semibold">
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
