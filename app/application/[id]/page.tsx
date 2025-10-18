import { SiteHeader } from "@/components/shared/site-header"
import { ApplicationDetailLayout } from "@/components/shared/application-detail-layout"
import { ApplicationSections } from "@/components/shared/application-sections"

interface ApplicationDetailsPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ApplicationDetailsPage({ params }: ApplicationDetailsPageProps) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <ApplicationDetailLayout
        applicationId={id}
        address="11 Abbey Gardens, London, SE16 3RQ"
        reference={id}
        status="In assessment"
        daysToDecision={12}
      >
        <ApplicationSections />
      </ApplicationDetailLayout>
    </div>
  )
}
