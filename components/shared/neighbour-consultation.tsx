import { Badge } from '@/components/ui/badge'
import type { NeighbourConsultation } from '@/lib/mock-data/schemas'
import Link from 'next/link'
import { calculateResponseRate } from '@/lib/utils'
import { ConsultationStatistics } from './consultation-statistics'

interface NeighbourConsultationProps {
  consultation: NeighbourConsultation
  applicationId: string
}

export function NeighbourConsultation({ consultation, applicationId }: NeighbourConsultationProps) {
  const responseRate = calculateResponseRate(consultation.totalResponses, consultation.totalNotified)

  // Filter to only show topics with comments, sorted by count descending
  const topicsWithComments = consultation.topicSummaries
    .filter(topic => topic.count > 0)
    .sort((a, b) => b.count - a.count)

  const statistics = [
    { label: 'notified', value: consultation.totalNotified },
    { label: `responses (${responseRate}%)`, value: consultation.totalResponses },
    { label: 'object', value: consultation.objectCount },
    { label: 'support', value: consultation.supportCount },
    { label: 'neutral', value: consultation.neutralCount },
  ]

  return (
    <div className="space-y-6">
      <ConsultationStatistics items={statistics} />

      {/* Two Column Layout: Topic List (Left) + AI Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Most Commented Topics */}
        {topicsWithComments.length > 0 && (
          <div>
            <h4 className="text-base font-semibold text-foreground mb-4">Most commented topics</h4>
            <div className="space-y-0">
              {topicsWithComments.map((topic, index) => {
                const isLast = index === topicsWithComments.length - 1
                return (
                  <div
                    key={topic.topic}
                    className={`flex items-center justify-between py-4 ${!isLast ? 'border-b border-border' : ''}`}
                  >
                    <span className="text-base text-foreground">{topic.label}</span>
                    <span className="text-base font-medium text-foreground">{topic.count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Right Column: AI Summary */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h4 className="text-base font-semibold text-foreground">Summary</h4>
            <Badge variant="gray" size="small">AI generated</Badge>
          </div>
          <p className="text-foreground leading-relaxed">{consultation.briefSummary}</p>
        </div>
      </div>

      {/* Link to view all comments */}
      <div>
        <Link
          href={`/application/${applicationId}/neighbours`}
          className="text-base text-primary underline underline-offset-4"
        >
          View all neighbour comments ({consultation.totalResponses})
        </Link>
      </div>
    </div>
  )
}
