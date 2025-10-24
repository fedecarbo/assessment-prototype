'use client'

import { createContext, useContext, useState, useRef, useEffect, Suspense, type ReactNode, type RefObject } from 'react'
import { useSearchParams } from 'next/navigation'
import { type TaskStatus } from './assessment-context'

export interface FutureTask {
  id: number
  title: string
  description: string
  status: TaskStatus
}

interface FutureAssessmentContextType {
  selectedTaskId: number
  setSelectedTaskId: (id: number) => void
  futureTasks: FutureTask[]
  updateTaskStatus: (taskId: number, status: TaskStatus) => void
  contentScrollRef: RefObject<HTMLElement | null>
  getTask: (id: number) => FutureTask | undefined
}

// Initial future tasks
const initialFutureTasks: FutureTask[] = [
  { id: 1, title: 'Pre-application details', description: 'Enter pre-application details', status: 'not-started' },
  { id: 2, title: 'Proposal description', description: 'Describe the proposal', status: 'not-started' },
  { id: 3, title: 'Site map', description: 'Upload site map', status: 'not-started' },
  { id: 4, title: 'Relevant site constraints', description: 'Document site constraints', status: 'not-started' },
  { id: 5, title: 'Relevant site history', description: 'Record site history', status: 'not-started' },
  { id: 6, title: 'Site and surroundings', description: 'Describe site and surroundings', status: 'not-started' },
  { id: 7, title: 'Heads of terms', description: 'Define heads of terms', status: 'not-started' },
  { id: 8, title: 'Planning advice', description: 'Provide planning advice', status: 'not-started' },
  { id: 9, title: 'Summary of advice', description: 'Summarize advice given', status: 'not-started' },
  { id: 10, title: 'Relevant policies and guidance', description: 'List relevant policies', status: 'not-started' },
  { id: 11, title: 'CIL', description: 'Community Infrastructure Levy details', status: 'not-started' },
  { id: 12, title: 'List of Requirements', description: 'Document all requirements', status: 'not-started' },
  { id: 13, title: 'Pre-application outcome', description: 'Record pre-application outcome', status: 'not-started' },
  { id: 14, title: 'Next steps', description: 'Define next steps', status: 'not-started' },
]

const FutureAssessmentContext = createContext<FutureAssessmentContextType | null>(null)

function FutureAssessmentProviderContent({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams()
  const taskParam = searchParams.get('task')

  const [selectedTaskId, setSelectedTaskId] = useState(() => {
    return taskParam ? parseInt(taskParam, 10) : 0
  })

  const [futureTasks, setFutureTasks] = useState(initialFutureTasks)
  const contentScrollRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const newTaskId = taskParam ? parseInt(taskParam, 10) : 0
    setSelectedTaskId(newTaskId)
  }, [taskParam])

  const updateTaskStatus = (taskId: number, status: TaskStatus) => {
    setFutureTasks(tasks =>
      tasks.map(task =>
        task.id === taskId ? { ...task, status } : task
      )
    )
  }

  const getTask = (id: number) => {
    return futureTasks.find(task => task.id === id)
  }

  return (
    <FutureAssessmentContext.Provider
      value={{
        selectedTaskId,
        setSelectedTaskId,
        futureTasks,
        updateTaskStatus,
        contentScrollRef,
        getTask
      }}
    >
      {children}
    </FutureAssessmentContext.Provider>
  )
}

export function FutureAssessmentProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FutureAssessmentProviderContent>{children}</FutureAssessmentProviderContent>
    </Suspense>
  )
}

export function useFutureAssessment() {
  const context = useContext(FutureAssessmentContext)
  if (!context) {
    throw new Error('useFutureAssessment must be used within FutureAssessmentProvider')
  }
  return context
}
