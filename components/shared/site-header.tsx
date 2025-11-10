import { ThemeToggle } from './theme-toggle'
import Link from 'next/link'

interface SiteHeaderProps {
  variant?: 'constrained' | 'full'
  userType?: 'officer' | 'applicant'
}

export function SiteHeader({ variant = 'constrained', userType = 'officer' }: SiteHeaderProps) {
  return (
    <header className="w-full border-b-[10px] border-b-primary dark:border-b-[hsl(211,66%,43%)] bg-black text-white dark:bg-[hsl(0,0%,5%)] dark:text-foreground">
      <div className={`mx-auto flex h-16 items-center justify-between px-4 ${variant === 'constrained' ? 'max-w-[1100px]' : ''}`}>
        <div className="text-lg font-normal">
          <span className="font-bold">Southwark</span> Back-office Planning System
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <span className="text-base">Federico Carbo</span>
          {userType === 'officer' ? (
            <Link href="/applicant" className="text-base underline-offset-4 hover:underline">
              Switch to Applicant
            </Link>
          ) : (
            <Link href="/" className="text-base underline-offset-4 hover:underline">
              Switch to Officer
            </Link>
          )}
          <a href="#" className="text-base underline-offset-4 hover:underline">
            Log out
          </a>
        </div>
      </div>
    </header>
  )
}
