import type { PlanningApplication, StageTask } from '@/lib/mock-data/schemas'
import { Lock, CheckCircle, Clock, ChevronRight } from 'lucide-react'
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
}

function StageCard({ title, status, tasks, lockedMessage, completedDate, completedLabel, showParallel, applicationId, stageSlug }: StageCardProps) {
  const completedCount = tasks.filter(t => t.completed).length
  const totalCount = tasks.length
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  const getStatusIcon = () => {
    switch (status) {
      case 'locked':
        return <Lock className="h-4 w-4 text-muted-foreground" />
      case 'active':
        return <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
    }
  }

  const getStatusStyles = () => {
    switch (status) {
      case 'locked':
        return {
          container: 'bg-muted/30 border-muted',
          title: 'text-muted-foreground',
          progress: 'bg-muted-foreground/20',
        }
      case 'active':
        return {
          container: 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/50',
          title: 'text-foreground',
          progress: 'bg-blue-600 dark:bg-blue-400',
        }
      case 'completed':
        return {
          container: 'bg-green-50/50 border-green-200 dark:bg-green-950/20 dark:border-green-900/50',
          title: 'text-foreground',
          progress: 'bg-green-600 dark:bg-green-400',
        }
    }
  }

  const styles = getStatusStyles()
  const isClickable = status !== 'locked'

  const cardContent = (
    <>
      <div className="flex items-center gap-2 mb-2">
        {getStatusIcon()}
        <h4 className={`text-base font-semibold ${styles.title}`}>{title}</h4>
        {showParallel && status !== 'locked' && (
          <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
            Parallel
          </span>
        )}
      </div>

      {/* Locked State */}
      {status === 'locked' && lockedMessage && (
        <p className="text-sm text-muted-foreground">{lockedMessage}</p>
      )}

      {/* Active State */}
      {status === 'active' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{completedCount} of {totalCount} tasks completed</span>
            <span className="font-medium text-foreground">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full ${styles.progress} transition-all duration-300`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Completed State */}
      {status === 'completed' && completedDate && (
        <p className="text-sm text-muted-foreground">
          {completedLabel || 'Completed'}: {formatDate(completedDate)}
        </p>
      )}
    </>
  )

  if (isClickable) {
    return (
      <Link
        href={`/application/${applicationId}/${stageSlug}`}
        className={`block rounded-lg border ${styles.container} p-4 transition-colors hover:border-primary/50 group`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {cardContent}
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
        </div>
      </Link>
    )
  }

  return (
    <div className={`rounded-lg border ${styles.container} p-4 transition-colors`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {cardContent}
        </div>
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
      <div className="space-y-4">
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
