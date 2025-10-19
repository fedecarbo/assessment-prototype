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
  const { selectedTaskId, setSelectedTaskId } = useAssessment()
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
        <Breadcrumbs items={breadcrumbItems} />

        {/* Case Summary Header - Full width */}
        <CaseSummaryHeader reference={reference} address={address} description={description} />
      </div>

      {/* Scrollable Content Area - Two column layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Task Panel - Fixed 320px with independent scroll */}
        <TaskPanel selectedTaskId={selectedTaskId} onTaskSelect={setSelectedTaskId} />

        {/* Right: Main Content - Centered with max-width 1100px and independent scroll */}
        <main className="flex flex-1 justify-center overflow-y-auto">
          <div className="w-full max-w-[1100px]">
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
