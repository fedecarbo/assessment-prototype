import type { AssignedOfficer } from '@/lib/mock-data/schemas'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface ApplicationMetadataProps {
  assignedOfficer?: AssignedOfficer
  isPublic: boolean
}

export function ApplicationMetadata({
  assignedOfficer,
  isPublic,
}: ApplicationMetadataProps) {
  return (
    <div className="space-y-6">
      {/* Assigned Officer */}
      <div>
        <div className="text-sm text-muted-foreground mb-2">Assigned to</div>
        {assignedOfficer ? (
          <div className="flex flex-col items-start gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs tracking-wider font-semibold">
                {assignedOfficer.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <span className="text-base font-medium text-foreground">
                {assignedOfficer.name}
              </span>
              <button className="text-sm text-primary hover:text-foreground hover:underline transition-colors text-left">
                change
              </button>
            </div>
          </div>
        ) : (
          <span className="text-base text-muted-foreground italic">Unassigned</span>
        )}
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
    </div>
  )
}
