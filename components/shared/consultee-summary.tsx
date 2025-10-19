import { Badge } from '@/components/ui/badge'
import type { ConsulteeConsultation } from '@/lib/mock-data/schemas'
import Link from 'next/link'

interface ConsulteeSummaryProps {
  consultation: ConsulteeConsultation
  applicationId: string
}

export function ConsulteeSummary({ consultation, applicationId }: ConsulteeSummaryProps) {
  const responseRate = consultation.totalConsultees > 0
    ? Math.round((consultation.totalResponses / consultation.totalConsultees) * 100)
    : 0

  // Get consultees sorted by response date (most recent first), with non-responders at the end
  const sortedConsultees = [...consultation.responses].sort((a, b) => {
    if (!a.responseDate && !b.responseDate) return 0
    if (!a.responseDate) return 1
    if (!b.responseDate) return -1
    return new Date(b.responseDate).getTime() - new Date(a.responseDate).getTime()
  })

  // Format position for display
  const getPositionText = (position: string) => {
    switch (position) {
      case 'no-objection': return 'No objection'
      case 'objection': return 'Objection'
      case 'amendments-needed': return 'Amendments needed'
      case 'not-contacted': return 'Not contacted'
      case 'awaiting-response': return 'Awaiting response'
      default: return position
    }
  }

  return (
    <div className="space-y-6">
      {/* Compact Statistics Line */}
      <div className="text-base text-muted-foreground">
        <span className="text-foreground font-medium">{consultation.totalConsultees}</span> consulted
        {' • '}
        <span className="text-foreground font-medium">{consultation.totalResponses}</span> responses ({responseRate}%)
        {consultation.objectionCount > 0 && (
          <>
            {' • '}
            <span className="text-foreground font-medium">{consultation.objectionCount}</span> objection
          </>
        )}
        {consultation.noObjectionCount > 0 && (
          <>
            {' • '}
            <span className="text-foreground font-medium">{consultation.noObjectionCount}</span> no objection
          </>
        )}
        {consultation.amendmentsNeededCount > 0 && (
          <>
            {' • '}
            <span className="text-foreground font-medium">{consultation.amendmentsNeededCount}</span> amendments needed
          </>
        )}
        {consultation.notContactedCount > 0 && (
          <>
            {' • '}
            <span className="text-foreground font-medium">{consultation.notContactedCount}</span> not contacted
          </>
        )}
        {consultation.awaitingResponseCount > 0 && (
          <>
            {' • '}
            <span className="text-foreground font-medium">{consultation.awaitingResponseCount}</span> awaiting response
          </>
        )}
      </div>

      {/* Two Column Layout: Consultee List (Left) + AI Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Consultee List */}
        <div>
          <h4 className="text-base font-semibold text-foreground mb-4">Consultee responses</h4>
          <div className="space-y-0">
            {sortedConsultees.map((consultee, index) => {
              const isLast = index === sortedConsultees.length - 1
              return (
                <div
                  key={consultee.id}
                  className={`flex items-center justify-between py-4 ${!isLast ? 'border-b border-border' : ''}`}
                >
                  <span className="text-base text-foreground">{consultee.consulteeOrg}</span>
                  <span className="text-base font-medium text-foreground">
                    {getPositionText(consultee.position)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Column: AI Summary */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h4 className="text-base font-semibold text-foreground">Summary</h4>
            <Badge variant="gray" size="small">AI generated</Badge>
          </div>
          <p className="text-foreground leading-relaxed">{consultation.briefSummary}</p>
        </div>
      </div>

      {/* Link to view all responses */}
      <div>
        <Link
          href={`/application/${applicationId}/consultees`}
          className="text-base text-primary underline underline-offset-4"
        >
          View all consultee responses ({consultation.totalResponses})
        </Link>
      </div>
    </div>
  )
}
