import { SiteHeader } from "@/components/shared/site-header"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { ApplicationDetailLayout } from "@/components/shared/application-detail-layout"
import { ApplicationSections } from "@/components/shared/application-sections"
import { mockApplications } from "@/lib/mock-data/applications"

interface ApplicationDetailsPageProps {
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

export default async function ApplicationDetailsPage({ params }: ApplicationDetailsPageProps) {
  const { id } = await params

  // Get application data from mock data (fallback to first application if not found)
  const application = mockApplications.find(app => app.id === id) || mockApplications[0]

  if (!application) {
    return <div>Application not found</div>
  }

  // Calculate counts
  const documentsCount = application.documents?.length || 0
  const constraintsCount = application.constraints?.filter(
    (c) => c.status === 'applies' || c.status === 'nearby' || c.status === 'partial'
  ).length || 0

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Application details' },
        ]}
      />

      <ApplicationDetailLayout
        applicationId={application.id}
        address={application.address}
        reference={application.reference}
        status="In assessment"
        daysToDecision={12}
        documentsCount={documentsCount}
        constraintsCount={constraintsCount}
        constraints={application.constraints}
        propertyBoundary={application.propertyBoundary}
      >
        <ApplicationSections application={application} />
      </ApplicationDetailLayout>
    </div>
  )
}
