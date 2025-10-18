import type { PlanningApplication, StageTask } from '@/lib/mock-data/schemas'
import { Lock, Clock } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

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

function isDateSoon(dateString: string, daysThreshold: number = 7): boolean {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= daysThreshold && diffDays > 0
}

interface StageCardProps {
  title: string
  status: 'locked' | 'active' | 'completed'
  tasks: StageTask[]
  lockedMessage?: string
  completedDate?: string
  completedLabel?: string
  showParallel?: boolean
  applicationId: string
  stageSlug: string
  isLast?: boolean
}

function StageCard({ title, status, tasks, lockedMessage, completedDate, completedLabel, showParallel, applicationId, stageSlug, isLast }: StageCardProps) {
  const completedCount = tasks.filter(t => t.completed).length
  const totalCount = tasks.length
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  const getStatusIcon = () => {
    switch (status) {
      case 'locked':
        return <Lock className="h-4 w-4 text-muted-foreground" />
      case 'active':
      case 'completed':
        return <Clock className="h-4 w-4 text-primary" />
    }
  }

  const getTitleColor = () => {
    return status === 'locked' ? 'text-muted-foreground' : 'text-foreground'
  }

  const getTimelineStyles = () => {
    // Grey circles - filled when completed, outlined when not
    const isCompleted = status === 'completed'
    return {
      circle: isCompleted
        ? 'bg-muted-foreground border-muted-foreground'
        : 'bg-transparent border-muted-foreground/40',
      line: 'bg-muted-foreground/20'
    }
  }

  const timelineStyles = getTimelineStyles()

  const getActionButton = () => {
    if (status === 'locked') return null

    if (status === 'completed') {
      return (
        <Link
          href={`/application/${applicationId}/${stageSlug}`}
          className="text-sm text-primary hover:text-foreground transition-colors inline-flex items-center gap-1"
        >
          View or change {title.toLowerCase()}
        </Link>
      )
    }

    if (status === 'active') {
      const actionText = {
        'Validation': 'Check validation',
        'Consultation': 'Review consultation',
        'Assessment': 'Check and assess',
        'Review': 'Review and approve'
      }[title] || `Continue ${title.toLowerCase()}`

      return (
        <Button asChild>
          <Link href={`/application/${applicationId}/${stageSlug}`}>
            {actionText}
          </Link>
        </Button>
      )
    }
  }

  const content = (
    <>
      <div className="flex items-center gap-2 mb-2">
        {getStatusIcon()}
        <h4 className={`text-base font-semibold ${getTitleColor()}`}>{title}</h4>
        {showParallel && status !== 'locked' && (
          <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
            Parallel
          </span>
        )}
      </div>

      {/* Locked State */}
      {status === 'locked' && lockedMessage && (
        <p className="text-sm text-muted-foreground mb-3">{lockedMessage}</p>
      )}

      {/* Active State */}
      {status === 'active' && (
        <div className="space-y-3 mb-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{completedCount} of {totalCount} tasks completed</span>
            <span className="font-medium text-foreground">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Completed State */}
      {status === 'completed' && completedDate && (
        <p className="text-sm text-muted-foreground mb-3">
          {completedLabel || 'Completed'}: {formatDate(completedDate)}
        </p>
      )}

      {/* Action Button/Link */}
      {getActionButton()}
    </>
  )

  // Timeline wrapper with vertical line and node - flat design with content-side border
  return (
    <div className="flex gap-4 mb-8 last:mb-0">
      {/* Timeline column */}
      <div className="relative flex flex-col items-center w-10 flex-shrink-0">
        {/* Circle node */}
        <div className={`w-2.5 h-2.5 rounded-full border-2 ${timelineStyles.circle} mt-1.5 z-10`} />

        {/* Vertical connecting line (hidden for last item) */}
        {!isLast && (
          <div className={`w-0.5 flex-1 ${timelineStyles.line} mt-1`} />
        )}
      </div>

      {/* Content column with bottom border separator */}
      <div className="flex-1 pb-6 border-b border-border">
        {content}
      </div>
    </div>
  )
}

export function ApplicationStageTimeline({ application }: ApplicationStageTimelineProps) {
  const isValidated = application.validation.status === 'validated'
  const consultationDone = application.consultation.status === 'completed'
  const assessmentDone = application.assessment.status === 'completed'
  const bothParallelDone = consultationDone && assessmentDone

  return (
    <div>
      <h3 className="mb-4 text-base font-semibold text-foreground">Application Progress</h3>
      <div>
        {/* 1. Validation Stage */}
        <StageCard
          title="Validation"
          status={
            application.validation.status === 'validated' ? 'completed' :
            application.validation.status === 'pending' ? 'active' : 'locked'
          }
          tasks={application.validation.tasks}
          completedDate={application.validation.validatedDate}
          completedLabel="Validated on"
          applicationId={application.id}
          stageSlug="validation"
          isLast={false}
        />

        {/* 2. Consultation Stage (Parallel) */}
        <StageCard
          title="Consultation"
          status={
            !isValidated ? 'locked' :
            application.consultation.status === 'completed' ? 'completed' :
            application.consultation.status === 'in-progress' ? 'active' : 'locked'
          }
          tasks={application.consultation.tasks}
          lockedMessage="Cannot start until validation is complete"
          completedDate={application.consultation.endDate}
          completedLabel="Completed on"
          showParallel={isValidated}
          applicationId={application.id}
          stageSlug="consultation"
          isLast={false}
        />

        {/* 3. Assessment Stage (Parallel) */}
        <StageCard
          title="Assessment"
          status={
            !isValidated ? 'locked' :
            application.assessment.status === 'completed' ? 'completed' :
            application.assessment.status === 'in-progress' ? 'active' : 'locked'
          }
          tasks={application.assessment.tasks}
          lockedMessage="Cannot start until validation is complete"
          completedDate={application.assessment.completedDate}
          completedLabel="Completed on"
          showParallel={isValidated}
          applicationId={application.id}
          stageSlug="assessment"
          isLast={false}
        />

        {/* 4. Review Stage */}
        <StageCard
          title="Review"
          status={
            !bothParallelDone ? 'locked' :
            application.review.status === 'completed' ? 'completed' :
            application.review.status === 'in-progress' ? 'active' : 'locked'
          }
          tasks={application.review.tasks}
          lockedMessage="Cannot start until consultation and assessment are complete"
          completedDate={application.review.completedDate}
          completedLabel="Completed on"
          applicationId={application.id}
          stageSlug="review"
          isLast={true}
        />
      </div>

      {/* Expiry Warning */}
      {isDateSoon(application.expiryDate) && (
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/50 dark:bg-amber-900/20">
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-amber-900 dark:text-amber-400">
                Application expires soon
              </div>
              <div className="text-sm text-amber-800 dark:text-amber-500">
                Expiry date: {formatDate(application.expiryDate)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
