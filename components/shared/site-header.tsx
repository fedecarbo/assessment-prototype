import { ThemeToggle } from './theme-toggle'

interface SiteHeaderProps {
  variant?: 'constrained' | 'full'
}

export function SiteHeader({ variant = 'constrained' }: SiteHeaderProps) {
  return (
    <header className="w-full border-b-[10px] border-b-primary dark:border-b-[hsl(211,66%,50%)] bg-black text-white dark:bg-[hsl(0,0%,5%)] dark:text-foreground">
      <div className={`mx-auto flex h-16 items-center justify-between px-4 ${variant === 'constrained' ? 'max-w-[1100px]' : ''}`}>
        <div className="text-lg font-normal">
          <span className="font-bold">Southwark</span> Back-office Planning System
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <span className="text-base">Federico Carbo</span>
          <a href="#" className="text-base underline-offset-4 hover:underline">
            Log out
          </a>
        </div>
      </div>
    </header>
  )
}
