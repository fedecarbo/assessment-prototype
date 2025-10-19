import type { Constraint } from '@/lib/mock-data/schemas'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Building2, Landmark, TreeDeciduous, Droplets, Trees, FileText, Castle } from 'lucide-react'

interface ConstraintsTableProps {
  constraints: Constraint[]
  visibleConstraints: Set<string>
  onToggleConstraint: (constraintId: string) => void
}

export function ConstraintsTable({ constraints, visibleConstraints, onToggleConstraint }: ConstraintsTableProps) {
  // Get constraint icon based on type
  const getConstraintIcon = (type: Constraint['type']) => {
    const iconClass = "h-5 w-5 text-foreground stroke-[1.5]"
    switch (type) {
      case 'conservation-area':
        return <Building2 className={iconClass} />
      case 'listed-building':
        return <Landmark className={iconClass} />
      case 'tpo':
        return <TreeDeciduous className={iconClass} />
      case 'flood-risk':
        return <Droplets className={iconClass} />
      case 'green-belt':
        return <Trees className={iconClass} />
      case 'article-4':
        return <FileText className={iconClass} />
      case 'archaeology':
        return <Castle className={iconClass} />
      default:
        return null
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-base font-bold text-foreground w-12 pl-0 pr-2.5">Show</TableHead>
          <TableHead className="text-base font-bold text-foreground px-2.5">Constraint</TableHead>
          <TableHead className="text-base font-bold text-foreground pl-2.5 pr-0">Details</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {constraints.map((constraint) => (
          <TableRow key={constraint.id}>
            <TableCell className="py-4 pl-0 pr-2.5">
              <Checkbox
                id={`constraint-${constraint.id}`}
                checked={visibleConstraints.has(constraint.id)}
                onCheckedChange={() => onToggleConstraint(constraint.id)}
              />
            </TableCell>
            <TableCell className="py-4 px-2.5">
              <div className="flex items-center gap-2.5">
                {getConstraintIcon(constraint.type)}
                <span className="text-base">{constraint.label}</span>
              </div>
            </TableCell>
            <TableCell className="py-4 pl-2.5 pr-0">{constraint.details || '—'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
