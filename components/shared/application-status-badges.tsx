interface ApplicationStatusBadgesProps {
  status: string
  daysToDecision: number
  size?: 'default' | 'compact'
}

export function ApplicationStatusBadges({
  status,
  daysToDecision,
  size = 'default',
}: ApplicationStatusBadgesProps) {
  const sizeClasses = {
    default: 'text-base px-3 py-1',
    compact: 'text-xs px-3 py-1',
  }

  const textSize = sizeClasses[size]

  return (
    <div className="flex items-center gap-2">
      <span className={`bg-blue-100 ${textSize} font-medium text-blue-800`}>
        {status}
      </span>
      <span className={`bg-yellow-100 ${textSize} font-medium text-yellow-800`}>
        {daysToDecision} days to determination date
      </span>
    </div>
  )
}
