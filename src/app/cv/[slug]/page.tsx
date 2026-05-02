'use client'

import { supabase } from '../../../../lib/supabase'
import { QRCodeSVG } from 'qrcode.react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default function CVPage({ params }: PageProps) {
  const router = useRouter()
  const [cv, setCv] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [slug, setSlug] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    params.then((resolvedParams) => {
      setSlug(resolvedParams.slug)
    })
  }, [params])

  useEffect(() => {
    if (slug) {
      fetchCV()
    }
  }, [slug])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const fetchCV = async () => {
    try {
      const { data, error } = await supabase
        .from('cvs')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error || !data) {
        setError(true)
      } else {
        setCv(data)
      }
    } catch (err) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const downloadQRCode = () => {
    const svg = qrRef.current?.querySelector('svg')
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = 300
      canvas.height = 300
      ctx?.drawImage(img, 0, 0, 300, 300)
      
      const pngFile = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.download = `cv-qr-code-${slug}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading your CV...</p>
        </div>
      </div>
    )
  }

  if (error || !cv) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">CV Not Found</h2>
          <p className="text-gray-600 mb-6">The CV you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Create New CV
          </button>
        </div>
      </div>
    )
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const cvUrl = `${baseUrl}/cv/${slug}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Action Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-6 mb-8 print:hidden">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {cv.personal_info.fullName}
              </h1>
              <p className="text-gray-500 mt-2 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Digital CV • Shareable & Printable
              </p>
              <div className="mt-6">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(cvUrl)
                  }}
                  className="group px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2 bg-white"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CV Document */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none">
          {/* Header with Profile */}
          <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-blue-900 text-white p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {cv.personal_info.profile_image && (
                <div className="flex-shrink-0">
                  <img 
                    src={cv.personal_info.profile_image} 
                    alt={cv.personal_info.fullName}
                    className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover border-4 border-white/20 shadow-2xl"
                  />
                </div>
              )}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  {cv.personal_info.fullName}
                </h1>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start text-gray-300 mt-4">
                  {cv.personal_info.email && (
                    <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {cv.personal_info.email}
                    </span>
                  )}
                  {cv.personal_info.contactNumber && (
                    <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {cv.personal_info.contactNumber}
                    </span>
                  )}
                  {cv.personal_info.address && (
                    <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {cv.personal_info.address}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Objective Statement */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-4 border-blue-500 p-8">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-900 mb-2">Professional Objective</h3>
                <p className="text-gray-700 leading-relaxed text-lg">{cv.objective}</p>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="p-8 space-y-8">
            {/* Experience Section */}
            {cv.work_experience?.length > 0 && (
              <Section 
                title="Work Experience" 
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
                color="blue"
              >
                <div className="space-y-6">
                  {cv.work_experience.map((work: any, index: number) => (
                    <div key={index} className="relative pl-8 border-l-2 border-blue-200 hover:border-blue-500 transition-colors">
                      <div className="absolute left-[-9px] top-0 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                      <div className="mb-2">
                        <h4 className="text-xl font-bold text-gray-900">{work.jobTitle}</h4>
                        <p className="text-blue-600 font-semibold">{work.company}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {work.dates}
                        </p>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{work.responsibilities}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Education Section */}
            <Section 
              title="Education" 
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
              }
              color="indigo"
            >
              <div className="grid gap-4">
                {cv.education.map((edu: any, index: number) => (
                  <div key={index} className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-5 border border-indigo-100 hover:shadow-lg transition-all duration-300">
                    <h4 className="font-bold text-lg text-gray-900">{edu.school}</h4>
                    <p className="text-indigo-600 font-semibold">{edu.degree}</p>
                    <p className="text-sm text-gray-500">{edu.year}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* Skills Section */}
            {((cv.skills.professional?.length ?? 0) > 0 || (cv.skills.personal?.length ?? 0) > 0 || (cv.skills.technical?.length ?? 0) > 0 || (cv.skills.other?.length ?? 0) > 0) && (
              <Section 
                title="Skills & Expertise" 
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                }
                color="purple"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  {((cv.skills.professional?.length ?? 0) > 0 || (cv.skills.technical?.length ?? 0) > 0) && (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">
                      <h4 className="font-bold text-purple-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Professional Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {(cv.skills.professional ?? cv.skills.technical ?? []).map((skill: string, i: number) => (
                          <span key={i} className="px-4 py-2 bg-white text-purple-700 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-shadow border border-purple-200">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {((cv.skills.personal?.length ?? 0) > 0 || (cv.skills.other?.length ?? 0) > 0) && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
                      <h4 className="font-bold text-green-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Personal Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {(cv.skills.personal ?? cv.skills.other ?? []).map((skill: string, i: number) => (
                          <span key={i} className="px-4 py-2 bg-white text-green-700 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-shadow border border-green-200">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Section>
            )}

            {/* Projects Section */}
            {cv.projects?.length > 0 && (
              <Section 
                title="Projects" 
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                }
                color="orange"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  {cv.projects.map((project: any, index: number) => (
                    <div key={index} className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200">
                      {project.image && (
                        <div className="relative overflow-hidden">
                          <img 
                            src={project.image} 
                            alt={project.name} 
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                      )}
                      <div className="p-5">
                        <h4 className="font-bold text-lg text-gray-900 mb-2">{project.name}</h4>
                        <p className="text-gray-600">{project.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Certifications */}
            {cv.certifications?.length > 0 && (
              <Section 
                title="Certifications" 
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                }
                color="green"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  {cv.certifications.map((cert: any, index: number) => (
                    <div key={index} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200 hover:shadow-lg transition-all duration-300">
                      {cert.image && (
                        <img src={cert.image} alt={cert.name} className="w-full h-32 object-cover rounded-lg mb-3" />
                      )}
                      <h4 className="font-bold text-gray-900">{cert.name}</h4>
                      <p className="text-green-700 font-semibold">{cert.issuer}</p>
                      <p className="text-sm text-gray-500 mt-1">{cert.year}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Achievements */}
            {cv.achievements?.length > 0 && (
              <Section 
                title="Achievements" 
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                }
                color="yellow"
              >
                <div className="grid gap-4">
                  {cv.achievements.map((achievement: any, index: number) => (
                    <div key={index} className="flex gap-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-5 border border-yellow-200 hover:shadow-lg transition-all duration-300">
                      {achievement.image && (
                        <img src={achievement.image} alt={achievement.title} className="w-20 h-20 object-cover rounded-lg" />
                      )}
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">{achievement.title}</h4>
                        <p className="text-gray-600">{achievement.description}</p>
                        <p className="text-sm text-yellow-600 font-semibold mt-2">{achievement.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* References */}
            {cv.references?.length > 0 && (
              <Section 
                title="References" 
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                }
                color="teal"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  {cv.references.map((ref: any, index: number) => (
                    <div key={index} className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-5 border border-teal-200 hover:shadow-lg transition-all duration-300">
                      <h4 className="font-bold text-gray-900 text-lg">{ref.name}</h4>
                      <p className="text-teal-700 font-semibold">{ref.position}</p>
                      <p className="text-gray-600 mt-2 flex items-center gap-2">
                        <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {ref.contact}
                      </p>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-gray-400 p-6 text-center print:hidden">
            <p>© {new Date().getFullYear()} Digital CV Platform • Created with Next.js</p>
            <p className="text-sm mt-1">Scan QR code to view this CV online</p>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 text-center print:hidden">
          <button
            onClick={() => router.push('/')}
            className="px-8 py-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-xl hover:from-gray-800 hover:to-black transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Create Another CV
          </button>
        </div>
      </div>

      {/* Floating QR Code */}
      <div className={`fixed bottom-8 right-8 z-50 transition-all duration-500 print:hidden ${
        isScrolled ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
      }`}>
        <div className="relative group">
          {/* QR Code Container */}
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4">
            <div ref={qrRef} className="bg-white p-3 rounded-xl shadow-inner">
              <QRCodeSVG 
                value={cvUrl} 
                size={120} 
                level="H"
                includeMargin={true}
                bgColor="#ffffff"
                fgColor="#1e3a8a"
              />
            </div>
            <p className="text-xs text-gray-600 mt-2 text-center font-medium">Scan to view CV</p>
            
            {/* Download Button - Always Visible */}
            <button
              onClick={downloadQRCode}
              className="mt-3 w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
            >
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download QR
            </button>
          </div>
          
          {/* Pulse Effect */}
          <div className="absolute inset-0 rounded-2xl animate-ping bg-blue-400 opacity-20 -z-10"></div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:rounded-none {
            border-radius: 0 !important;
          }
        }
      `}</style>
    </div>
  )
}

// Reusable Section Component
function Section({ title, icon, color, children }: { 
  title: string, 
  icon: React.ReactNode, 
  color: string,
  children: React.ReactNode 
}) {
  const colorMap: any = {
    blue: 'from-blue-500 to-blue-600',
    indigo: 'from-indigo-500 to-indigo-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
    teal: 'from-teal-500 to-teal-600',
  }

  return (
    <section className="relative">
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-12 h-12 bg-gradient-to-br ${colorMap[color]} rounded-xl flex items-center justify-center text-white shadow-lg`}>
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>
      {children}
    </section>
  )
}