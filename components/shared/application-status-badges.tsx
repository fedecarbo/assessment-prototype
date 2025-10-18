import { Badge } from '@/components/ui/badge'

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
  const badgeSize = size === 'compact' ? 'small' : 'default'

  return (
    <div className="flex items-center gap-2">
      <Badge variant="blue" size={badgeSize}>
        {status}
      </Badge>
      <Badge variant="yellow" size={badgeSize}>
        {daysToDecision} days to determination date
      </Badge>
    </div>
  )
}
