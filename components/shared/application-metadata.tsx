import type { AssignedOfficer } from '@/lib/mock-data/schemas'

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
          <span
            className={`inline-flex items-center px-2 py-0.5 text-sm ${
              isPublic
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            {isPublic ? 'Yes' : 'No'}
          </span>
        </div>
      </div>

      {/* Application Type */}
      <div>
        <div className="text-sm text-muted-foreground mb-2">Application type</div>
        <div>
          <span className="inline-flex items-center bg-blue-100 px-2 py-0.5 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            {applicationType}
          </span>
        </div>
      </div>
    </div>
  )
}
