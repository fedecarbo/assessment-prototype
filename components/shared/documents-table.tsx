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
      <div className="w-16 h-16 bg-muted rounded" />
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[80px]"></TableHead>
          <TableHead className="text-base font-bold text-foreground">Document name</TableHead>
          <TableHead className="text-base font-bold text-foreground">Category</TableHead>
          <TableHead className="text-base font-bold text-foreground">Version</TableHead>
          <TableHead className="text-base font-bold text-foreground">Visibility</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((doc) => (
          <TableRow key={doc.id}>
            <TableCell>
              {getThumbnail()}
            </TableCell>
            <TableCell>
              <div>
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
            </TableCell>
            <TableCell>{getCategoryLabel(doc.category)}</TableCell>
            <TableCell>{doc.version || '—'}</TableCell>
            <TableCell>{getVisibilityLabel(doc.visibility)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
