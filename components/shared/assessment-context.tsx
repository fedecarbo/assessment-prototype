'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

export type TaskStatus = 'not-started' | 'in-progress' | 'completed'

export interface Task {
  id: number
  title: string
  status: TaskStatus
}

interface AssessmentContextType {
  selectedTaskId: number
  setSelectedTaskId: (id: number) => void
  tasks: Task[]
}

// Mock task data
const mockTasks: Task[] = [
  { id: 1, title: 'Task item 1', status: 'completed' },
  { id: 2, title: 'Task item 2', status: 'completed' },
  { id: 3, title: 'Task item 3', status: 'in-progress' },
  { id: 4, title: 'Task item 4', status: 'not-started' },
  { id: 5, title: 'Task item 5', status: 'not-started' },
  { id: 6, title: 'Task item 6', status: 'not-started' },
  { id: 7, title: 'Task item 7', status: 'not-started' },
]

const AssessmentContext = createContext<AssessmentContextType | null>(null)

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [selectedTaskId, setSelectedTaskId] = useState(1)

  return (
    <AssessmentContext.Provider value={{ selectedTaskId, setSelectedTaskId, tasks: mockTasks }}>
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
