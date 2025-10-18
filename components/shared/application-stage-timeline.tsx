import type { PlanningApplication } from '@/lib/mock-data/schemas'
import Link from 'next/link'

interface ApplicationStageTimelineProps {
  application: PlanningApplication
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

function getStatusLabel(status: string, isBlocked: boolean = false): string {
  if (isBlocked) {
    return 'Cannot start yet'
  }

  switch (status) {
    case 'validated':
    case 'completed':
      return 'Completed'
    case 'in-progress':
    case 'pending':
      return 'In progress'
    case 'not-started':
      return 'Not started'
    default:
      return 'Not started'
  }
}

export function ApplicationStageTimeline({ application }: ApplicationStageTimelineProps) {
  return (
    <div>
      <h2 id="progress-heading" className="text-xl font-bold text-foreground mb-6">
        Application Progress
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
                <h4 className="text-base font-semibold mb-2">Validation</h4>
                <Link
                  href={`/application/${application.id}/validation`}
                  className="text-base text-primary hover:text-foreground underline underline-offset-4 transition-colors"
                >
                  {application.validation.status === 'validated' ? 'View or change validation' : 'Check and validate'}
                </Link>
              </div>
              <div className="text-sm text-muted-foreground">
                {getStatusLabel(application.validation.status)}
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
                <h4 className="text-base font-semibold mb-2">Consultation</h4>
                <Link
                  href={`/application/${application.id}/consultation`}
                  className="text-base text-primary hover:text-foreground underline underline-offset-4 transition-colors"
                >
                  {application.consultation.status === 'completed' ? 'View or change consultation' : 'Check and consult'}
                </Link>
              </div>
              <div className="text-sm text-muted-foreground">
                {getStatusLabel(application.consultation.status)}
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
                <h4 className="text-base font-semibold mb-2">Assessment</h4>
                <Link
                  href={`/application/${application.id}/assessment`}
                  className="text-base text-primary hover:text-foreground underline underline-offset-4 transition-colors"
                >
                  {application.assessment.status === 'completed' ? 'View or change assessment' : 'Check and assess'}
                </Link>
              </div>
              <div className="text-sm text-muted-foreground">
                {getStatusLabel(application.assessment.status)}
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
                <h4 className="text-base font-semibold mb-2">Review and decision</h4>
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
              <div className="text-sm text-muted-foreground">
                {getStatusLabel(application.review.status, application.assessment.status !== 'completed')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
