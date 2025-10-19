import { notFound } from 'next/navigation'
import { getApplicationById } from '@/lib/mock-data'
import { AssessmentLayout } from '@/components/shared/assessment-layout'
import { AssessmentContent } from '@/components/shared/assessment-content'

interface AssessmentPageProps {
  params: Promise<{ id: string }>
}

export default async function AssessmentPage({ params }: AssessmentPageProps) {
  const { id } = await params
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
    >
      <AssessmentContent />
    </AssessmentLayout>
  )
}
