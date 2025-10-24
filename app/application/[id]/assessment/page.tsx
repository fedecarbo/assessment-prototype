import { notFound } from 'next/navigation'
import { getApplicationById, mockApplications } from '@/lib/mock-data'
import { AssessmentLayout } from '@/components/shared/assessment-layout'
import { AssessmentContent } from '@/components/shared/assessment-content'
import { FutureAssessmentContent } from '@/components/shared/future-assessment-content'

// Feature flag to switch between versions
const TASK_PANEL_VERSION = process.env.NEXT_PUBLIC_TASK_PANEL_VERSION || 'current'

interface AssessmentPageProps {
  params: Promise<{ id: string }>
}

// Generate static params for all mock applications
export async function generateStaticParams() {
  return mockApplications.map((application) => ({
    id: application.id,
  }))
}

export default async function AssessmentPage({ params }: AssessmentPageProps) {
  const { id } = await params
  const application = getApplicationById(id)

  if (!application) {
    notFound()
  }

  // Conditionally render content based on version flag
  const ContentComponent = TASK_PANEL_VERSION === 'future' ? FutureAssessmentContent : AssessmentContent

  return (
    <AssessmentLayout
      applicationId={application.id}
      address={application.address}
      reference={application.reference}
      description={application.description}
    >
      <ContentComponent />
    </AssessmentLayout>
  )
}
