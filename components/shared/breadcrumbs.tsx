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
    <nav aria-label="Breadcrumb" className="border-b border-border bg-[hsl(211,66%,95%)] dark:bg-[hsl(0,0%,8%)]">
      <div className={`mx-auto px-4 py-2 ${variant === 'constrained' ? 'max-w-[1100px]' : ''}`}>
        <ol className="flex items-center gap-2 text-sm">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && <span className="text-muted-foreground">/</span>}
              {item.href ? (
                <Link
                  href={item.href}
                  className="text-primary hover:underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}
