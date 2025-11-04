'use client'

import type { ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { ApplicationStatusBadges } from './application-status-badges'
import type { Constraint } from '@/lib/mock-data/schemas'

// Dynamic import of MapView to prevent SSR issues with Leaflet
const MapView = dynamic(
  () => import('./map-view').then(mod => ({ default: mod.MapView })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-muted rounded flex items-center justify-center border border-border">
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    )
  }
)

interface ApplicationDetailLayoutProps {
  applicationId: string
  address: string
  reference: string
  status: string
  daysToDecision: number
  documentsCount?: number
  constraintsCount?: number
  constraints?: Constraint[]
  propertyBoundary?: {
    type: 'Polygon'
    coordinates: [number, number][][]
  }
  children: ReactNode
}

interface Section {
  id: string
  label: string
}

function getSections(documentsCount?: number, constraintsCount?: number): Section[] {
  return [
    { id: 'overview', label: 'Overview' },
    { id: 'progress', label: 'Timeline' },
    { id: 'documents', label: documentsCount ? `Documents (${documentsCount})` : 'Documents' },
    { id: 'constraints', label: constraintsCount ? `Constraints (${constraintsCount})` : 'Constraints' },
    { id: 'consultees', label: 'Consultees' },
    { id: 'neighbours', label: 'Neighbours' },
  ]
}

// IntersectionObserver configuration constants
const HERO_COLLAPSE_THRESHOLD_PX = 80
const SCROLLSPY_TOP_OFFSET_PX = 161 // Just below scroll-mt-[160px] - section must reach this point to activate
const SCROLLSPY_BOTTOM_OFFSET_PERCENT = 75 // Increased - section must be well into viewport
const SCROLLSPY_THRESHOLDS = [0, 0.25, 0.5, 0.75, 1]

export function ApplicationDetailLayout({
  applicationId,
  address,
  reference,
  status,
  daysToDecision,
  documentsCount,
  constraintsCount,
  constraints = [],
  propertyBoundary,
  children,
}: ApplicationDetailLayoutProps) {
  const [isHeroCollapsed, setIsHeroCollapsed] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('overview')
  const heroRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Memoize sections to prevent unnecessary recalculations
  const sections = useMemo(
    () => getSections(documentsCount, constraintsCount),
    [documentsCount, constraintsCount]
  )

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

  // Memoize scrollspy callback to prevent observer recreation
  const handleScrollspyIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
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
  }, [])

  // Scrollspy effect using IntersectionObserver
  useEffect(() => {
    const sectionElements = sections.map((section) =>
      document.getElementById(section.id)
    )

    observerRef.current = new IntersectionObserver(
      handleScrollspyIntersection,
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
  }, [sections, handleScrollspyIntersection])

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

            {/* Right: Interactive Map */}
            <div className="w-[550px] h-[550px] border border-border rounded overflow-hidden">
              <MapView
                visibleConstraints={new Set()}
                constraints={[]}
                propertyBoundary={propertyBoundary}
                center={[51.5058, -0.0981]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Header Container */}
      <div className="sticky top-0 z-40 border-b border-border bg-background">
        <div className="mx-auto max-w-[1100px] px-4">
          {/* Condensed Header - Appears when hero collapses */}
          <div
            className={`transition-all ${
              isHeroCollapsed ? 'pt-3' : 'h-0 overflow-hidden opacity-0'
            }`}
          >
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-foreground">{address}</h2>
              <span className="text-base text-muted-foreground">{reference}</span>
            </div>
          </div>

          {/* Section Navigation */}
          <nav className="flex gap-6" aria-label="Application sections" role="navigation">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(section.id)
                }}
                className={`relative border-b-[3px] py-3 text-base transition-colors ${
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

      {/* Main Content */}
      <div className="mx-auto max-w-[1100px] px-4 py-8">
        {children}
        {/* Bottom padding to ensure last sections can scroll into view */}
        <div className="h-[75vh]" aria-hidden="true" />
      </div>
    </div>
  )
}
