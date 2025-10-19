'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

interface AssessmentContextType {
  selectedTaskId: number
  setSelectedTaskId: (id: number) => void
}

const AssessmentContext = createContext<AssessmentContextType | null>(null)

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [selectedTaskId, setSelectedTaskId] = useState(1)

  return (
    <AssessmentContext.Provider value={{ selectedTaskId, setSelectedTaskId }}>
      {children}
    </AssessmentContext.Provider>
  )
}

export function useAssessment() {
  const context = useContext(AssessmentContext)
  if (!context) {
    throw new Error('useAssessment must be used within AssessmentProvider')
  }
  return context
}
