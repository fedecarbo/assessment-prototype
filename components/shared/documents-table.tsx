import type { Document } from '@/lib/mock-data/schemas'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface DocumentsTableProps {
  documents: Document[]
}

export function DocumentsTable({ documents }: DocumentsTableProps) {
  // Get category label
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'drawings':
        return 'Drawings'
      case 'supporting':
        return 'Supporting'
      case 'evidence':
        return 'Evidence'
      default:
        return category
    }
  }

  // Get visibility label
  const getVisibilityLabel = (visibility: 'public' | 'sensitive') => {
    return visibility === 'public' ? 'Public' : 'Sensitive'
  }

  // Get thumbnail placeholder (will be replaced with actual document preview)
  const getThumbnail = () => {
    return (
      <div className="w-20 h-20 bg-muted rounded" />
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-base font-bold text-foreground pl-0 pr-2.5">Document name</TableHead>
          <TableHead className="text-base font-bold text-foreground px-2.5">Category</TableHead>
          <TableHead className="text-base font-bold text-foreground px-2.5">Version</TableHead>
          <TableHead className="text-base font-bold text-foreground pl-2.5 pr-0">Visibility</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((doc) => (
          <TableRow key={doc.id}>
            <TableCell className="py-4 pl-0 pr-2.5">
              <div className="flex items-start gap-2.5">
                {getThumbnail()}
                <div className="flex-1">
                  <a
                    href="#"
                    className="text-base font-medium text-primary hover:underline hover:text-foreground"
                    onClick={(e) => e.preventDefault()}
                  >
                    {doc.name}
                  </a>
                  {doc.tags && doc.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {doc.tags.map((tag) => (
                        <Badge key={tag} variant="muted" size="small">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TableCell>
            <TableCell className="py-4 px-2.5">{getCategoryLabel(doc.category)}</TableCell>
            <TableCell className="py-4 px-2.5">{doc.version || '—'}</TableCell>
            <TableCell className="py-4 pl-2.5 pr-0">{getVisibilityLabel(doc.visibility)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
