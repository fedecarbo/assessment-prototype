import { SiteHeader } from "@/components/shared/site-header"
import { CaseSummaryHeader } from "@/components/shared/case-summary-header"
import { ApplicationInfoLayout } from "@/components/shared/application-info-layout"
import { mockApplications } from "@/lib/mock-data/applications"

interface ApplicationInformationPageProps {
  params: Promise<{
    id: string
  }>
}

// Generate static params for all mock applications
export async function generateStaticParams() {
  return mockApplications.map((application) => ({
    id: application.id,
  }))
}

export default async function ApplicationInformationPage({ params }: ApplicationInformationPageProps) {
  const { id } = await params

  // Get application data from mock data (fallback to first application if not found)
  const application = mockApplications.find(app => app.id === id) || mockApplications[0]

  if (!application) {
    return <div>Application not found</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader variant="constrained" />
      <CaseSummaryHeader
        reference={application.reference}
        address={application.address}
        description={application.description}
        variant="info"
        constrained={true}
      />
      <ApplicationInfoLayout application={application} />
    </div>
  )
}
