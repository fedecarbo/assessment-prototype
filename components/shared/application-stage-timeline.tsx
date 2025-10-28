import type { PlanningApplication } from '@/lib/mock-data/schemas'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

interface ApplicationStageTimelineProps {
  application: PlanningApplication
}

function getStatusBadge(status: string, isBlocked: boolean = false) {
  if (isBlocked) {
    return (
      <Badge variant="muted">
        Cannot start yet
      </Badge>
    )
  }

  switch (status) {
    case 'validated':
    case 'completed':
      return (
        <Badge variant="white">
          Completed
        </Badge>
      )
    case 'in-progress':
    case 'pending':
      return (
        <Badge variant="light-blue">
          In progress
        </Badge>
      )
    case 'not-started':
    default:
      return (
        <Badge variant="blue">
          Not started
        </Badge>
      )
  }
}

export function ApplicationStageTimeline({ application }: ApplicationStageTimelineProps) {
  return (
    <div>
      <h2 id="progress-heading" className="text-xl font-bold text-foreground mb-6">
        Timeline
      </h2>

      <div className="space-y-6">
        {/* 1. Validation Stage */}
        <div>
          <h4 className="text-base font-semibold mb-4">Validation</h4>
          <div className="flex items-center justify-between py-[0.625rem] border-t border-b border-border">
            <Link
              href={`/application/${application.id}/validation`}
              className="text-base text-primary hover:text-foreground underline underline-offset-4 transition-colors"
            >
              Check and validate
            </Link>
            <div>
              {getStatusBadge(application.validation.status)}
            </div>
          </div>
        </div>

        {/* 2. Consultation Stage */}
        <div>
          <h4 className="text-base font-semibold mb-4">Consultation</h4>
          <div className="flex items-center justify-between py-[0.625rem] border-t border-b border-border">
            <Link
              href={`/application/${application.id}/consultation`}
              className="text-base text-primary hover:text-foreground underline underline-offset-4 transition-colors"
            >
              Consultees, neighbours and publicity
            </Link>
            <div>
              {getStatusBadge(application.consultation.status)}
            </div>
          </div>
        </div>

        {/* 3. Assessment Stage */}
        <div>
          <h4 className="text-base font-semibold mb-4">Assessment</h4>
          <div className="flex items-center justify-between py-[0.625rem] border-t border-b border-border">
            <Link
              href={`/application/${application.id}/assessment`}
              className="text-base text-primary hover:text-foreground underline underline-offset-4 transition-colors"
            >
              Check and assess
            </Link>
            <div>
              {getStatusBadge(application.assessment.status)}
            </div>
          </div>
        </div>

        {/* 4. Review Stage */}
        <div>
          <h4 className="text-base font-semibold mb-4">Review</h4>
          <div>
            <div className="flex items-center justify-between py-[0.625rem] border-t border-border">
              <div>
                {application.assessment.status === 'completed' ? (
                  <Link
                    href={`/application/${application.id}/review`}
                    className="text-base text-primary hover:text-foreground underline underline-offset-4 transition-colors"
                  >
                    View recommendation
                  </Link>
                ) : (
                  <span className="text-base text-muted-foreground">
                    View recommendation
                  </span>
                )}
              </div>
              <div>
                {getStatusBadge(application.review.status, application.assessment.status !== 'completed')}
              </div>
            </div>
            <div className="flex items-center justify-between py-[0.625rem] border-t border-b border-border">
              <div>
                {application.assessment.status === 'completed' ? (
                  <Link
                    href={`/application/${application.id}/publish`}
                    className="text-base text-primary hover:text-foreground underline underline-offset-4 transition-colors"
                  >
                    Publish determination
                  </Link>
                ) : (
                  <span className="text-base text-muted-foreground">
                    Publish determination
                  </span>
                )}
              </div>
              <div>
                {getStatusBadge(application.review.status, application.assessment.status !== 'completed')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
