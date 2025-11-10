'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface ServiceNavigationProps {
  applicationId?: string
}

export function ServiceNavigation({ applicationId }: ServiceNavigationProps) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  const baseHref = applicationId ? `/applicant/${applicationId}` : '/applicant'

  const navItems = [
    { label: 'Requests', href: `${baseHref}/requests` },
    { label: 'Timeline', href: `${baseHref}/timeline` },
  ]

  return (
    <nav className="w-full border-b border-border bg-background">
      <div className="mx-auto max-w-[1100px] px-4">
        <ul className="flex gap-8">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`inline-block py-4 text-base ${
                  isActive(item.href)
                    ? 'border-b-[5px] border-b-primary font-medium text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
