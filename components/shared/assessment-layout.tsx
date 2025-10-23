'use client'

import type { ReactNode } from 'react'
import { SiteHeader } from './site-header'
import { Breadcrumbs } from './breadcrumbs'
import { CaseSummaryHeader } from './case-summary-header'
import { TaskPanel } from './task-panel'
import { AssessmentProvider, useAssessment } from './assessment-context'

interface AssessmentLayoutProps {
  applicationId: string
  address: string
  reference: string
  description?: string
  children: ReactNode
}

function AssessmentLayoutContent({
  applicationId,
  address,
  reference,
  description,
  children,
}: AssessmentLayoutProps) {
  const { selectedTaskId, setSelectedTaskId, contentScrollRef } = useAssessment()
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Application Details', href: `/application/${applicationId}` },
    { label: 'Check and assess' },
  ]

  // On mobile: show TaskPanel when no task is selected, show content when task is selected
  // On desktop: always show both side-by-side
  const showTaskPanel = selectedTaskId === 0 // No task selected
  const showContent = selectedTaskId > 0 // Task is selected

  return (
    <div className="flex h-screen flex-col">
      {/* Fixed Headers at Top */}
      <div className="flex-none">
        {/* Site Header - Full width */}
        <SiteHeader variant="full" />

        {/* Breadcrumbs - Full width */}
        <Breadcrumbs items={breadcrumbItems} variant="full" />

        {/* Case Summary Header - Full width */}
        <CaseSummaryHeader reference={reference} address={address} description={description} applicationId={applicationId} />
      </div>

      {/* Scrollable Content Area - Responsive layout */}
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* Left: Task Panel - Full width on mobile, fixed 338px on desktop */}
        {/* Mobile: Show only when no task selected. Desktop: Always show */}
        {/* Mobile: Takes full remaining height and allows scrolling */}
        <div className={`${showTaskPanel ? 'flex' : 'hidden'} md:flex flex-1 md:flex-none overflow-hidden`}>
          <TaskPanel selectedTaskId={selectedTaskId} onTaskSelect={setSelectedTaskId} />
        </div>

        {/* Right: Main Content - Full width on mobile, flex-1 on desktop */}
        {/* Mobile: Show only when task selected. Desktop: Always show */}
        <main
          ref={contentScrollRef}
          className={`${showContent ? 'flex' : 'hidden'} md:flex flex-1 justify-center overflow-y-auto`}
        >
          <div className="w-full px-4" style={{ maxWidth: '1100px' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export function AssessmentLayout(props: AssessmentLayoutProps) {
  return (
    <AssessmentProvider>
      <AssessmentLayoutContent {...props} />
    </AssessmentProvider>
  )
}
