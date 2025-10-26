import { notFound } from 'next/navigation'
import { mockApplications } from '@/lib/mock-data/applications'
import { SiteHeader } from '@/components/shared/site-header'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { ManageApplicationContent } from '@/components/shared/manage-application-content'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ManageApplicationPage({ params }: PageProps) {
  const { id } = await params
  const application = mockApplications.find((app) => app.id === id)

  if (!application) {
    notFound()
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Application details', href: `/application/${id}` },
    { label: 'Manage application', href: `/application/${id}/manage` },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Site Header */}
      <SiteHeader variant="full" />

      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} variant="full" />

      {/* Page Header */}
      <div className="border-b border-border bg-background">
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">Manage application</h1>
            <p className="text-sm text-muted-foreground">
              {application.reference} · {application.address}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-muted/30">
        <div className="max-w-screen-xl mx-auto px-4 py-8">
          <ManageApplicationContent application={application} />
        </div>
      </div>
    </div>
  )
}
