interface StatisticItem {
  label: string
  value: number
  className?: string
}

interface ConsultationStatisticsProps {
  items: StatisticItem[]
}

/**
 * Compact statistics line component for consultation summaries
 * Renders inline metrics with bullet separators
 */
export function ConsultationStatistics({ items }: ConsultationStatisticsProps) {
  return (
    <div className="text-base text-muted-foreground">
      {items.map((item, index) => (
        <span key={item.label}>
          {index > 0 && ' • '}
          <span className={item.className || 'text-foreground font-medium'}>
            {item.value}
          </span>{' '}
          {item.label}
        </span>
      ))}
    </div>
  )
}
