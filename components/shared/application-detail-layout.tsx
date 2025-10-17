'use client'

import { useEffect, useRef, useState } from 'react'

interface ApplicationDetailLayoutProps {
  applicationId: string
  address: string
  reference: string
  status: string
  daysToDecision: number
  children: React.ReactNode
}

interface Section {
  id: string
  label: string
}

const sections: Section[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'documents', label: 'Documents' },
  { id: 'assessment', label: 'Assessment' },
  { id: 'history', label: 'History' },
  { id: 'comments', label: 'Comments' },
]

export function ApplicationDetailLayout({
  applicationId,
  address,
  reference,
  status,
  daysToDecision,
  children,
}: ApplicationDetailLayoutProps) {
  const [isHeroCollapsed, setIsHeroCollapsed] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('overview')
  const heroRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Hero collapse effect using IntersectionObserver
  useEffect(() => {
    const heroElement = heroRef.current
    if (!heroElement) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          setIsHeroCollapsed(!entry.isIntersecting)
        }
      },
      {
        threshold: 0,
        rootMargin: '-80px 0px 0px 0px', // Trigger when hero scrolls past 80px
      }
    )

    observer.observe(heroElement)

    return () => {
      observer.disconnect()
    }
  }, [])

  // Scrollspy effect using IntersectionObserver
  useEffect(() => {
    const sectionElements = sections.map((section) =>
      document.getElementById(section.id)
    )

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Collect all intersecting sections with their positions
        const intersectingSections: Array<{ id: string; ratio: number; top: number }> = []

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            intersectingSections.push({
              id: entry.target.id,
              ratio: entry.intersectionRatio,
              top: entry.boundingClientRect.top,
            })
          }
        })

        if (intersectingSections.length > 0) {
          // Sort by position (topmost first)
          intersectingSections.sort((a, b) => a.top - b.top)

          // Set the topmost visible section as active
          setActiveSection(intersectingSections[0].id)
        }
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: '-120px 0px -50% 0px',
      }
    )

    sectionElements.forEach((element) => {
      if (element) {
        observerRef.current?.observe(element)
      }
    })

    return () => {
      observerRef.current?.disconnect()
    }
  }, [])

  const handleNavClick = (sectionId: string) => {
    if (sectionId === 'overview') {
      // Scroll to top for Overview
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <div className="relative">
      {/* Hero Section */}
      <div ref={heroRef} id="overview" className="bg-white">
        <div className="mx-auto max-w-[1100px] px-4 py-8">
          <div className="flex gap-8">
            {/* Left: Application Details */}
            <div className="flex flex-1 flex-col justify-center space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{address}</h1>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium text-gray-600">Application reference:</span>
                  <span className="text-base text-gray-900">{reference}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                    {status}
                  </span>
                  <span className="bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
                    {daysToDecision} days to determination date
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Map Placeholder */}
            <div className="w-[550px]">
              <div className="aspect-square w-full rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">Map placeholder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Header Container */}
      <div className="sticky top-0 z-40">
        {/* Condensed Header - Appears when hero collapses */}
        <div
          className={`bg-white ${
            isHeroCollapsed ? '' : 'pointer-events-none h-0 overflow-hidden opacity-0'
          }`}
        >
          <div className="mx-auto max-w-[1100px] px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-gray-900">{address}</h2>
                <span className="text-base text-gray-600">{reference}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                  {status}
                </span>
                <span className="bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                  {daysToDecision} days to determination date
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-[1100px] px-4">
          <nav className="flex gap-6" aria-label="Application sections">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleNavClick(section.id)}
                className={`relative border-b-2 py-3 text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900'
                }`}
                aria-current={activeSection === section.id ? 'location' : undefined}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-[1100px] px-4 py-8">
        {children}
      </div>
    </div>
  )
}
