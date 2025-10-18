import type { AssignedOfficer } from '@/lib/mock-data/schemas'
import { Badge } from '@/components/ui/badge'

interface ApplicationMetadataProps {
  assignedOfficer?: AssignedOfficer
  isPublic: boolean
  applicationType: string
}

export function ApplicationMetadata({
  assignedOfficer,
  isPublic,
  applicationType,
}: ApplicationMetadataProps) {
  return (
    <div className="space-y-6">
      {/* Assigned Officer */}
      <div>
        <div className="text-sm text-muted-foreground mb-2">Assigned to</div>
        <div className="flex items-center gap-2">
          {assignedOfficer ? (
            <>
              <span className="text-base font-medium text-foreground">
                {assignedOfficer.name}
              </span>
              <button className="text-sm text-primary hover:text-foreground hover:underline transition-colors">
                change
              </button>
            </>
          ) : (
            <span className="text-base text-muted-foreground italic">Unassigned</span>
          )}
        </div>
      </div>

      {/* Public Portal Status */}
      <div>
        <div className="text-sm text-muted-foreground mb-2">Public on BOPS Public Portal</div>
        <div>
          <Badge variant="gray" size="small">
            {isPublic ? 'Yes' : 'No'}
          </Badge>
        </div>
      </div>

      {/* Application Type */}
      <div>
        <div className="text-sm text-muted-foreground mb-2">Application type</div>
        <div>
          <Badge variant="gray" size="small">
            {applicationType}
          </Badge>
        </div>
      </div>
    </div>
  )
}
