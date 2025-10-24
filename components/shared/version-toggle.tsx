'use client'

import { useState, useEffect } from 'react'

export function VersionToggle() {
  const [version, setVersion] = useState<'current' | 'future'>('current')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load version from localStorage or default to env var
    const stored = localStorage.getItem('TASK_PANEL_VERSION')
    const envVersion = process.env.NEXT_PUBLIC_TASK_PANEL_VERSION || 'current'
    setVersion((stored as 'current' | 'future') || (envVersion as 'current' | 'future'))
  }, [])

  const handleToggle = () => {
    const newVersion = version === 'current' ? 'future' : 'current'
    setVersion(newVersion)
    localStorage.setItem('TASK_PANEL_VERSION', newVersion)
    // Reload to apply new version
    window.location.reload()
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) return null

  return (
    <button
      onClick={handleToggle}
      className="fixed bottom-4 right-4 z-50 text-xs px-2 py-1 bg-muted hover:bg-muted/80 border border-border rounded text-muted-foreground transition-colors"
      title="Toggle between current and future task panel versions"
    >
      Version: <span className="font-semibold">{version}</span>
    </button>
  )
}

// Helper function to get current version (can be used throughout the app)
export function getCurrentVersion(): 'current' | 'future' {
  if (typeof window === 'undefined') {
    return (process.env.NEXT_PUBLIC_TASK_PANEL_VERSION as 'current' | 'future') || 'current'
  }
  const stored = localStorage.getItem('TASK_PANEL_VERSION')
  return (stored as 'current' | 'future') || (process.env.NEXT_PUBLIC_TASK_PANEL_VERSION as 'current' | 'future') || 'current'
}
