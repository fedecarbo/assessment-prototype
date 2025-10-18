import type { Constraint } from '@/lib/mock-data/schemas'
import Link from 'next/link'
import { Building2, Landmark, TreeDeciduous, Droplets, Trees, FileText, Mountain } from 'lucide-react'

interface ConstraintsSummaryProps {
  constraints?: Constraint[]
  applicationId: string
}

export function ConstraintsSummary({ constraints = [], applicationId }: ConstraintsSummaryProps) {
  // Only show constraints that apply
  const activeConstraints = constraints.filter(
    (c) => c.status === 'applies' || c.status === 'nearby' || c.status === 'partial'
  )

  // Group constraints by type
  const groupedConstraints = activeConstraints.reduce((acc, constraint) => {
    if (!acc[constraint.type]) {
      acc[constraint.type] = []
    }
    acc[constraint.type].push(constraint)
    return acc
  }, {} as Record<string, Constraint[]>)

  // Sort types alphabetically
  const sortedTypes = Object.keys(groupedConstraints).sort()

  const getConstraintIcon = (type: Constraint['type']) => {
    const iconProps = { size: 20, className: 'text-muted-foreground flex-shrink-0' }

    switch (type) {
      case 'conservation-area':
        return <Building2 {...iconProps} />
      case 'listed-building':
        return <Landmark {...iconProps} />
      case 'tpo':
        return <TreeDeciduous {...iconProps} />
      case 'flood-risk':
        return <Droplets {...iconProps} />
      case 'green-belt':
        return <Trees {...iconProps} />
      case 'article-4':
        return <FileText {...iconProps} />
      case 'archaeology':
        return <Mountain {...iconProps} />
      default:
        return null
    }
  }

  return (
    <div>
      {activeConstraints.length > 0 ? (
        <>
          {/* Two Column Layout: Map (33%) + Detailed List (66%) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-6">
            {/* Left: Map Placeholder */}
            <div className="lg:col-span-1">
              <div className="aspect-square w-full border-2 border-dashed border-border bg-muted flex items-center justify-center">
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-muted-foreground">Constraints map</p>
                </div>
              </div>
            </div>

            {/* Right: Detailed List with Icons */}
            <div className="lg:col-span-2">
              {sortedTypes.map((type, index) => {
                const constraintsOfType = groupedConstraints[type]
                const firstConstraint = constraintsOfType[0]

                return (
                  <div key={type}>
                    <div className="flex gap-3 py-6">
                      {getConstraintIcon(type as Constraint['type'])}
                      <div className="flex-1">
                        <div className="font-medium text-foreground">{firstConstraint?.label}</div>
                        {constraintsOfType.length === 1 ? (
                          // Single constraint - show details normally
                          firstConstraint?.details && (
                            <div className="text-sm text-muted-foreground mt-1">{firstConstraint.details}</div>
                          )
                        ) : (
                          // Multiple constraints - show as compact list
                          <div className="text-sm text-muted-foreground mt-1">
                            {constraintsOfType.map((constraint) => (
                              <div key={constraint.id}>
                                {constraint.details}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    {index < sortedTypes.length - 1 && (
                      <hr className="border-border" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Link at bottom left */}
          <div>
            <Link
              href={`/application/${applicationId}/constraints`}
              className="text-sm text-primary hover:underline"
            >
              View full constraints report
            </Link>
          </div>
        </>
      ) : (
        <>
          <p className="text-muted-foreground mb-4">No major constraints identified</p>
          <div>
            <Link
              href={`/application/${applicationId}/constraints`}
              className="text-sm text-primary hover:underline"
            >
              View full constraints report
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
