import { Badge } from '@/components/ui/badge'
import type { NeighbourConsultation } from '@/lib/mock-data/schemas'

interface NeighbourConsultationProps {
  consultation: NeighbourConsultation
}

export function NeighbourConsultation({ consultation }: NeighbourConsultationProps) {
  const responseRate = consultation.totalNotified > 0
    ? Math.round((consultation.totalResponses / consultation.totalNotified) * 100)
    : 0

  // Filter to only show topics with comments, sorted by count descending
  const topicsWithComments = consultation.topicSummaries
    .filter(topic => topic.count > 0)
    .sort((a, b) => b.count - a.count)

  return (
    <div className="space-y-6">
      {/* Compact Statistics Line */}
      <div className="text-base text-muted-foreground">
        <span className="text-foreground font-medium">{consultation.totalNotified}</span> notified
        {' • '}
        <span className="text-foreground font-medium">{consultation.totalResponses}</span> responses ({responseRate}%)
        {' • '}
        <span className="text-red-600 dark:text-red-400 font-medium">{consultation.objectCount}</span> object
        {' • '}
        <span className="text-green-600 dark:text-green-400 font-medium">{consultation.supportCount}</span> support
        {' • '}
        <span className="text-foreground font-medium">{consultation.neutralCount}</span> neutral
      </div>

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
    </div>
  )
}
