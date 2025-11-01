"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import {
  GraduationCap,
  Users,
  BookOpen,
  Calendar,
  BarChart3,
  Bell,
  DollarSign,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
  Star,
  Globe,
  Award,
  Baby,
  School,
  Sparkles,
  Heart,
  Play,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  TrendingUp,
  Clock,
  Smartphone,
  Cloud,
  Network,
} from 'lucide-react'

export function LandingPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    schoolName: '',
    schoolType: '',
    studentCount: '',
  })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const schoolLevels = [
    { icon: Baby, name: 'Pre-School', age: '2-4 years', color: 'from-orange-400 to-orange-600' },
    { icon: Heart, name: 'Creche/Nursery', age: '3-5 years', color: 'from-blue-400 to-blue-600' },
    { icon: School, name: 'Primary School', age: '5-11 years', color: 'from-orange-500 to-orange-700' },
    { icon: GraduationCap, name: 'Secondary School', age: '11-18 years', color: 'from-blue-700 to-blue-900' },
  ]

  const features = [
    {
      icon: Users,
      title: 'Student Management',
      description: 'Track enrollment, attendance, and academic progress seamlessly',
      gradient: 'from-blue-700 to-blue-900',
    },
    {
      icon: BookOpen,
      title: 'Digital Curriculum',
      description: 'Manage lessons, assignments, and learning resources online',
      gradient: 'from-orange-500 to-orange-700',
    },
    {
      icon: DollarSign,
      title: 'Fee Management',
      description: 'Automated billing, payment tracking, and financial reports',
      gradient: 'from-blue-600 to-blue-800',
    },
    {
      icon: Bell,
      title: 'Parent Communication',
      description: 'Real-time updates on student progress and school events',
      gradient: 'from-orange-600 to-orange-800',
    },
    {
      icon: Calendar,
      title: 'Smart Timetables',
      description: 'Automated scheduling with conflict detection',
      gradient: 'from-blue-500 to-blue-700',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Data-driven insights for better decision making',
      gradient: 'from-orange-400 to-orange-600',
    },
  ]

  const testimonials = [
    {
      quote: "Compasse transformed our school operations. Parents love the real-time updates, and our administrative workload has reduced by 60%.",
      author: "Mrs. Adebayo Kemi",
      role: "Principal, Lagos Model School",
      school: "Primary & Secondary",
      image: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=400&q=80",
    },
    {
      quote: "The best investment for our nursery school. Managing toddlers' activities and parent communication has never been easier.",
      author: "Mr. Okonkwo David",
      role: "Director, Little Stars Nursery",
      school: "Pre-School & Creche",
      image: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400&q=80",
    },
    {
      quote: "Our teachers save hours weekly on administrative tasks. The system is intuitive and perfectly suited for African schools.",
      author: "Dr. Aisha Mohammed",
      role: "Administrator, Abuja Academy",
      school: "Secondary School",
      image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80",
    },
  ]

  // Navy blue (#003366) and Orange (#FFA500) color scheme
  const primaryBlue = '#003366'
  const primaryOrange = '#FFA500'

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'bg-white/95 backdrop-blur-xl shadow-lg py-4' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Image
                src="/logo.jpg"
                alt="Compasse Network Limited"
                width={180}
                height={60}
                className="object-contain"
                priority
              />
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-[#003366] font-semibold transition">Features</a>
              <a href="#testimonials" className="text-gray-700 hover:text-[#003366] font-semibold transition">Testimonials</a>
              <a href="#pricing" className="text-gray-700 hover:text-[#003366] font-semibold transition">Pricing</a>
              <Button className="bg-[#FFA500] hover:bg-[#FF8C00] text-white font-bold hover:shadow-lg transition-all duration-300 hover:scale-105">
                Get Started Free
              </Button>
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block py-2 text-gray-700 font-semibold">Features</a>
              <a href="#testimonials" className="block py-2 text-gray-700 font-semibold">Testimonials</a>
              <a href="#pricing" className="block py-2 text-gray-700 font-semibold">Pricing</a>
              <Button className="w-full bg-[#FFA500] hover:bg-[#FF8C00] text-white font-bold">
                Get Started Free
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 pb-20 px-4">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-full">
                <Network className="w-4 h-4 text-[#FFA500] animate-pulse" />
                <span className="text-sm font-semibold text-[#003366]">Trusted by 500+ African Schools</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="text-[#003366]">Modern School</span>
                <br />
                <span className="bg-gradient-to-r from-[#FFA500] to-[#FF8C00] bg-clip-text text-transparent animate-gradient">
                  Management System
                </span>
            </h1>

              <p className="text-xl text-gray-600 max-w-lg">
                Complete solution for Pre-Schools, Creches, Primary & Secondary Schools across Africa. 
                Streamline operations, enhance learning, empower communities.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-[#FFA500] hover:bg-[#FF8C00] text-white font-bold hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white font-bold group">
                  <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-8 pt-8">
                <div className="flex -space-x-2">
                  {[
                    "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=80",
                    "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=100&q=80",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
                    "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=100&q=80",
                  ].map((img, i) => (
                    <img key={i} src={img} alt="" className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-md" />
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#FFA500] text-[#FFA500]" />
                    ))}
                  </div>
                  <span className="text-gray-600 font-medium">4.9/5 from 2000+ schools</span>
                </div>
              </div>
            </div>

            {/* Right - Hero Image */}
            <div className="relative animate-fade-in">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80"
                  alt="African students in classroom"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#003366]/20 to-transparent"></div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-xl p-4 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold text-[#003366]">100% Cloud Based</p>
                    <p className="text-sm text-gray-600">Access anywhere</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl p-4 animate-float animation-delay-2000">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-[#003366]" />
                  </div>
                  <div>
                    <p className="font-bold text-[#003366]">Bank-Level Security</p>
                    <p className="text-sm text-gray-600">Data protected</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* School Levels Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-blue-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#003366] mb-4">
              Built for Every Education Level
            </h2>
            <p className="text-xl text-gray-600">
              From early childhood to secondary education, we've got you covered
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {schoolLevels.map((level, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${level.color}`}></div>
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${level.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                    <level.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#003366] mb-2">{level.name}</h3>
                  <p className="text-gray-600">{level.age}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#003366] mb-4">
              Powerful Features for Modern Schools
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to run your school efficiently, all in one integrated platform
            </p>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 bg-white overflow-hidden">
                <CardContent className="p-8">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#003366] mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
            </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Button size="lg" className="bg-[#FFA500] hover:bg-[#FF8C00] text-white font-bold hover:shadow-xl transition-all hover:scale-105">
              See All Features
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
            </div>
            </div>
      </section>

      {/* Interactive Stats */}
      <section className="py-20 px-4 bg-[#003366] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#FFA500] rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
            </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: School, number: '500+', label: 'Schools', sublabel: 'Across Africa' },
              { icon: Users, number: '100K+', label: 'Students', sublabel: 'Active Daily' },
              { icon: Globe, number: '15+', label: 'Countries', sublabel: 'Coverage' },
              { icon: TrendingUp, number: '99.9%', label: 'Uptime', sublabel: 'Reliability' },
            ].map((stat, index) => (
              <div key={index} className="text-center group cursor-pointer">
                <stat.icon className="w-12 h-12 mx-auto mb-4 text-[#FFA500] group-hover:scale-110 transition-transform" />
                <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform">{stat.number}</div>
                <div className="text-lg font-semibold">{stat.label}</div>
                <div className="text-sm opacity-75">{stat.sublabel}</div>
            </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section id="testimonials" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#003366] mb-4">
              Trusted by School Leaders
            </h2>
            <p className="text-xl text-gray-600">
              See what educators across Africa are saying
            </p>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
              <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}>
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 p-12">
                    <div className="grid md:grid-cols-3 gap-8 items-center">
                      <div className="md:col-span-1">
                        <img 
                          src={testimonial.image}
                          alt={testimonial.author}
                          className="w-32 h-32 rounded-full mx-auto object-cover shadow-lg border-4 border-[#FFA500]"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <div className="flex mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-6 h-6 fill-[#FFA500] text-[#FFA500]" />
                          ))}
                        </div>
                        <p className="text-xl text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                        <div>
                          <p className="font-bold text-[#003366]">{testimonial.author}</p>
                          <p className="text-gray-600">{testimonial.role}</p>
                          <p className="text-sm text-[#FFA500] font-semibold">{testimonial.school}</p>
                        </div>
                      </div>
                    </div>
            </div>
                ))}
            </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    activeTestimonial === index 
                      ? 'bg-[#FFA500] w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#003366] mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the perfect plan for your school size
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Starter',
                price: '₦30,000',
                period: '/month',
                description: 'Perfect for small schools & nurseries',
                students: 'Up to 100 students',
                features: [
                  'Student & Staff Management',
                  'Basic Reports',
                  'Parent Portal',
                  'SMS Notifications',
                  'Email Support',
                ],
                highlight: false,
                color: '#003366',
              },
              {
                name: 'Professional',
                price: '₦75,000',
                period: '/month',
                description: 'Most popular for growing schools',
                students: 'Up to 500 students',
                features: [
                  'Everything in Starter',
                  'Advanced Analytics',
                  'Finance Management',
                  'Library System',
                  'Priority Support',
                  'Custom Branding',
                ],
                highlight: true,
                color: '#FFA500',
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                period: '',
                description: 'For large institutions',
                students: 'Unlimited students',
                features: [
                  'Everything in Professional',
                  'Multiple Campuses',
                  'API Access',
                  'Dedicated Support',
                  'Custom Features',
                  'On-premise Option',
                ],
                highlight: false,
                color: '#003366',
              },
            ].map((plan, index) => (
              <Card key={index} className={`relative border-2 ${plan.highlight ? 'border-[#FFA500] shadow-2xl scale-105' : 'border-gray-200 shadow-lg'} hover:shadow-2xl transition-all`}>
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#FFA500] text-white text-sm font-bold rounded-full">
                    RECOMMENDED
                  </div>
                )}
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-[#003366] mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-2">{plan.description}</p>
                  <p className="text-sm font-semibold mb-4" style={{ color: plan.color }}>{plan.students}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-[#003366]">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
            </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full font-bold ${
                    plan.highlight 
                      ? 'bg-[#FFA500] hover:bg-[#FF8C00] text-white' 
                      : 'bg-[#003366] hover:bg-[#002244] text-white'
                  } hover:shadow-lg transition-all`}>
                    {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#003366] mb-6">
            Ready to Transform Your School?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join hundreds of African schools already using Compasse
          </p>
          
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
            <Input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="h-14 text-lg border-2 border-gray-300 focus:border-[#FFA500]"
            />
            <Button type="submit" size="lg" className="w-full h-14 text-lg bg-[#FFA500] hover:bg-[#FF8C00] text-white font-bold hover:shadow-xl transition-all hover:scale-105">
              Start Your Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <p className="text-sm text-gray-500">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </form>

          {/* Additional Trust Indicators */}
          <div className="flex justify-center gap-8 mt-12 flex-wrap">
            <div className="flex items-center gap-2 text-gray-700">
              <Cloud className="w-5 h-5 text-[#003366]" />
              <span className="font-medium">Cloud-Based</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="font-medium">SSL Secured</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Smartphone className="w-5 h-5 text-[#FFA500]" />
              <span className="font-medium">Mobile Ready</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="w-5 h-5 text-[#003366]" />
              <span className="font-medium">24/7 Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#003366] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <Image
                src="/logo.jpg"
                alt="Compasse Network Limited"
                width={150}
                height={50}
                className="mb-6 brightness-0 invert"
              />
              <p className="text-gray-300">
                Empowering African schools with modern management solutions.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4 text-[#FFA500]">Product</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-[#FFA500] transition">Features</a></li>
                <li><a href="#" className="hover:text-[#FFA500] transition">Pricing</a></li>
                <li><a href="#" className="hover:text-[#FFA500] transition">Demo</a></li>
                <li><a href="#" className="hover:text-[#FFA500] transition">Support</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4 text-[#FFA500]">Company</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-[#FFA500] transition">About Us</a></li>
                <li><a href="#" className="hover:text-[#FFA500] transition">Blog</a></li>
                <li><a href="#" className="hover:text-[#FFA500] transition">Careers</a></li>
                <li><a href="#" className="hover:text-[#FFA500] transition">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4 text-[#FFA500]">Contact</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#FFA500]" />
                  info@compasse.africa
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#FFA500]" />
                  +234 123 456 7890
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#FFA500]" />
                  Lagos, Nigeria
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>© 2025 Compasse Network Limited. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* CSS for Animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 5s ease infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-in;
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}