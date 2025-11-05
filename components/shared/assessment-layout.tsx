'use client'

import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'
import { SiteHeader } from './site-header'
import { Breadcrumbs } from './breadcrumbs'
import { CaseSummaryHeader } from './case-summary-header'
import { TaskPanel } from './task-panel'
import { AssessmentProvider, useAssessment } from './assessment-context'
import { FutureAssessmentProvider, useFutureAssessment } from './future-assessment-context'
import { getCurrentVersion } from './version-toggle'
import type { ApplicantRequest } from '@/lib/mock-data/schemas'

interface AssessmentLayoutProps {
  applicationId: string
  address: string
  reference: string
  description?: string
  applicantRequests?: ApplicantRequest[]
  children: ReactNode
}

function AssessmentLayoutContent({
  applicationId,
  address,
  reference,
  description,
  applicantRequests = [],
  children,
}: AssessmentLayoutProps) {
  const [version, setVersion] = useState<'current' | 'future'>('current')

  useEffect(() => {
    setVersion(getCurrentVersion())
  }, [])

  // Use appropriate context based on version
  const currentContext = version === 'current' ? useAssessment() : null
  const futureContext = version === 'future' ? useFutureAssessment() : null

  const activeContext = version === 'future' ? futureContext : currentContext
  const { selectedTaskId, setSelectedTaskId } = activeContext!
  const contentScrollRef = version === 'future' ? futureContext!.contentScrollRef : currentContext!.contentScrollRef
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Application Details', href: `/application/${applicationId}` },
    { label: 'Check and assess' },
  ]

  // Calculate applicant request counts
  const pendingRequestsCount = applicantRequests.filter(req => req.status === 'pending').length
  const hasNewResponses = applicantRequests.some(req => req.response && !req.viewedByOfficer)

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
        <TaskPanel
          selectedTaskId={selectedTaskId}
          onTaskSelect={setSelectedTaskId}
          applicationId={applicationId}
          applicantRequestsCount={pendingRequestsCount}
          hasNewResponses={hasNewResponses}
        />

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
  // Wrap with both providers to avoid hook conditional errors
  return (
    <AssessmentProvider>
      <FutureAssessmentProvider>
        <AssessmentLayoutContent {...props} />
      </FutureAssessmentProvider>
    </AssessmentProvider>
  )
}
