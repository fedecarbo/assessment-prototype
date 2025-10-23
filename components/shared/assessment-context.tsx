'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

export type TaskStatus = 'not-started' | 'in-progress' | 'completed'

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
        status: 'completed'
      },
      {
        id: 2,
        title: 'Check consultees consulted',
        description: 'Review the list of statutory consultees contacted and confirm all required consultees have been notified according to planning regulations.',
        status: 'completed'
      },
      {
        id: 3,
        title: 'Check site history',
        description: 'Examine planning history for the site including previous applications, appeals, enforcement actions, and any relevant planning conditions.',
        status: 'in-progress'
      },
    ]
  },
  {
    title: 'Additional services',
    tasks: [
      {
        id: 4,
        title: 'Site visit',
        description: 'Conduct site visit to assess the existing conditions, verify details in the application, and evaluate the impact of the proposed development.',
        status: 'not-started'
      },
      {
        id: 5,
        title: 'Meeting',
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
        title: 'Summary of advice',
        description: 'Summarize advice received from consultees, technical specialists, and other relevant parties. Highlight key recommendations and concerns.',
        status: 'not-started'
      },
      {
        id: 8,
        title: 'Planning considerations and advice',
        description: 'Provide comprehensive planning assessment covering policy compliance, material considerations, and planning balance. Draft recommendation with supporting reasoning.',
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
        title: 'Review and submit pre-application',
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

const taskMap = createTaskMap(mockTaskGroups)

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [selectedTaskId, setSelectedTaskId] = useState(1)

  return (
    <AssessmentContext.Provider value={{ selectedTaskId, setSelectedTaskId, taskGroups: mockTaskGroups, taskMap }}>
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
