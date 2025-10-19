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
      <Badge variant="gray">
        Cannot start yet
      </Badge>
    )
  }

  switch (status) {
    case 'validated':
    case 'completed':
      return (
        <Badge variant="black">
          Completed
        </Badge>
      )
    case 'in-progress':
    case 'pending':
      return (
        <Badge variant="blue">
          In progress
        </Badge>
      )
    case 'not-started':
    default:
      return (
        <Badge variant="gray">
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

      <div className="space-y-0">
        {/* 1. Validation Stage */}
        <div className="flex gap-4">
          {/* Timeline indicator */}
          <div className="flex flex-col items-center pt-1.5">
            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
              application.validation.status === 'validated'
                ? 'bg-foreground'
                : application.validation.status === 'pending'
                ? 'bg-primary'
                : 'bg-transparent border-2 border-muted-foreground'
            }`} />
            <div className={`w-0.5 flex-1 my-2 ${
              application.validation.status === 'validated'
                ? 'bg-foreground'
                : 'bg-border'
            }`} />
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between pb-4 mb-6 border-b border-border">
              <div>
                <h4 className="text-base font-semibold mb-1">Validation</h4>
                {application.validation.status === 'validated' && application.validFrom && (
                  <p className="text-sm text-muted-foreground mb-2">
                    Valid from {formatDate(application.validFrom)}
                  </p>
                )}
                <Link
                  href={`/application/${application.id}/validation`}
                  className="text-base text-primary hover:text-foreground underline underline-offset-4 transition-colors"
                >
                  {application.validation.status === 'validated' ? 'View or change validation' : 'Check and validate'}
                </Link>
              </div>
              <div>
                {getStatusBadge(application.validation.status)}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Consultation Stage */}
        <div className="flex gap-4">
          {/* Timeline indicator */}
          <div className="flex flex-col items-center pt-1.5">
            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
              application.consultation.status === 'completed'
                ? 'bg-foreground'
                : application.consultation.status === 'in-progress'
                ? 'bg-primary'
                : 'bg-transparent border-2 border-muted-foreground'
            }`} />
            <div className={`w-0.5 flex-1 my-2 ${
              application.consultation.status === 'completed'
                ? 'bg-foreground'
                : 'bg-border'
            }`} />
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between pb-4 mb-6 border-b border-border">
              <div>
                <h4 className="text-base font-semibold mb-1">Consultation</h4>
                {(application.consultation.status === 'in-progress' || application.consultation.status === 'completed') && application.consultationEnd && (
                  <p className="text-sm text-muted-foreground mb-2">
                    Consultation ends {formatDate(application.consultationEnd)}
                  </p>
                )}
                <Link
                  href={`/application/${application.id}/consultation`}
                  className="text-base text-primary hover:text-foreground underline underline-offset-4 transition-colors"
                >
                  {application.consultation.status === 'completed' ? 'View or change consultation' : 'Check and consult'}
                </Link>
              </div>
              <div>
                {getStatusBadge(application.consultation.status)}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Assessment Stage */}
        <div className="flex gap-4">
          {/* Timeline indicator */}
          <div className="flex flex-col items-center pt-1.5">
            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
              application.assessment.status === 'completed'
                ? 'bg-foreground'
                : application.assessment.status === 'in-progress'
                ? 'bg-primary'
                : 'bg-transparent border-2 border-muted-foreground'
            }`} />
            <div className={`w-0.5 flex-1 my-2 ${
              application.assessment.status === 'completed'
                ? 'bg-foreground'
                : 'bg-border'
            }`} />
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between pb-4 mb-6 border-b border-border">
              <div>
                <h4 className="text-base font-semibold mb-1">Assessment</h4>
                <Link
                  href={`/application/${application.id}/assessment`}
                  className="text-base text-primary hover:text-foreground underline underline-offset-4 transition-colors"
                >
                  {application.assessment.status === 'completed' ? 'View or change assessment' : 'Check and assess'}
                </Link>
              </div>
              <div>
                {getStatusBadge(application.assessment.status)}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Review Stage */}
        <div className="flex gap-4">
          {/* Timeline indicator */}
          <div className="flex flex-col items-center pt-1.5">
            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
              application.review.status === 'completed'
                ? 'bg-foreground'
                : application.review.status === 'in-progress'
                ? 'bg-primary'
                : 'bg-transparent border-2 border-muted-foreground'
            }`} />
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between pb-4">
              <div>
                <h4 className="text-base font-semibold mb-1">Review and decision</h4>
                {application.expiryDate && (
                  <p className="text-sm text-muted-foreground mb-2">
                    Expiry date {formatDate(application.expiryDate)}
                  </p>
                )}
                {application.assessment.status === 'completed' ? (
                  <Link
                    href={`/application/${application.id}/review`}
                    className="text-base text-primary hover:text-foreground underline underline-offset-4 transition-colors"
                  >
                    {application.review.status === 'completed' ? 'View or change decision' : 'Review and decide'}
                  </Link>
                ) : (
                  <span className="text-base text-muted-foreground">
                    Review and decide
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
