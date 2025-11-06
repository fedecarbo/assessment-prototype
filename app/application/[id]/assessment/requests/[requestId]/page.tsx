import { notFound } from 'next/navigation'
import { mockApplications } from '@/lib/mock-data/applications'
import { AssessmentLayout } from '@/components/shared/assessment-layout'
import { RequestDetailContent } from '@/components/shared/request-detail-content'

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string; requestId: string }>
}) {
  const { id, requestId } = await params
  const application = mockApplications.find((app) => app.id === id)

  if (!application) {
    notFound()
  }

  const request = application.applicantRequests?.find((req) => req.id === requestId)

  if (!request) {
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
        <RequestDetailContent application={application} request={request} />
      </div>
    </AssessmentLayout>
  )
}
