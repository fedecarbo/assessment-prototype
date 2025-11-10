import { notFound } from 'next/navigation'
import { mockApplications } from '@/lib/mock-data/applications'
import { ApplicantTimelineView } from '@/components/shared/applicant-timeline-view'

export default function ApplicantTimelinePage({ params }: { params: { id: string } }) {
  const application = mockApplications.find(app => app.id === params.id)

  if (!application) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-8">
      <ApplicantTimelineView application={application} />
    </div>
  )
}
