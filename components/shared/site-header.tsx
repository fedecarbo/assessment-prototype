import { ThemeToggle } from './theme-toggle'

export function SiteHeader() {
  return (
    <header className="w-full border-b-[10px] border-b-blue-500 bg-black text-white dark:bg-[hsl(0,0%,5%)] dark:text-foreground">
      <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between px-4">
        <div className="text-lg font-normal">
          <span className="font-bold">Southwark</span> Back-office Planning System
        </div>

        <div className="flex items-center gap-4 text-sm">
          <span>Federico Carbo</span>
          <ThemeToggle />
          <a href="#" className="underline-offset-4 hover:underline">
            Log out
          </a>
        </div>
      </div>
    </header>
  )
}
