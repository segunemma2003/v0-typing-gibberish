"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  GraduationCap,
  UserCheck,
  Users,
  BookOpen,
  ArrowRight,
  School,
  Shield,
  Globe2,
  CheckCircle,
  Award,
  Calendar,
  BarChart3,
  Clock,
  Sparkles,
  Building2,
  Home,
  ChevronRight,
  Target,
  TrendingUp,
  Heart,
  Zap,
  BookOpenCheck,
  Trophy,
  Mail,
  Phone,
  MapPin,
  Star,
  Lightbulb,
  Palette,
  Music,
  Dumbbell,
  Microscope,
  Globe,
  Library,
  Bus,
  Wifi,
  Monitor,
  ShieldCheck,
  UserPlus,
  FileText,
  ClipboardCheck,
  GraduationCap as Cap,
  Brain,
  Rocket,
  Play,
  Camera,
  Eye,
} from 'lucide-react'
import { useTenant } from '@/lib/tenant'
import Link from 'next/link'

// Add custom styles for animations
const customStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }
  
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  
  .animate-slideIn {
    animation: slideIn 0.6s ease-out;
  }
  
  .line-clamp-1 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
  
  .line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
`

// Professional school imagery - using high-quality educational institution photos
const schoolGallery = [
  {
    url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=80',
    title: 'Main Campus Building',
    category: 'Campus',
    description: 'Our historic main building featuring modern classrooms and administrative offices',
  },
  {
    url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80',
    title: 'University Hall',
    category: 'Academic',
    description: 'State-of-the-art lecture halls with advanced technology',
  },
  {
    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&q=80',
    title: 'Student Life',
    category: 'Students',
    description: 'Vibrant student community and collaborative learning',
  },
  {
    url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=80',
    title: 'Central Library',
    category: 'Library',
    description: 'Extensive collection with over 100,000 books and digital resources',
  },
  {
    url: 'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=1200&q=80',
    title: 'Sports Complex',
    category: 'Athletics',
    description: 'Olympic-standard sports facilities for all students',
  },
  {
    url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&q=80',
    title: 'Modern Classrooms',
    category: 'Facilities',
    description: 'Interactive learning spaces with smart boards and technology',
  },
]

// Featured facilities with stunning imagery
const featuredFacilities = [
  {
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    title: 'Science & Research Center',
    description: 'Advanced laboratories for physics, chemistry, and biology',
    features: ['30+ Lab Stations', '3D Microscopes', 'Research Equipment'],
  },
  {
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80',
    title: 'Digital Learning Hub',
    description: 'Technology-enabled learning with cutting-edge resources',
    features: ['200+ Computers', 'VR Lab', 'Coding Studios'],
  },
  {
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
    title: 'Student Residence',
    description: 'Comfortable boarding facilities with modern amenities',
    features: ['24/7 Security', 'Study Lounges', 'Recreation Areas'],
  },
]

// Campus life imagery
const campusLife = [
  {
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80',
    title: 'Collaborative Learning',
    icon: Users,
  },
  {
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
    title: 'Group Studies',
    icon: BookOpen,
  },
  {
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80',
    title: 'Campus Events',
    icon: Calendar,
  },
  {
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80',
    title: 'Outdoor Activities',
    icon: Dumbbell,
  },
]

// Portal Access Cards with refined design
const portalAccess = [
  {
    title: 'Administrator Portal',
    description: 'Complete school management and administrative controls',
    href: '/admin',
    icon: Shield,
    gradient: 'from-slate-600 to-slate-800',
    features: ['System Settings', 'User Management', 'Reports & Analytics'],
  },
  {
    title: 'Teacher Portal',
    description: 'Classroom management and academic tools',
    href: '/teacher',
    icon: UserCheck,
    gradient: 'from-emerald-600 to-teal-700',
    features: ['Grade Management', 'Lesson Planning', 'Student Progress'],
  },
  {
    title: 'Student Portal',
    description: 'Academic resources and personal dashboard',
    href: '/student',
    icon: GraduationCap,
    gradient: 'from-blue-600 to-indigo-700',
    features: ['Assignments', 'Timetable', 'Results & Grades'],
  },
  {
    title: 'Parent Portal',
    description: 'Stay connected with your child\'s academic journey',
    href: '/parent',
    icon: Heart,
    gradient: 'from-purple-600 to-pink-700',
    features: ['Progress Tracking', 'Communication', 'Fee Management'],
  },
]

// Academic Programs
const academicPrograms = [
  {
    icon: Brain,
    title: 'STEM Excellence',
    description: 'Advanced science, technology, engineering, and mathematics programs',
  },
  {
    icon: Palette,
    title: 'Arts & Humanities',
    description: 'Creative expression through visual arts, literature, and culture',
  },
  {
    icon: Globe2,
    title: 'Global Studies',
    description: 'International perspectives and multicultural understanding',
  },
  {
    icon: Dumbbell,
    title: 'Sports & Athletics',
    description: 'Comprehensive physical education and competitive sports',
  },
]

// School Statistics
const schoolStats = [
  { label: 'Years of Excellence', value: '25+', icon: Award },
  { label: 'Student Enrollment', value: '1,200+', icon: Users },
  { label: 'Qualified Teachers', value: '85+', icon: UserCheck },
  { label: 'University Acceptance', value: '98%', icon: Trophy },
]

// Campus Facilities
const facilities = [
  { icon: Library, title: 'Modern Library', desc: '50,000+ books and digital resources' },
  { icon: Microscope, title: 'Science Labs', desc: 'State-of-the-art equipped laboratories' },
  { icon: Monitor, title: 'Computer Labs', desc: 'Latest technology and software' },
  { icon: Dumbbell, title: 'Sports Complex', desc: 'Indoor and outdoor facilities' },
  { icon: Music, title: 'Music Studios', desc: 'Professional recording equipment' },
  { icon: Bus, title: 'Transportation', desc: 'Safe and reliable bus service' },
]

export function SchoolLandingPage() {
  const { currentTenant, subdomain, isLoading } = useTenant()
  const [mounted, setMounted] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(0)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Format subdomain to proper school name
  const formatSchoolName = (sub: string | null): string => {
    if (!sub) return 'Excellence Academy'
    // Convert subdomain to proper case and add appropriate suffix
    const formatted = sub
      .split('-')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    
    // Add appropriate suffix if not already present
    const suffixes = ['School', 'Academy', 'Institute', 'College', 'High', 'Prep']
    const hasSuffix = suffixes.some(suffix => formatted.toLowerCase().includes(suffix.toLowerCase()))
    
    if (!hasSuffix) {
      return `${formatted} Academy`
    }
    return formatted
  }

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  const displayName = currentTenant?.name || formatSchoolName(subdomain)
  const schoolDomain = subdomain || 'excellence'

  return (
    <>
      <style jsx global>{customStyles}</style>
      <div className="min-h-screen bg-white">
      {/* Professional Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                <School className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{displayName}</h1>
                <p className="text-sm text-slate-600">Excellence in Education</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="#programs" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
                Programs
              </Link>
              <Link href="#facilities" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
                Facilities
              </Link>
              <Link href="#contact" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
                Contact
              </Link>
              <Link href="/login">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg shadow-blue-600/20">
                  Portal Login
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Beautiful Campus Image */}
      <section className="relative min-h-[700px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=80" 
            alt="School Campus"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
        </div>
        
        {/* Animated Overlay Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='white' stroke-width='0.5' opacity='0.1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`,
          }}
        ></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full mb-8 border border-white/20">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-semibold text-sm tracking-wide">ADMISSIONS OPEN 2025-2026</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Welcome to
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-white">
                {displayName}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
              Where Excellence Meets Opportunity. Empowering students to achieve their dreams through world-class education and holistic development.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-gray-100 shadow-2xl font-semibold px-8">
                <Play className="mr-2 w-5 h-5" />
                Take Virtual Tour
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 backdrop-blur-md font-semibold px-8">
                Download Brochure
                <FileText className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronRight className="w-8 h-8 text-white rotate-90 drop-shadow-lg" />
        </div>
      </section>

      {/* Beautiful Campus Gallery */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Our Beautiful Campus</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Explore our state-of-the-art facilities designed to inspire learning and growth
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Main Featured Image */}
            <div className="relative h-[500px] rounded-2xl overflow-hidden group">
              <img 
                src={schoolGallery[selectedGalleryImage].url}
                alt={schoolGallery[selectedGalleryImage].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="inline-block px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full mb-3">
                  {schoolGallery[selectedGalleryImage].category}
                </span>
                <h3 className="text-3xl font-bold text-white mb-2">
                  {schoolGallery[selectedGalleryImage].title}
                </h3>
                <p className="text-gray-200">
                  {schoolGallery[selectedGalleryImage].description}
                </p>
              </div>
            </div>
            
            {/* Thumbnail Grid */}
            <div className="grid grid-cols-2 gap-4">
              {schoolGallery.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedGalleryImage(index)}
                  className={`relative h-[238px] rounded-xl overflow-hidden cursor-pointer group ${
                    selectedGalleryImage === index ? 'ring-4 ring-blue-600 ring-offset-2' : ''
                  }`}
                >
                  <img 
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white font-semibold text-sm">{image.title}</p>
                  </div>
                  {selectedGalleryImage === index && (
                    <div className="absolute top-4 right-4">
                      <Eye className="w-5 h-5 text-white drop-shadow-lg" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Portal Access Section - Enhanced */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-4">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-900">SECURE ACCESS</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Portal Login</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Access your personalized dashboard and resources
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {portalAccess.map((portal, index) => (
              <Link key={index} href={portal.href}>
                <Card className="group h-full hover:shadow-2xl transition-all duration-500 border-0 bg-white overflow-hidden cursor-pointer transform hover:-translate-y-2">
                  <div className={`h-1 bg-gradient-to-r ${portal.gradient}`}></div>
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${portal.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                      <portal.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{portal.title}</h3>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">{portal.description}</p>
                    <ul className="space-y-2 mb-4">
                      {portal.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-slate-500 flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          <span className="line-clamp-1">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center text-blue-600 font-semibold group-hover:gap-3 transition-all">
                      Login Now
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {schoolStats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-10 h-10 text-white/80 mx-auto mb-3" />
                <div className="text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Programs */}
      <section id="programs" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Academic Excellence</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Comprehensive programs designed to inspire and challenge students
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {academicPrograms.map((program, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-slate-200">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <program.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{program.title}</h3>
                  <p className="text-slate-600 text-sm">{program.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Facilities with Images */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">World-Class Facilities</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Modern infrastructure designed for 21st-century learning
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredFacilities.map((facility, index) => (
              <Card key={index} className="group overflow-hidden hover:shadow-2xl transition-all duration-500">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={facility.image}
                    alt={facility.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{facility.title}</h3>
                  <p className="text-slate-600 mb-4">{facility.description}</p>
                  <div className="space-y-2">
                    {facility.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-slate-500">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Life Photo Grid */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Campus Life</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Experience the vibrant community and endless opportunities
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {campusLife.map((item, index) => (
              <div key={index} className="relative group overflow-hidden rounded-2xl">
                <div className="aspect-square">
                  <img 
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <item.icon className="w-6 h-6 text-white mb-2" />
                    <p className="text-white font-semibold">{item.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-12">What People Say</h2>
          
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12">
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <p className="text-xl text-white mb-6 italic">
                {activeTestimonial === 0 && '"The best decision we made for our child\'s education. The teachers are exceptional and the facilities are outstanding."'}
                {activeTestimonial === 1 && '"My experience at this school has been transformative. The academic programs challenged me to reach my full potential."'}
                {activeTestimonial === 2 && '"As a teacher, I\'m proud to be part of this institution. The support for both students and staff is remarkable."'}
              </p>
              
              <div className="text-white">
                <p className="font-semibold">
                  {activeTestimonial === 0 && 'Sarah Johnson'}
                  {activeTestimonial === 1 && 'Michael Chen'}
                  {activeTestimonial === 2 && 'Dr. Emily Williams'}
                </p>
                <p className="text-blue-200">
                  {activeTestimonial === 0 && 'Parent'}
                  {activeTestimonial === 1 && 'Alumni, Class of 2023'}
                  {activeTestimonial === 2 && 'Senior Faculty'}
                </p>
              </div>
            </div>
            
            {/* Testimonial Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    activeTestimonial === index ? 'w-8 bg-white' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-12 border border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Begin Your Journey With Us
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Join our community of learners and discover your potential
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg">
                Apply Now
                <Rocket className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-slate-300">
                Schedule a Visit
                <Calendar className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Visit Us</h3>
              <p className="text-slate-600">123 Education Avenue<br />Excellence City, EC 12345</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Call Us</h3>
              <p className="text-slate-600">+1 (555) 123-4567<br />Mon-Fri, 8:00 AM - 5:00 PM</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Email Us</h3>
              <p className="text-slate-600">info@{schoolDomain}.edu<br />admissions@{schoolDomain}.edu</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
                  <School className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">{displayName}</h3>
              </div>
              <p className="text-slate-400 text-sm">
                Committed to excellence in education and character development since 1999.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Admissions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Academic Calendar</a></li>
                <li><a href="#" className="hover:text-white transition-colors">News & Events</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Student Handbook</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Parent Resources</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Career Guidance</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Alumni Network</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 text-center">
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} {displayName}. All rights reserved. | Powered by{' '}
              <span className="text-blue-400 font-semibold">Compasse</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
    </>
  )
}