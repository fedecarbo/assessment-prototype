import { notFound } from 'next/navigation'
import { mockApplications } from '@/lib/mock-data/applications'
import { AssessmentLayout } from '@/components/shared/assessment-layout'
import { CreateRequestContent } from '@/components/shared/create-request-content'

export default async function NewRequestPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const application = mockApplications.find((app) => app.id === id)

  if (!application) {
    notFound()
  }

  return (
    <AssessmentLayout application={application}>
      <div className="py-8">
        <CreateRequestContent application={application} />
      </div>
    </AssessmentLayout>
  )
}
