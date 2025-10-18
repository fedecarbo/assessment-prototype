'use client'

import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { ApplicationStatusBadges } from './application-status-badges'

interface ApplicationDetailLayoutProps {
  applicationId: string
  address: string
  reference: string
  status: string
  daysToDecision: number
  children: ReactNode
}

interface Section {
  id: string
  label: string
}

const sections: Section[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'progress', label: 'Application Progress' },
  { id: 'documents', label: 'Documents' },
  { id: 'assessment', label: 'Assessment' },
  { id: 'history', label: 'History' },
  { id: 'comments', label: 'Comments' },
]

// IntersectionObserver configuration constants
const HERO_COLLAPSE_THRESHOLD_PX = 80
const SCROLLSPY_TOP_OFFSET_PX = 120
const SCROLLSPY_BOTTOM_OFFSET_PERCENT = 50
const SCROLLSPY_THRESHOLDS = [0, 0.25, 0.5, 0.75, 1]

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
        rootMargin: `-${HERO_COLLAPSE_THRESHOLD_PX}px 0px 0px 0px`,
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
          const topSection = intersectingSections[0]
          if (topSection) {
            setActiveSection(topSection.id)
          }
        }
      },
      {
        threshold: SCROLLSPY_THRESHOLDS,
        rootMargin: `-${SCROLLSPY_TOP_OFFSET_PX}px 0px -${SCROLLSPY_BOTTOM_OFFSET_PERCENT}% 0px`,
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
      <div ref={heroRef} id="overview" className="bg-background">
        <div className="mx-auto max-w-[1100px] px-4 py-8">
          <div className="flex gap-8">
            {/* Left: Application Details */}
            <div className="flex flex-1 flex-col justify-center space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{address}</h1>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-base font-medium text-muted-foreground">Application reference:</span>
                  <span className="text-base text-foreground">{reference}</span>
                </div>

                <ApplicationStatusBadges status={status} daysToDecision={daysToDecision} />
              </div>
            </div>

            {/* Right: Map Placeholder */}
            <div className="w-[550px]">
              <div className="aspect-square w-full rounded-lg border-2 border-dashed border-border bg-muted flex items-center justify-center">
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-muted-foreground"
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
                  <p className="mt-2 text-sm text-muted-foreground">Map placeholder</p>
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
          className={`bg-background ${
            isHeroCollapsed ? '' : 'pointer-events-none h-0 overflow-hidden opacity-0'
          }`}
        >
          <div className="mx-auto max-w-[1100px] px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-bold text-foreground">{address}</h2>
                <span className="text-base text-muted-foreground">{reference}</span>
              </div>
              <ApplicationStatusBadges
                status={status}
                daysToDecision={daysToDecision}
                size="compact"
              />
            </div>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="border-b border-border bg-background">
        <div className="mx-auto max-w-[1100px] px-4">
          <nav className="flex gap-6" aria-label="Application sections" role="navigation">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(section.id)
                }}
                className={`relative border-b-2 py-3 text-base transition-colors ${
                  activeSection === section.id
                    ? 'border-primary text-foreground'
                    : 'border-transparent text-primary hover:underline'
                }`}
                aria-current={activeSection === section.id ? 'page' : undefined}
              >
                {section.label}
              </a>
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
