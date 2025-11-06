'use client'

import { createContext, useContext, useState, useRef, useEffect, Suspense, type ReactNode, type RefObject } from 'react'
import { useSearchParams } from 'next/navigation'
import type { RequestedService, ServiceRecord } from '@/lib/mock-data/schemas'

export type TaskStatus = 'locked' | 'not-started' | 'in-progress' | 'completed' | 'needs-review'

export interface Task {
  id: number
  title: string
  description: string
  status?: TaskStatus
}

export interface TaskGroup {
  title: string
  tasks: Task[]
}

interface AssessmentContextType {
  selectedTaskId: number
  setSelectedTaskId: (id: number) => void
  taskGroups: TaskGroup[]
  taskMap: Map<number, Task>
  updateTaskStatus: (taskId: number, status: TaskStatus) => void
  contentScrollRef: RefObject<HTMLElement | null>
  // Service management
  originalServices: RequestedService[]
  serviceRecords: ServiceRecord[]
  updateServiceRecords: (records: ServiceRecord[]) => void
  totalServiceCost: number
}

// Mock task data organized in groups
const mockTaskGroups: TaskGroup[] = [
  {
    title: 'Check application',
    tasks: [
      {
        id: 1,
        title: 'Check application details',
        description: 'Verify all application details are complete and accurate including site address, applicant information, and proposed development description.',
        status: 'not-started'
      },
      {
        id: 2,
        title: 'Check consultees consulted',
        description: 'Review the list of statutory consultees contacted and confirm all required consultees have been notified according to planning regulations.',
        status: 'not-started'
      },
      {
        id: 3,
        title: 'Check site history',
        description: 'Examine planning history for the site including previous applications, appeals, enforcement actions, and any relevant planning conditions.',
        status: 'not-started'
      },
    ]
  },
  {
    title: 'Additional services',
    tasks: [
      {
        id: 4,
        title: 'Record site visit',
        description: 'Conduct site visit to assess the existing conditions, verify details in the application, and evaluate the impact of the proposed development.',
        status: 'not-started'
      },
      {
        id: 5,
        title: 'Record meeting',
        description: 'Arrange and conduct meetings with applicant, consultees, or other stakeholders as necessary to discuss the proposal and resolve issues.',
        status: 'not-started'
      },
    ]
  },
  {
    title: 'Assessment summaries',
    tasks: [
      {
        id: 6,
        title: 'Site description',
        description: 'Prepare detailed description of the site including its location, existing use, surrounding context, and any relevant site characteristics.',
        status: 'not-started'
      },
      {
        id: 7,
        title: 'Planning advice',
        description: 'Provide comprehensive planning assessment covering policy compliance, material considerations, and planning balance. Draft recommendation with supporting reasoning.',
        status: 'not-started'
      },
      {
        id: 8,
        title: 'Summary of advice',
        description: 'Summarize advice received from consultees, technical specialists, and other relevant parties. Highlight key recommendations and concerns.',
        status: 'not-started'
      },
    ]
  },
  {
    title: 'Complete assessment',
    tasks: [
      {
        id: 9,
        title: 'Choose application type',
        description: 'Select the appropriate application type based on the proposal and assessment findings.',
        status: 'not-started'
      },
      {
        id: 10,
        title: 'Check and add requirements',
        description: 'Review and confirm all requirements for the selected application type, adding any additional documentation or information needed.',
        status: 'not-started'
      },
      {
        id: 11,
        title: 'Review and submit',
        description: 'Conduct final review of the pre-application assessment and submit advice to the applicant.',
        status: 'not-started'
      },
    ]
  },
]

const AssessmentContext = createContext<AssessmentContextType | null>(null)

// Create task map for O(1) lookups
const createTaskMap = (groups: TaskGroup[]): Map<number, Task> => {
  const map = new Map<number, Task>()
  for (const group of groups) {
    for (const task of group.tasks) {
      map.set(task.id, task)
    }
  }
  return map
}


function AssessmentProviderContent({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams()
  const taskParam = searchParams.get('task')

  // Initialize from URL or default to 0 (no task selected)
  const [selectedTaskId, setSelectedTaskId] = useState(() => {
    return taskParam ? parseInt(taskParam, 10) : 0
  })

  const [taskGroups, setTaskGroups] = useState(mockTaskGroups)
  const contentScrollRef = useRef<HTMLElement>(null)

  // Service management state
  const [originalServices] = useState<RequestedService[]>(['written-advice', 'site-visit', 'meeting'])
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([
    {
      id: 'sr-1',
      service: 'written-advice',
      status: 'included',
      cost: 500,
    },
    {
      id: 'sr-2',
      service: 'site-visit',
      status: 'included',
      cost: 200,
    },
    {
      id: 'sr-3',
      service: 'meeting',
      status: 'included',
      cost: 300,
    },
  ])

  const updateServiceRecords = (records: ServiceRecord[]) => {
    setServiceRecords(records)
  }

  const totalServiceCost = serviceRecords
    .filter((record) => record.status !== 'removed')
    .reduce((sum, record) => sum + record.cost, 0)

  // Sync selectedTaskId with URL changes
  useEffect(() => {
    const newTaskId = taskParam ? parseInt(taskParam, 10) : 0
    setSelectedTaskId(newTaskId)
  }, [taskParam])

  const updateTaskStatus = (taskId: number, status: TaskStatus) => {
    setTaskGroups(groups => {
      // First, update the target task
      const updatedGroups = groups.map(group => ({
        ...group,
        tasks: group.tasks.map(task =>
          task.id === taskId ? { ...task, status } : task
        )
      }))

      // Create a flattened task map to check completion status
      const allTasks = updatedGroups.flatMap(g => g.tasks)

      // Apply unlock logic
      return updatedGroups.map(group => ({
        ...group,
        tasks: group.tasks.map(task => {
          // Unlock "Summary of advice" (id: 8) when "Planning advice" (id: 7) is completed
          if (task.id === 8 && taskId === 7 && status === 'completed') {
            return { ...task, status: 'not-started' }
          }

          // Unlock "Check and add requirements" (id: 10) when "Choose application type" (id: 9) is completed
          if (task.id === 10 && taskId === 9 && status === 'completed') {
            return { ...task, status: 'not-started' }
          }

          // Unlock "Review and submit" (id: 11) when ALL tasks 1-10 are completed
          if (task.id === 11) {
            const tasksToCheck = allTasks.filter(t => t.id >= 1 && t.id <= 10)
            const allCompleted = tasksToCheck.every(t => t.status === 'completed')
            if (allCompleted && task.status === 'locked') {
              return { ...task, status: 'not-started' }
            }
          }

          return task
        })
      }))
    })
  }

  // Recreate task map when taskGroups changes
  const taskMap = createTaskMap(taskGroups)

  return (
    <AssessmentContext.Provider value={{
      selectedTaskId,
      setSelectedTaskId,
      taskGroups,
      taskMap,
      updateTaskStatus,
      contentScrollRef,
      originalServices,
      serviceRecords,
      updateServiceRecords,
      totalServiceCost
    }}>
      {children}
    </AssessmentContext.Provider>
  )
}

export function AssessmentProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AssessmentProviderContent>{children}</AssessmentProviderContent>
    </Suspense>
  )
}

export function useAssessment() {
  const context = useContext(AssessmentContext)
  if (!context) {
    throw new Error('useAssessment must be used within AssessmentProvider')
  }
  return context
}
