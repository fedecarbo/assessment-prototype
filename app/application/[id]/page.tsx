import { SiteHeader } from "@/components/shared/site-header"
import { ApplicationDetailLayout } from "@/components/shared/application-detail-layout"
import { ApplicationSections } from "@/components/shared/application-sections"
import { mockApplications } from "@/lib/mock-data/applications"

interface ApplicationDetailsPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ApplicationDetailsPage({ params }: ApplicationDetailsPageProps) {
  const { id } = await params

  // Get application data from mock data (fallback to first application if not found)
  const application = mockApplications.find(app => app.id === id) || mockApplications[0]

  if (!application) {
    return <div>Application not found</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <ApplicationDetailLayout
        applicationId={application.id}
        address={application.address}
        reference={application.reference}
        status="In assessment"
        daysToDecision={12}
      >
        <ApplicationSections application={application} />
      </ApplicationDetailLayout>
    </div>
  )
}
