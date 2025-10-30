import { SiteHeader } from '@/components/shared/site-header'
import { PreApplicationsList } from '@/components/shared/pre-applications-list'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader variant="constrained" />

      <main className="flex-1">
        <div className="mx-auto max-w-[1100px] px-4 py-8">
          <h1 className="text-2xl font-bold mb-2">Pre-applications</h1>
          <p className="text-base text-muted-foreground mb-8">Federico Carbo</p>

          <PreApplicationsList />
        </div>
      </main>
    </div>
  )
}
