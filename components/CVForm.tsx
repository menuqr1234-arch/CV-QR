'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'
import ImageUpload from './ImageUpload'
import {
  User,
  GraduationCap,
  Wrench,
  Briefcase,
  Users,
  Plus,
  Trash2,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Save,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  CheckCircle,
  FileText,
  UserCircle,
  Code,
  Menu,
  X,
  Calendar,
  Building,
  Quote,
  Star,
  Trophy,
} from 'lucide-react'

interface FormData {
  personalInfo: {
    fullName: string
    contactNumber: string
    email: string
    address: string
    profileImage: string
  }
  profile: string
  education: Array<{ school: string; field: string; year: string }>
  skills: { professional: string[]; personal: string[] }
  workExperience: Array<{ jobTitle: string; company: string; dates: string; responsibilities: string }>
  achievements: Array<{ title: string; description: string; year: string; image: string }>
  references: Array<{ name: string; position: string; contact: string }>
}

export default function CVForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeSection, setActiveSection] = useState('personal')
  const [errorDetails, setErrorDetails] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  const [formData, setFormData] = useState<FormData>({
    personalInfo: { 
      fullName: '', 
      contactNumber: '', 
      email: '', 
      address: '', 
      profileImage: '',
    },
    profile: '',
    education: [{ school: '', field: '', year: '' }],
    skills: { professional: [''], personal: [''] },
    workExperience: [],
    achievements: [],
    references: [],
  })

  // Handle window resize for responsive behavior
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false)
      }
    }
    
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  // Close mobile menu when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && mobileMenuOpen) {
        const target = event.target as HTMLElement
        if (!target.closest('.mobile-sidebar') && !target.closest('.mobile-menu-button')) {
          setMobileMenuOpen(false)
        }
      }
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isMobile, mobileMenuOpen])

  const updatePersonalInfo = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }))
  }

  const updateEducation = (index: number, field: string, value: string) => {
    const newEducation = [...formData.education]
    newEducation[index] = { ...newEducation[index], [field]: value }
    setFormData(prev => ({ ...prev, education: newEducation }))
  }

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { school: '', field: '', year: '' }]
    }))
  }

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }))
  }

  // Professional Skills functions
  const updateProfessionalSkill = (index: number, value: string) => {
    const newSkills = [...formData.skills.professional]
    newSkills[index] = value
    setFormData(prev => ({
      ...prev,
      skills: { ...prev.skills, professional: newSkills }
    }))
  }

  const addProfessionalSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: { ...prev.skills, professional: [...prev.skills.professional, ''] }
    }))
  }

  const removeProfessionalSkill = (index: number) => {
    if (formData.skills.professional.length > 1) {
      setFormData(prev => ({
        ...prev,
        skills: { ...prev.skills, professional: prev.skills.professional.filter((_, i) => i !== index) }
      }))
    }
  }

  // Personal Skills functions
  const updatePersonalSkill = (index: number, value: string) => {
    const newSkills = [...formData.skills.personal]
    newSkills[index] = value
    setFormData(prev => ({
      ...prev,
      skills: { ...prev.skills, personal: newSkills }
    }))
  }

  const addPersonalSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: { ...prev.skills, personal: [...prev.skills.personal, ''] }
    }))
  }

  const removePersonalSkill = (index: number) => {
    if (formData.skills.personal.length > 1) {
      setFormData(prev => ({
        ...prev,
        skills: { ...prev.skills, personal: prev.skills.personal.filter((_, i) => i !== index) }
      }))
    }
  }

  const updateWork = (index: number, field: string, value: string) => {
    const newWork = [...formData.workExperience]
    newWork[index] = { ...newWork[index], [field]: value }
    setFormData(prev => ({ ...prev, workExperience: newWork }))
  }

  const addWork = () => {
    setFormData(prev => ({
      ...prev,
      workExperience: [...prev.workExperience, { jobTitle: '', company: '', dates: '', responsibilities: '' }]
    }))
  }

  const removeWork = (index: number) => {
    setFormData(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index)
    }))
  }

  const updateAchievement = (index: number, field: string, value: string) => {
    const newAchievements = [...formData.achievements]
    newAchievements[index] = { ...newAchievements[index], [field]: value }
    setFormData(prev => ({ ...prev, achievements: newAchievements }))
  }

  const addAchievement = () => {
    setFormData(prev => ({
      ...prev,
      achievements: [...prev.achievements, { title: '', description: '', year: '', image: '' }]
    }))
  }

  const removeAchievement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }))
  }

  const updateReference = (index: number, field: string, value: string) => {
    const newRefs = [...formData.references]
    newRefs[index] = { ...newRefs[index], [field]: value }
    setFormData(prev => ({ ...prev, references: newRefs }))
  }

  const addReference = () => {
    setFormData(prev => ({
      ...prev,
      references: [...prev.references, { name: '', position: '', contact: '' }]
    }))
  }

  const removeReference = (index: number) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references.filter((_, i) => i !== index)
    }))
  }

  const onSubmit = async () => {
    setIsSubmitting(true)
    setErrorDetails(null)
    
    try {
      if (!formData.personalInfo.fullName) throw new Error('Full name is required')
      if (!formData.personalInfo.contactNumber) throw new Error('Contact number is required')
      if (!formData.personalInfo.email) throw new Error('Email is required')
      if (!formData.profile) throw new Error('Profile/Objective is required')
      
      const professionalSkills = formData.skills.professional.filter(s => s.trim() !== '')
      if (professionalSkills.length === 0) throw new Error('At least one professional skill is required')
      
      const personalSkills = formData.skills.personal.filter(s => s.trim() !== '')
      
      const slug = `${formData.personalInfo.fullName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
      
      const cvData = {
        personal_info: {
          fullName: formData.personalInfo.fullName,
          contactNumber: formData.personalInfo.contactNumber,
          email: formData.personalInfo.email,
          address: formData.personalInfo.address || '',
          profile_image: formData.personalInfo.profileImage || '',
        },
        objective: formData.profile,
        education: formData.education.filter(e => e.school && e.field).map(e => ({
          school: e.school,
          degree: e.field,
          year: e.year
        })),
        skills: {
          professional: professionalSkills,
          personal: personalSkills,
        },
        work_experience: formData.workExperience.filter(w => w.jobTitle),
        achievements: formData.achievements.filter(a => a.title).map(a => ({
          title: a.title,
          description: a.description,
          year: a.year,
          image: a.image
        })),
        references: formData.references.filter(r => r.name),
        slug: slug,
      }

      const { error } = await supabase.from('cvs').insert(cvData)
      if (error) throw error

      router.push(`/cv/${slug}`)
      
    } catch (error: any) {
      console.error('Error saving CV:', error)
      setErrorDetails(error.message || 'Failed to save CV')
    } finally {
      setIsSubmitting(false)
    }
  }

  const sections = [
    { id: 'personal', name: 'Personal Information', icon: UserCircle, color: 'blue', description: 'Your basic details' },
    { id: 'profile', name: 'Objective', icon: FileText, color: 'purple', description: 'Career objective' },
    { id: 'education', name: 'Education', icon: GraduationCap, color: 'green', description: 'Academic background' },
    { id: 'skills', name: 'Skills', icon: Code, color: 'orange', description: 'Professional & personal skills' },
    { id: 'experience', name: 'Work Experience', icon: Briefcase, color: 'red', description: 'Professional history' },
    { id: 'achievements', name: 'Achievements', icon: Trophy, color: 'yellow', description: 'Key accomplishments' },
    { id: 'references', name: 'References', icon: Users, color: 'indigo', description: 'Professional contacts' },
  ]

  const currentIndex = sections.findIndex(s => s.id === activeSection)
  const nextSection = sections[currentIndex + 1]
  const prevSection = sections[currentIndex - 1]

  const goToNext = () => {
    if (nextSection) setActiveSection(nextSection.id)
    setMobileMenuOpen(false)
  }

  const goToPrev = () => {
    if (prevSection) setActiveSection(prevSection.id)
    setMobileMenuOpen(false)
  }

  const getSectionProgress = () => {
    const filledSections = sections.filter(section => {
      switch(section.id) {
        case 'personal':
          return formData.personalInfo.fullName && formData.personalInfo.email
        case 'profile':
          return formData.profile.length > 0
        case 'education':
          return formData.education.some(e => e.school && e.field)
        case 'skills':
          return formData.skills.professional.some(s => s.trim() !== '')
        case 'experience':
          return formData.workExperience.length > 0
        case 'achievements':
          return formData.achievements.length > 0
        case 'references':
          return formData.references.length > 0
        default:
          return false
      }
    }).length
    return (filledSections / sections.length) * 100
  }

  const getColorClass = (color: string, isActive: boolean) => {
    const colors: Record<string, { bg: string; text: string; border: string; active: string }> = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', active: 'bg-blue-600' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', active: 'bg-purple-600' },
      green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200', active: 'bg-green-600' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', active: 'bg-orange-600' },
      red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', active: 'bg-red-600' },
      yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-200', active: 'bg-yellow-600' },
      indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200', active: 'bg-indigo-600' },
    }
    return colors[color] || colors.blue
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'personal':
        return (
          <div className="space-y-6">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-xl opacity-20"></div>
                <div className="relative w-32 h-32">
                  <ImageUpload
                    onImageChange={(base64) => updatePersonalInfo('profileImage', base64)}
                    currentImage={formData.personalInfo.profileImage}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    value={formData.personalInfo.fullName}
                    onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50 focus:bg-white" 
                    placeholder="Juan Dela Cruz" 
                  />
                </div>
              </div>
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    value={formData.personalInfo.contactNumber}
                    onChange={(e) => updatePersonalInfo('contactNumber', e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50 focus:bg-white" 
                    placeholder="+63 234 567 8900" 
                  />
                </div>
              </div>
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    value={formData.personalInfo.email}
                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                    type="email" 
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50 focus:bg-white" 
                    placeholder="juan@example.com" 
                  />
                </div>
              </div>
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    value={formData.personalInfo.address}
                    onChange={(e) => updatePersonalInfo('address', e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50 focus:bg-white" 
                    placeholder="Makati City, Philippines" 
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 'profile':
        return (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100">
              <p className="text-sm text-purple-800 mb-2">💡 Tip for a great objective:</p>
              <ul className="text-xs text-purple-700 space-y-1">
                <li>• Keep it concise (2-3 sentences)</li>
                <li>• Highlight your career goals and what you offer</li>
                <li>• Tailor it to your desired position</li>
              </ul>
            </div>
            <textarea 
              value={formData.profile}
              onChange={(e) => setFormData(prev => ({ ...prev, profile: e.target.value }))}
              rows={6} 
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all bg-gray-50 focus:bg-white resize-y font-serif leading-relaxed" 
              placeholder="Write a clear career objective that states your professional goals and what you aim to achieve in your next role..." 
            />
          </div>
        )

      case 'education':
        return (
          <div className="space-y-4">
            {formData.education.map((edu, index) => (
              <div key={index} className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900">Education #{index + 1}</h3>
                  </div>
                  {index > 0 && (
                    <button 
                      type="button" 
                      onClick={() => removeEducation(index)} 
                      className="text-red-500 hover:text-red-600 transition-colors p-1 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <input 
                    value={edu.school}
                    onChange={(e) => updateEducation(index, 'school', e.target.value)}
                    placeholder="School / University Name" 
                    className="px-3 py-2.5 border border-gray-200 rounded-lg focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all bg-white" 
                  />
                  <input 
                    value={edu.field}
                    onChange={(e) => updateEducation(index, 'field', e.target.value)}
                    placeholder="Degree / Qualification" 
                    className="px-3 py-2.5 border border-gray-200 rounded-lg focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all bg-white" 
                  />
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      value={edu.year}
                      onChange={(e) => updateEducation(index, 'year', e.target.value)}
                      placeholder="Year of Graduation" 
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all bg-white" 
                    />
                  </div>
                </div>
              </div>
            ))}
            <button 
              type="button" 
              onClick={addEducation} 
              className="w-full border-2 border-dashed border-gray-300 rounded-lg py-3 text-gray-500 hover:border-green-400 hover:text-green-500 transition-all flex items-center justify-center gap-2 text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Education
            </button>
          </div>
        )

      case 'skills':
        return (
          <div className="flex flex-col gap-6">
            {/* Professional Skills */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 sm:p-6 rounded-xl border border-orange-100">
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-orange-600" />
                Professional Skills <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {formData.skills.professional.map((skill, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="flex-shrink-0 text-orange-500">•</div>
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => updateProfessionalSkill(idx, e.target.value)}
                      placeholder={`Skill ${idx + 1} (e.g., Project Management)`}
                      className="flex-1 min-w-0 px-3 py-2 border border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all bg-white text-sm"
                    />
                    {formData.skills.professional.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeProfessionalSkill(idx)}
                        className="text-red-500 hover:text-red-600 p-1 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addProfessionalSkill}
                className="mt-3 w-full border-2 border-dashed border-orange-300 rounded-lg py-2 text-orange-600 hover:border-orange-400 hover:text-orange-700 transition-all flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Professional Skill
              </button>
            </div>

            {/* Personal Skills */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 sm:p-6 rounded-xl border border-blue-100">
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-blue-600" />
                Personal Skills
              </label>
              <div className="space-y-3">
                {formData.skills.personal.map((skill, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="flex-shrink-0 text-blue-500">•</div>
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => updatePersonalSkill(idx, e.target.value)}
                      placeholder={`Skill ${idx + 1} (e.g., Leadership)`}
                      className="flex-1 min-w-0 px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all bg-white text-sm"
                    />
                    {formData.skills.personal.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePersonalSkill(idx)}
                        className="text-red-500 hover:text-red-600 p-1 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addPersonalSkill}
                className="mt-3 w-full border-2 border-dashed border-blue-300 rounded-lg py-2 text-blue-600 hover:border-blue-400 hover:text-blue-700 transition-all flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Personal Skill
              </button>
            </div>
          </div>
        )

      case 'experience':
        return (
          <div className="space-y-4">
            {formData.workExperience.map((work, index) => (
              <div key={index} className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-red-600" />
                    <h3 className="font-semibold text-gray-900">Experience #{index + 1}</h3>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeWork(index)} 
                    className="text-red-500 hover:text-red-600 transition-colors p-1 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <input 
                    value={work.jobTitle}
                    onChange={(e) => updateWork(index, 'jobTitle', e.target.value)}
                    placeholder="Job Title" 
                    className="px-3 py-2.5 border border-gray-200 rounded-lg focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all bg-white" 
                  />
                  <input 
                    value={work.company}
                    onChange={(e) => updateWork(index, 'company', e.target.value)}
                    placeholder="Company Name" 
                    className="px-3 py-2.5 border border-gray-200 rounded-lg focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all bg-white" 
                  />
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      value={work.dates}
                      onChange={(e) => updateWork(index, 'dates', e.target.value)}
                      placeholder="Dates (e.g., Jan 2020 - Present)" 
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all bg-white" 
                    />
                  </div>
                  <textarea 
                    value={work.responsibilities}
                    onChange={(e) => updateWork(index, 'responsibilities', e.target.value)}
                    placeholder="Key responsibilities and achievements" 
                    rows={3} 
                    className="px-3 py-2.5 border border-gray-200 rounded-lg focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all bg-white resize-y" 
                  />
                </div>
              </div>
            ))}
            <button 
              type="button" 
              onClick={addWork} 
              className="w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-red-400 hover:text-red-500 transition-all text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Experience
            </button>
          </div>
        )

      case 'achievements':
        return (
          <div className="space-y-4">
            {formData.achievements.map((achievement, index) => (
              <div key={index} className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-5 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                    <h3 className="font-semibold text-gray-900">Achievement #{index + 1}</h3>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeAchievement(index)} 
                    className="text-red-500 hover:text-red-600 transition-colors p-1 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <input 
                    value={achievement.title}
                    onChange={(e) => updateAchievement(index, 'title', e.target.value)}
                    placeholder="Achievement Title (e.g., Employee of the Month, Top Sales Award)" 
                    className="px-3 py-2.5 border border-gray-200 rounded-lg focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 transition-all bg-white" 
                  />
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      value={achievement.year}
                      onChange={(e) => updateAchievement(index, 'year', e.target.value)}
                      placeholder="Year Achieved" 
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 transition-all bg-white" 
                    />
                  </div>
                  <textarea 
                    value={achievement.description}
                    onChange={(e) => updateAchievement(index, 'description', e.target.value)}
                    placeholder="Describe your achievement and its impact" 
                    rows={3} 
                    className="px-3 py-2.5 border border-gray-200 rounded-lg focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 transition-all bg-white resize-y" 
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Certificate/Image (Optional)</label>
                  <ImageUpload
                    onImageChange={(base64) => updateAchievement(index, 'image', base64)}
                    currentImage={achievement.image}
                  />
                </div>
              </div>
            ))}
            <button 
              type="button" 
              onClick={addAchievement} 
              className="w-full border-2 border-dashed border-gray-300 rounded-lg py-3 text-gray-500 hover:border-yellow-400 hover:text-yellow-500 transition-all flex items-center justify-center gap-2 text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Achievement
            </button>
          </div>
        )

      case 'references':
        return (
          <div className="space-y-4">
            {formData.references.map((ref, index) => (
              <div key={index} className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-5 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <Quote className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-semibold text-gray-900">Reference #{index + 1}</h3>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeReference(index)} 
                    className="text-red-500 hover:text-red-600 transition-colors p-1 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <input 
                    value={ref.name}
                    onChange={(e) => updateReference(index, 'name', e.target.value)}
                    placeholder="Full Name" 
                    className="px-3 py-2.5 border border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all bg-white" 
                  />
                  <input 
                    value={ref.position}
                    onChange={(e) => updateReference(index, 'position', e.target.value)}
                    placeholder="Position / Title (e.g., Manager, Professor)" 
                    className="px-3 py-2.5 border border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all bg-white" 
                  />
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      value={ref.contact}
                      onChange={(e) => updateReference(index, 'contact', e.target.value)}
                      placeholder="Email or Phone Number" 
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all bg-white" 
                    />
                  </div>
                </div>
              </div>
            ))}
            <button 
              type="button" 
              onClick={addReference} 
              className="w-full border-2 border-dashed border-gray-300 rounded-lg py-3 text-gray-500 hover:border-indigo-400 hover:text-indigo-500 transition-all flex items-center justify-center gap-2 text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Reference
            </button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile menu button - only visible on mobile */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mobile-menu-button p-2 bg-white rounded-lg shadow-lg border border-gray-200"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop fixed, Mobile sliding */}
      <div className={`
        mobile-sidebar fixed top-0 left-0 h-full bg-white shadow-2xl z-40 transition-transform duration-300 ease-in-out
        lg:fixed lg:left-0 lg:translate-x-0 lg:w-80
        ${mobileMenuOpen ? 'translate-x-0 w-80' : '-translate-x-full w-80'}
      `}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">CV Builder</h2>
                <p className="text-white/80 text-xs">Complete your profile</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-white/80 mb-1">
                <span>Completion</span>
                <span>{Math.round(getSectionProgress())}%</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-300"
                  style={{ width: `${getSectionProgress()}%` }}
                />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {sections.map(section => {
              const isActive = activeSection === section.id
              const colors = getColorClass(section.color, isActive)
              const Icon = section.icon
              
              let isComplete = false
              switch(section.id) {
                case 'personal':
                  isComplete = !!formData.personalInfo.fullName && !!formData.personalInfo.email
                  break
                case 'profile':
                  isComplete = formData.profile.length > 0
                  break
                case 'education':
                  isComplete = formData.education.some(e => e.school && e.field)
                  break
                case 'skills':
                  isComplete = formData.skills.professional.some(s => s.trim() !== '')
                  break
                case 'experience':
                  isComplete = formData.workExperience.length > 0
                  break
                case 'achievements':
                  isComplete = formData.achievements.length > 0
                  break
                case 'references':
                  isComplete = formData.references.length > 0
                  break
              }
              
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id)
                    setMobileMenuOpen(false)
                  }}
                  className={`
                    w-full text-left p-3 rounded-xl transition-all duration-200
                    ${isActive 
                      ? `${colors.bg} ${colors.text} shadow-sm border-l-4 ${colors.border}` 
                      : 'hover:bg-gray-50 text-gray-600'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? colors.text : 'text-gray-400'}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${isActive ? colors.text : 'text-gray-700'}`}>
                          {section.name}
                        </span>
                        {isComplete && (
                          <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                        )}
                      </div>
                      <p className={`text-xs mt-0.5 ${isActive ? 'text-gray-600' : 'text-gray-400'}`}>
                        {section.description}
                      </p>
                    </div>
                  </div>
                </button>
              )
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 text-center">
                Complete all sections to generate your professional CV
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Desktop: ml-80, Mobile: no margin */}
      <div className="lg:ml-80">
        {/* Header - NOT sticky */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CV Builder
                </h1>
                <p className="text-xs text-gray-500 hidden lg:block">Create your professional CV</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Progress: {Math.round(getSectionProgress())}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar - NOT sticky */}
        <div className="h-1 bg-gray-200">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300"
            style={{ width: `${getSectionProgress()}%` }}
          />
        </div>

        {/* Content Area */}
        <div className="pt-8 pb-12">
          {errorDetails && (
            <div className="max-w-4xl mx-auto mt-4 px-6">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
                <p className="text-sm text-red-700">{errorDetails}</p>
              </div>
            </div>
          )}

          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-8">
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-2">
                    {(() => {
                      const currentSection = sections.find(s => s.id === activeSection)
                      const colors = getColorClass(currentSection?.color || 'blue', true)
                      const Icon = currentSection?.icon
                      return (
                        <>
                          {Icon && <Icon className={`w-6 h-6 ${colors.text}`} />}
                          <h2 className="text-2xl font-bold text-gray-900">
                            {currentSection?.name}
                          </h2>
                        </>
                      )
                    })()}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Fill in the details for this section
                  </p>
                </div>

                <div className="mb-8">
                  {renderContent()}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  {prevSection ? (
                    <button
                      type="button"
                      onClick={goToPrev}
                      className="flex items-center gap-2 px-5 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all font-medium"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      {prevSection.name}
                    </button>
                  ) : (
                    <div />
                  )}
                  
                  {nextSection ? (
                    <button
                      type="button"
                      onClick={goToNext}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-sm hover:shadow-md font-medium"
                    >
                      {nextSection.name}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={onSubmit}
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-sm hover:shadow-md disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed font-medium"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Create CV & Generate QR Code
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
