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
import { getDocumentCategoryLabel, getDocumentVisibilityLabel } from '@/lib/utils'

interface DocumentsTableProps {
  documents: Document[]
}

export function DocumentsTable({ documents }: DocumentsTableProps) {
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
          <TableHead className="text-base font-bold text-foreground pl-0 pr-3">Document name</TableHead>
          <TableHead className="text-base font-bold text-foreground px-3">Category</TableHead>
          <TableHead className="text-base font-bold text-foreground px-3">Version</TableHead>
          <TableHead className="text-base font-bold text-foreground pl-3 pr-0">Visibility</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((doc) => (
          <TableRow key={doc.id}>
            <TableCell className="py-4 pl-0 pr-3">
              <div className="flex items-start gap-3">
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
            <TableCell className="py-4 px-3">{getDocumentCategoryLabel(doc.category)}</TableCell>
            <TableCell className="py-4 px-3">{doc.version || '—'}</TableCell>
            <TableCell className="py-4 pl-3 pr-0">{getDocumentVisibilityLabel(doc.visibility)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
