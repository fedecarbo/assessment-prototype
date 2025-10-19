'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

export type TaskStatus = 'not-started' | 'in-progress' | 'completed'

export interface Task {
  id: number
  title: string
  description: string
  status: TaskStatus
}

interface AssessmentContextType {
  selectedTaskId: number
  setSelectedTaskId: (id: number) => void
  tasks: Task[]
}

// Mock task data
const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Review site constraints',
    description: 'Review all planning constraints that apply to this site including conservation areas, listed buildings, tree preservation orders, and flood zones.',
    status: 'completed'
  },
  {
    id: 2,
    title: 'Assess design and layout',
    description: 'Evaluate the proposed design against local design policies. Consider building height, massing, materials, and relationship to neighbouring properties.',
    status: 'completed'
  },
  {
    id: 3,
    title: 'Review consultation responses',
    description: 'Examine all responses from statutory consultees and neighbours. Identify key planning issues raised and prepare summary of material planning considerations.',
    status: 'in-progress'
  },
  {
    id: 4,
    title: 'Evaluate policy compliance',
    description: 'Assess the proposal against relevant national, regional, and local planning policies including the London Plan and Local Plan policies.',
    status: 'not-started'
  },
  {
    id: 5,
    title: 'Assess amenity impacts',
    description: 'Consider the impact on neighbouring amenity including privacy, outlook, daylight, sunlight, and noise. Review technical reports and determine if impacts are acceptable.',
    status: 'not-started'
  },
  {
    id: 6,
    title: 'Review technical documents',
    description: 'Examine all supporting technical documents including transport assessments, drainage strategies, ecology reports, and heritage statements.',
    status: 'not-started'
  },
  {
    id: 7,
    title: 'Draft recommendation',
    description: 'Prepare draft planning recommendation based on assessment findings. Summarize key issues, planning balance, and recommended decision with conditions or reasons for refusal.',
    status: 'not-started'
  },
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
