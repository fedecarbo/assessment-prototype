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

export function ApplicationStageTimeline({ application }: ApplicationStageTimelineProps) {
  const isValidated = application.validation.status === 'validated'
  const consultationDone = application.consultation.status === 'completed'
  const assessmentDone = application.assessment.status === 'completed'
  const bothParallelDone = consultationDone && assessmentDone

  return (
    <div>
      <h2 id="progress-heading" className="text-xl font-bold text-foreground mb-4">
        Application Progress
      </h2>

      <div className="space-y-0">
        {/* 1. Validation Stage */}
        <div className="flex gap-4">
          {/* Timeline indicator */}
          <div className="flex flex-col items-center pt-1">
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
          <div className="flex-1 pb-8">
            <h4 className="text-base font-semibold mb-1">Validation</h4>
            {application.validation.status === 'validated' && application.validation.validatedDate && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground mb-2">
                  Valid from {formatDate(application.validation.validatedDate)}
                </p>
                <Link
                  href={`/application/${application.id}/validation`}
                  className="text-sm text-primary hover:text-foreground transition-colors"
                >
                  View or change validation
                </Link>
              </div>
            )}
            {application.validation.status === 'pending' && (
              <div className="mt-2">
                <p className="text-muted-foreground mb-4">
                  Check all required documents are present and the application meets validation criteria.
                </p>
                <Link
                  href={`/application/${application.id}/validation`}
                  className="text-base text-primary hover:text-foreground transition-colors"
                >
                  Start validation
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* 2. Consultation Stage */}
        <div className="flex gap-4">
          {/* Timeline indicator */}
          <div className="flex flex-col items-center pt-1">
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
          <div className="flex-1 pb-8">
            <h4 className="text-base font-semibold mb-1">Consultation</h4>
            {application.consultation.status === 'completed' && application.consultation.endDate && (
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-muted-foreground">
                    Consultation end {formatDate(application.consultation.endDate)}
                  </span>
                  <Link
                    href={`/application/${application.id}/consultation`}
                    className="text-sm text-primary hover:text-foreground transition-colors"
                  >
                    Change
                  </Link>
                </div>
              </div>
            )}
            {application.consultation.status === 'in-progress' && (
              <div className="mt-2 space-y-3">
                {application.consultation.endDate && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Consultation end {formatDate(application.consultation.endDate)}
                    </span>
                    <Link
                      href={`/application/${application.id}/consultation/change-date`}
                      className="text-sm text-primary hover:text-foreground transition-colors"
                    >
                      Change
                    </Link>
                  </div>
                )}
                <p className="text-muted-foreground">
                  Notify statutory consultees and neighbours. Review consultation responses and prepare summary.
                </p>
                <Link
                  href={`/application/${application.id}/consultation`}
                  className="text-base text-primary hover:text-foreground transition-colors"
                >
                  Continue consultation
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* 3. Assessment Stage */}
        <div className="flex gap-4">
          {/* Timeline indicator */}
          <div className="flex flex-col items-center pt-1">
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
          <div className="flex-1 pb-8">
            <h4 className="text-base font-semibold mb-1">Assessment</h4>
            {application.assessment.status === 'completed' && application.assessment.completedDate && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground mb-2">
                  Completed on {formatDate(application.assessment.completedDate)}
                </p>
                <Link
                  href={`/application/${application.id}/assessment`}
                  className="text-sm text-primary hover:text-foreground transition-colors"
                >
                  View or change assessment
                </Link>
              </div>
            )}
            {application.assessment.status === 'in-progress' && (
              <div className="mt-2">
                <p className="text-muted-foreground mb-4">
                  Review planning policy compliance, design quality, and neighbour impacts. Prepare recommendation report.
                </p>
                <Link
                  href={`/application/${application.id}/assessment`}
                  className="text-base text-primary hover:text-foreground transition-colors"
                >
                  Continue assessment
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* 4. Review Stage */}
        <div className="flex gap-4">
          {/* Timeline indicator */}
          <div className="flex flex-col items-center pt-1">
            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
              application.review.status === 'completed'
                ? 'bg-foreground'
                : application.review.status === 'in-progress'
                ? 'bg-primary'
                : 'bg-transparent border-2 border-muted-foreground'
            }`} />
            <div className={`w-0.5 flex-1 my-2 ${
              application.review.status === 'completed'
                ? 'bg-foreground'
                : 'bg-border'
            }`} />
          </div>

          {/* Content */}
          <div className="flex-1 pb-8">
            <h4 className="text-base font-semibold mb-1">Review and decision</h4>
            {application.review.status === 'completed' && application.review.completedDate && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground mb-2">
                  Decision made on {formatDate(application.review.completedDate)}
                </p>
                <Link
                  href={`/application/${application.id}/review`}
                  className="text-sm text-primary hover:text-foreground transition-colors"
                >
                  View or change decision
                </Link>
              </div>
            )}
            {application.review.status === 'in-progress' && (
              <div className="mt-2">
                <p className="text-muted-foreground mb-4">
                  Final review of assessment and consultation. Make decision and prepare decision notice.
                </p>
                <Link
                  href={`/application/${application.id}/review`}
                  className="text-base text-primary hover:text-foreground transition-colors"
                >
                  Review and decide
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* 5. Expiry Date */}
        <div className="flex gap-4">
          {/* Timeline indicator */}
          <div className="flex flex-col items-center pt-1">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-transparent border-2 border-muted-foreground" />
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-base font-semibold">Expires {formatDate(application.expiryDate)}</h4>
              <Link
                href={`/application/${application.id}/request-extension`}
                className="text-sm text-primary hover:text-foreground transition-colors"
              >
                Request extension
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
