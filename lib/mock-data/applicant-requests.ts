import type { ApplicantRequest } from './schemas'

/**
 * Mock data for applicant requests
 * Demonstrates different request states: pending, responded, overdue
 */

export const mockApplicantRequests: ApplicantRequest[] = [
  {
    id: 'req-001',
    subject: 'Clarification on drainage system design',
    description: 'Could you please provide more details about the proposed surface water drainage system? Specifically, we need to understand how the system will handle peak flow during heavy rainfall and whether it connects to the existing mains drainage.',
    requestType: 'information',
    status: 'responded',
    sentDate: '2024-03-15',
    dueDate: '2024-03-29',
    sentBy: 'Federico Carbo',
    viewedByOfficer: false, // New response, not yet viewed
    response: {
      receivedDate: '2024-03-22',
      message: 'The drainage system has been designed to accommodate a 1-in-100 year storm event plus 40% for climate change. The system includes permeable paving across the parking areas and an attenuation tank with a capacity of 15m³. Surface water will be discharged to the existing Thames Water surface water sewer in High Street at a restricted rate of 5 l/s. We have attached the detailed drainage calculations and tank specifications.',
      attachments: ['Drainage_Calculations_Rev_B.pdf', 'Attenuation_Tank_Specs.pdf']
    }
  },
  {
    id: 'req-002',
    subject: 'Heritage statement required',
    description: 'Given the proximity to the conservation area (within 50m), please provide a heritage statement assessing the impact of the proposed development on the significance of nearby heritage assets, including views from the conservation area.',
    requestType: 'document',
    status: 'sent',
    sentDate: '2024-03-10',
    dueDate: '2024-03-24',
    sentBy: 'Federico Carbo',
    viewedByOfficer: true
  },
  {
    id: 'req-003',
    subject: 'Tree protection plan needed',
    description: 'The submitted plans show construction activity within the root protection area of the oak tree (T1) on the western boundary. Please provide a detailed tree protection plan showing protective fencing locations and construction methods to avoid root damage.',
    requestType: 'document',
    status: 'sent',
    sentDate: '2024-03-20',
    dueDate: '2024-04-03',
    sentBy: 'Federico Carbo',
    viewedByOfficer: true
  },
  {
    id: 'req-004',
    subject: 'Clarification on materials specification',
    description: 'The plans reference "matching brickwork" for the extension but don\'t specify the exact brick type, bond pattern, or mortar colour. Please confirm these details to ensure the extension matches the existing building.',
    requestType: 'information',
    status: 'closed',
    sentDate: '2024-03-12',
    dueDate: '2024-03-26',
    sentBy: 'Sarah Mitchell',
    viewedByOfficer: true,
    response: {
      receivedDate: '2024-03-18',
      message: 'The brickwork will use Ibstock Leicester Multi Stock bricks to match the existing Victorian facade. We will use English Garden Wall bond (three stretchers to one header course) with a lime-based mortar in a light buff colour to match the existing pointing. A sample panel will be built on site for approval before main works commence.',
      attachments: ['Brick_Sample_Photos.pdf']
    }
  },
  {
    id: 'req-005',
    subject: 'Biodiversity net gain calculations',
    description: 'Please submit biodiversity net gain calculations using the latest Defra metric (version 4.0), showing how the development will achieve at least 10% net gain as required by policy.',
    requestType: 'document',
    status: 'not-sent-yet',
    sentDate: '2024-03-25',
    sentBy: 'Federico Carbo',
    viewedByOfficer: true
  },
  {
    id: 'req-006',
    subject: 'Additional parking space dimensions',
    description: 'The submitted site plan shows three parking spaces but the dimensions are not clearly marked. Please provide detailed measurements showing compliance with the council\'s parking standards (minimum 2.4m x 4.8m per space).',
    requestType: 'information',
    status: 'cancelled',
    sentDate: '2024-03-08',
    dueDate: '2024-03-22',
    sentBy: 'Federico Carbo',
    viewedByOfficer: true
  }
]
