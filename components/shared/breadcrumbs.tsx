import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  variant?: 'constrained' | 'full'
}

export function Breadcrumbs({ items, variant = 'constrained' }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="border-b border-border bg-background">
      <div className={`mx-auto px-4 py-2 ${variant === 'constrained' ? 'max-w-[1100px]' : ''}`}>
        <ol className="flex items-center gap-2 text-sm">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && <span className="text-muted-foreground">&gt;</span>}
              {item.href ? (
                <Link
                  href={item.href}
                  className="text-foreground underline decoration-1 hover:decoration-2 transition-all"
                  style={{ textUnderlineOffset: '0.1578em' }}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="text-foreground underline decoration-1"
                  style={{ textUnderlineOffset: '0.1578em' }}
                >
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}
