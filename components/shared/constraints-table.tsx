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
import { Building2, Landmark, TreeDeciduous, Droplets, Trees, FileText, Castle, type LucideIcon } from 'lucide-react'

interface ConstraintsTableProps {
  constraints: Constraint[]
  visibleConstraints: Set<string>
  onToggleConstraint: (constraintId: string) => void
}

// Icon mapping for constraint types
const CONSTRAINT_ICONS: Record<Constraint['type'], LucideIcon> = {
  'conservation-area': Building2,
  'listed-building': Landmark,
  'tpo': TreeDeciduous,
  'flood-risk': Droplets,
  'green-belt': Trees,
  'article-4': FileText,
  'archaeology': Castle,
}

export function ConstraintsTable({ constraints, visibleConstraints, onToggleConstraint }: ConstraintsTableProps) {
  // Get constraint icon based on type
  const getConstraintIcon = (type: Constraint['type']) => {
    const Icon = CONSTRAINT_ICONS[type]
    return Icon ? <Icon className="h-5 w-5 text-foreground stroke-[1.5]" /> : null
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-base font-bold text-foreground w-12 pl-0 pr-3">Show</TableHead>
          <TableHead className="text-base font-bold text-foreground px-3">Constraint</TableHead>
          <TableHead className="text-base font-bold text-foreground pl-3 pr-0">Details</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {constraints.map((constraint) => (
          <TableRow key={constraint.id}>
            <TableCell className="py-4 pl-0 pr-3">
              <Checkbox
                id={`constraint-${constraint.id}`}
                checked={visibleConstraints.has(constraint.id)}
                onCheckedChange={() => onToggleConstraint(constraint.id)}
                aria-label={`Show ${constraint.label} on map`}
              />
            </TableCell>
            <TableCell className="py-4 px-3">
              <div className="flex items-center gap-3">
                {getConstraintIcon(constraint.type)}
                <span className="text-base">{constraint.label}</span>
              </div>
            </TableCell>
            <TableCell className="py-4 pl-3 pr-0">{constraint.details || '—'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
