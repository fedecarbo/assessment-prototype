import type { RequestedService } from '@/lib/mock-data/schemas'
import { Badge } from '@/components/ui/badge'

interface RequestedServicesProps {
  services: RequestedService[]
}

const serviceLabels: Record<RequestedService, string> = {
  'written-advice': 'Written advice',
  'site-visit': 'Site visit',
  'meeting': 'Meeting',
}

export function RequestedServices({ services }: RequestedServicesProps) {
  if (!services || services.length === 0) {
    return null
  }

  return (
    <div>
      <h3 className="mb-3 text-base font-semibold text-foreground">Requested services</h3>
      <div className="flex flex-wrap gap-2">
        {services.map((service) => (
          <Badge key={service} variant="gray">
            {serviceLabels[service]}
          </Badge>
        ))}
      </div>
    </div>
  )
}
