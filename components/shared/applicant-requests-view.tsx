import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { PlanningApplication } from '@/lib/mock-data/schemas'
import { getRequestStatusBadge } from '@/lib/task-utils'
import { truncateToWords } from '@/lib/utils'

interface ApplicantRequestsViewProps {
  application: PlanningApplication
}

export function ApplicantRequestsView({ application }: ApplicantRequestsViewProps) {
  const requests = application.applicantRequests || []

  return (
    <>
      {/* Title and Description - constrained to 1100px */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Requests</h1>

        <div className="mt-3">
          <p className="text-base leading-relaxed text-muted-foreground">
            View requests from planning officers for additional information or documents about your application.
          </p>
        </div>
      </div>

      {/* Divider - Full width */}
      <Separator className="mt-6" />

      {/* Requests List */}
      <div className="mt-6">
        {requests.length === 0 ? (
          <p className="text-sm text-muted-foreground">No requests have been sent yet.</p>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => {
              const truncatedDescription = truncateToWords(request.description, 150)
              const statusBadge = getRequestStatusBadge(request.status)
              const lastUpdated = request.response?.receivedDate || request.sentDate

              return (
                <Card
                  key={request.id}
                  className="p-5 rounded-none border-border shadow-none hover:border-muted-foreground transition-colors"
                >
                  <div className="space-y-3">
                    {/* Header with Title and Status */}
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="text-base font-bold text-foreground flex-1">
                        {request.subject}
                      </h2>
                      {statusBadge}
                    </div>

                    {/* Metadata: Date and Officer */}
                    <p className="text-sm text-muted-foreground">
                      {new Date(request.sentDate).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })} by {request.sentBy}
                    </p>

                    {/* Description */}
                    <p className="text-sm text-foreground leading-relaxed">
                      {truncatedDescription}
                    </p>

                    {/* Response Section */}
                    {request.response && (
                      <div className="pt-3 border-t space-y-2">
                        <p className="text-sm font-medium text-foreground">Your response:</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {truncateToWords(request.response.message, 150)}
                        </p>
                        {request.response.attachments && request.response.attachments.length > 0 && (
                          <p className="text-sm text-muted-foreground">
                            {request.response.attachments.length} {request.response.attachments.length === 1 ? 'document' : 'documents'} uploaded
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
