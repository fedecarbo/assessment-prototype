interface ApplicationTimelineProps {
  validFrom: string
  consultationEnd: string
  expiryDate: string
}

interface Milestone {
  label: string
  date: string
  status: 'past' | 'current' | 'upcoming' | 'warning'
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
  return diffDays <= daysThreshold && diffDays >= 0
}

function getMilestoneStatus(dateString: string, isExpiry: boolean = false): 'past' | 'current' | 'upcoming' | 'warning' {
  const date = new Date(dateString)
  const now = new Date()

  if (date < now) {
    return 'past'
  }

  if (isExpiry && isDateSoon(dateString)) {
    return 'warning'
  }

  // Simple heuristic: if within 3 days, consider it current
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays <= 3 && diffDays >= -3) {
    return 'current'
  }

  return 'upcoming'
}

export function ApplicationTimeline({ validFrom, consultationEnd, expiryDate }: ApplicationTimelineProps) {
  const milestones: Milestone[] = [
    {
      label: 'Valid from',
      date: validFrom,
      status: getMilestoneStatus(validFrom)
    },
    {
      label: 'Consultation end',
      date: consultationEnd,
      status: getMilestoneStatus(consultationEnd)
    },
    {
      label: 'Expiry date',
      date: expiryDate,
      status: getMilestoneStatus(expiryDate, true)
    }
  ]

  const getStatusStyles = (status: Milestone['status']) => {
    switch (status) {
      case 'past':
        return {
          circle: 'bg-muted-foreground/30 border-muted-foreground/30',
          line: 'bg-muted-foreground/20',
          text: 'text-muted-foreground',
          badge: null
        }
      case 'current':
        return {
          circle: 'bg-blue-600 border-blue-600',
          line: 'bg-blue-600/20',
          text: 'text-foreground',
          badge: { text: 'Active', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' }
        }
      case 'warning':
        return {
          circle: 'bg-amber-600 border-amber-600',
          line: 'bg-amber-600/20',
          text: 'text-foreground',
          badge: { text: 'Approaching', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' }
        }
      case 'upcoming':
      default:
        return {
          circle: 'bg-background border-border border-2',
          line: 'bg-border',
          text: 'text-foreground',
          badge: null
        }
    }
  }

  return (
    <div>
      <h3 className="mb-4 text-base font-semibold text-foreground">Application Timeline</h3>
      <div className="space-y-0">
        {milestones.map((milestone, index) => {
          const styles = getStatusStyles(milestone.status)
          const isLast = index === milestones.length - 1

          return (
            <div key={milestone.label} className="relative flex gap-4">
              {/* Timeline line and circle */}
              <div className="flex flex-col items-center">
                {/* Circle */}
                <div className={`relative z-10 h-3 w-3 rounded-full ${styles.circle}`} />

                {/* Connecting line */}
                {!isLast && (
                  <div className={`w-0.5 flex-1 ${styles.line}`} style={{ minHeight: '48px' }} />
                )}
              </div>

              {/* Content */}
              <div className={`flex-1 ${isLast ? 'pb-0' : 'pb-6'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <div className={`text-sm ${styles.text}`}>{milestone.label}</div>
                  {styles.badge && (
                    <span className={`inline-flex items-center px-2 py-0.5 text-xs ${styles.badge.className}`}>
                      {styles.badge.text}
                    </span>
                  )}
                </div>
                <div className="text-base text-foreground">{formatDate(milestone.date)}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
