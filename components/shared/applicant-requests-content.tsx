'use client'

import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { PlanningApplication, ApplicantRequest } from '@/lib/mock-data/schemas'
import { getRequestStatusBadge } from '@/lib/task-utils'

interface ApplicantRequestsContentProps {
  application: PlanningApplication
}

export function ApplicantRequestsContent({ application }: ApplicantRequestsContentProps) {
  const requests = application.applicantRequests || []

  return (
    <>
      {/* Title and Description - constrained to 723px for readability */}
      <div className="max-w-readable">
        <h1 className="text-2xl font-bold text-foreground">Applicant requests</h1>

        <div className="mt-3">
          <p className="text-base leading-relaxed text-muted-foreground">
            Request additional information or documents from the applicant to support your assessment.
            Track all requests and responses in one place.
          </p>
        </div>
      </div>

      {/* Divider - Full width */}
      <Separator className="mt-6" />

      {/* Action Button */}
      <div className="mt-6 max-w-readable">
        <Link href={`/application/${application.id}/assessment/requests/new`}>
          <Button>New request</Button>
        </Link>
      </div>

      {/* Requests List */}
      <div className="mt-6 max-w-readable space-y-4">
        {requests.length === 0 ? (
          <p className="text-sm text-muted-foreground">No requests have been sent yet.</p>
        ) : (
          requests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))
        )}
      </div>
    </>
  )
}

interface RequestCardProps {
  request: ApplicantRequest
}

function RequestCard({ request }: RequestCardProps) {
  // Determine last updated date (response date if available, otherwise sent date)
  const lastUpdatedDate = request.response?.receivedDate || request.sentDate
  const formattedLastUpdated = new Date(lastUpdatedDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })

  // Truncate description to 150 characters for preview
  const shouldTruncate = request.description.length > 150
  const truncatedDescription = shouldTruncate
    ? request.description.substring(0, 150) + '...'
    : request.description

  return (
    <Card className="p-5 rounded-none border-border shadow-none">
      <div className="space-y-3">
        {/* Header: Title and Status */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-base font-bold text-foreground">
            {request.subject}
          </h3>
          {getRequestStatusBadge(request.status)}
        </div>

        {/* Reason (Description) */}
        <div>
          <p className="text-sm font-medium text-foreground">Reason</p>
          <p className="text-sm text-muted-foreground leading-relaxed mt-1">
            {truncatedDescription}
          </p>
        </div>

        {/* Last Updated Date */}
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Last updated:</span> {formattedLastUpdated}
        </div>

        {/* View and Update Link */}
        <div className="pt-2 border-t">
          <Link
            href={`#`}
            className="text-sm text-primary hover:underline"
          >
            View and update
          </Link>
        </div>
      </div>
    </Card>
  )
}
