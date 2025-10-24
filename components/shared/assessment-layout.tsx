'use client'

import type { ReactNode } from 'react'
import { SiteHeader } from './site-header'
import { Breadcrumbs } from './breadcrumbs'
import { CaseSummaryHeader } from './case-summary-header'
import { TaskPanel } from './task-panel'
import { AssessmentProvider, useAssessment } from './assessment-context'
import { FutureAssessmentProvider, useFutureAssessment } from './future-assessment-context'

// Feature flag to switch between versions
const TASK_PANEL_VERSION = process.env.NEXT_PUBLIC_TASK_PANEL_VERSION || 'current'

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
  // Use appropriate context based on version flag
  const currentContext = TASK_PANEL_VERSION === 'current' ? useAssessment() : null
  const futureContext = TASK_PANEL_VERSION === 'future' ? useFutureAssessment() : null

  const { selectedTaskId, setSelectedTaskId, contentScrollRef } =
    (TASK_PANEL_VERSION === 'future' ? futureContext : currentContext)!
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Application Details', href: `/application/${applicationId}` },
    { label: 'Check and assess' },
  ]

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

      {/* Scrollable Content Area - Two column layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Task Panel - Fixed 338px + 32px padding = 370px total */}
        <TaskPanel selectedTaskId={selectedTaskId} onTaskSelect={setSelectedTaskId} />

        {/* Right: Main Content - Full width with centered 1100px max-width content and 16px padding */}
        <main ref={contentScrollRef} className="flex flex-1 justify-center overflow-y-auto">
          <div className="w-full px-4" style={{ maxWidth: '1100px' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export function AssessmentLayout(props: AssessmentLayoutProps) {
  // Conditionally wrap with the appropriate provider
  const Provider = TASK_PANEL_VERSION === 'future' ? FutureAssessmentProvider : AssessmentProvider

  return (
    <Provider>
      <AssessmentLayoutContent {...props} />
    </Provider>
  )
}
