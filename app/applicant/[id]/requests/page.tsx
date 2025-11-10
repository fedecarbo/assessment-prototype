import { notFound } from 'next/navigation'
import { mockApplications } from '@/lib/mock-data/applications'
import { ApplicantRequestsView } from '@/components/shared/applicant-requests-view'

export default function ApplicantRequestsPage({ params }: { params: { id: string } }) {
  const application = mockApplications.find(app => app.id === params.id)

  if (!application) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-8">
      <ApplicantRequestsView application={application} />
    </div>
  )
}
