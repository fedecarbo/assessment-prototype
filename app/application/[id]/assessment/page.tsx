'use client'

import { useParams } from 'next/navigation'
import { notFound } from 'next/navigation'
import { getApplicationById } from '@/lib/mock-data'
import { AssessmentLayout } from '@/components/shared/assessment-layout'
import { AssessmentContent } from '@/components/shared/assessment-content'
import { FutureAssessmentContent } from '@/components/shared/future-assessment-content'
import { VersionToggle, getCurrentVersion } from '@/components/shared/version-toggle'
import { useState, useEffect } from 'react'

export default function AssessmentPage() {
  const params = useParams()
  const id = params.id as string
  const application = getApplicationById(id)

  const [version, setVersion] = useState<'current' | 'future'>('current')

  useEffect(() => {
    setVersion(getCurrentVersion())
  }, [])

  if (!application) {
    notFound()
  }

  return (
    <>
      <AssessmentLayout
        applicationId={application.id}
        address={application.address}
        reference={application.reference}
        description={application.description}
        applicantRequests={application.applicantRequests}
      >
        {version === 'future' ? (
          <FutureAssessmentContent application={application} />
        ) : (
          <AssessmentContent application={application} />
        )}
      </AssessmentLayout>
      <VersionToggle />
    </>
  )
}
