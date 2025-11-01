"use client"

import React, { useState, useEffect } from 'react'
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
    { icon: Baby, name: 'Pre-School', age: '2-4 years', color: 'from-pink-500 to-rose-500' },
    { icon: Heart, name: 'Creche/Nursery', age: '3-5 years', color: 'from-purple-500 to-pink-500' },
    { icon: School, name: 'Primary School', age: '5-11 years', color: 'from-blue-500 to-cyan-500' },
    { icon: GraduationCap, name: 'Secondary School', age: '11-18 years', color: 'from-green-500 to-emerald-500' },
  ]

  const features = [
    {
      icon: Users,
      title: 'Student Management',
      description: 'Track enrollment, attendance, and academic progress seamlessly',
      gradient: 'from-violet-600 to-indigo-600',
    },
    {
      icon: BookOpen,
      title: 'Digital Curriculum',
      description: 'Manage lessons, assignments, and learning resources online',
      gradient: 'from-blue-600 to-cyan-600',
    },
    {
      icon: DollarSign,
      title: 'Fee Management',
      description: 'Automated billing, payment tracking, and financial reports',
      gradient: 'from-emerald-600 to-green-600',
    },
    {
      icon: Bell,
      title: 'Parent Communication',
      description: 'Real-time updates on student progress and school events',
      gradient: 'from-amber-600 to-orange-600',
    },
    {
      icon: Calendar,
      title: 'Smart Timetables',
      description: 'Automated scheduling with conflict detection',
      gradient: 'from-pink-600 to-rose-600',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Data-driven insights for better decision making',
      gradient: 'from-purple-600 to-violet-600',
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

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'bg-white/95 backdrop-blur-xl shadow-lg py-4' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
                <div className="relative w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Compasse
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-purple-600 font-medium transition">Features</a>
              <a href="#testimonials" className="text-gray-700 hover:text-purple-600 font-medium transition">Testimonials</a>
              <a href="#pricing" className="text-gray-700 hover:text-purple-600 font-medium transition">Pricing</a>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transition-all duration-300 hover:scale-105">
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
              <a href="#features" className="block py-2 text-gray-700">Features</a>
              <a href="#testimonials" className="block py-2 text-gray-700">Testimonials</a>
              <a href="#pricing" className="block py-2 text-gray-700">Pricing</a>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white">
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
            <div className="text-center lg:text-left space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
                <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
                <span className="text-sm font-semibold text-purple-700">Trusted by 500+ African Schools</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="text-gray-900">Modern School</span>
                <br />
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent animate-gradient">
                  Management System
                </span>
              </h1>

              <p className="text-xl text-gray-600 max-w-lg">
                Complete solution for Pre-Schools, Creches, Primary & Secondary Schools across Africa. 
                Streamline operations, enhance learning, empower communities.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="outline" className="border-2 hover:border-purple-600 group">
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
                    <img key={i} src={img} alt="" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-gray-600">4.9/5 from 2000+ schools</span>
                </div>
              </div>
            </div>

            {/* Right - Hero Image */}
            <div className="relative animate-fade-in">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80"
                  alt="African students in classroom"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent"></div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-xl p-4 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold">100% Cloud Based</p>
                    <p className="text-sm text-gray-600">Access anywhere</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl p-4 animate-float animation-delay-2000">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Bank-Level Security</p>
                    <p className="text-sm text-gray-600">Data protected</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* School Levels Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
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
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${level.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <level.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{level.name}</h3>
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
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern Schools
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to run your school efficiently, all in one integrated platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-white overflow-hidden">
                <CardContent className="p-8">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl transition-all hover:scale-105">
              See All Features
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Interactive Stats */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
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
                <stat.icon className="w-12 h-12 mx-auto mb-4 opacity-80 group-hover:scale-110 transition-transform" />
                <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform">{stat.number}</div>
                <div className="text-lg font-semibold opacity-90">{stat.label}</div>
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
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
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
                          className="w-32 h-32 rounded-full mx-auto object-cover shadow-lg"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <div className="flex mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-xl text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                        <div>
                          <p className="font-bold text-gray-900">{testimonial.author}</p>
                          <p className="text-gray-600">{testimonial.role}</p>
                          <p className="text-sm text-purple-600 font-semibold">{testimonial.school}</p>
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
                      ? 'bg-purple-600 w-8' 
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
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
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
                gradient: 'from-gray-600 to-gray-700',
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
                gradient: 'from-purple-600 to-pink-600',
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
                gradient: 'from-indigo-600 to-blue-600',
              },
            ].map((plan, index) => (
              <Card key={index} className={`relative border-0 ${plan.highlight ? 'shadow-2xl scale-105' : 'shadow-lg'} hover:shadow-2xl transition-all`}>
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-full">
                    RECOMMENDED
                  </div>
                )}
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-2">{plan.description}</p>
                  <p className="text-sm text-purple-600 font-semibold mb-4">{plan.students}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
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
                  <Button className={`w-full bg-gradient-to-r ${plan.gradient} text-white hover:shadow-lg transition-all`}>
                    {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
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
              className="h-14 text-lg"
            />
            <Button type="submit" size="lg" className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl transition-all hover:scale-105">
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
              <Cloud className="w-5 h-5 text-blue-600" />
              <span>Cloud-Based</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Shield className="w-5 h-5 text-green-600" />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Smartphone className="w-5 h-5 text-purple-600" />
              <span>Mobile Ready</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="w-5 h-5 text-orange-600" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">Compasse</span>
              </div>
              <p className="text-gray-400">
                Empowering African schools with modern management solutions.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Demo</a></li>
                <li><a href="#" className="hover:text-white transition">Support</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  info@compasse.africa
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  +234 123 456 7890
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Lagos, Nigeria
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2025 Compasse Africa. All rights reserved.</p>
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