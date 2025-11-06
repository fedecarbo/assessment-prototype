'use client'

import { useParams } from 'next/navigation'
import { notFound } from 'next/navigation'
import { getApplicationById } from '@/lib/mock-data'
import { AssessmentLayout } from '@/components/shared/assessment-layout'
import { CreateRequestContent } from '@/components/shared/create-request-content'

export default function NewRequestPage() {
  const params = useParams()
  const id = params.id as string
  const application = getApplicationById(id)

  if (!application) {
    notFound()
  }

  return (
    <AssessmentLayout
      applicationId={application.id}
      address={application.address}
      reference={application.reference}
      description={application.description}
      applicantRequests={application.applicantRequests}
    >
      <div className="py-8">
        <CreateRequestContent applicationId={application.id} />
      </div>
    </AssessmentLayout>
  )
}
