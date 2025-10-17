import { PlanningApplication } from './schemas';

export const mockApplications: PlanningApplication[] = [
  {
    id: '1',
    reference: 'PA-2025-001',
    type: 'pre-application',
    applicantName: 'Green Development Ltd',
    address: '123 Main Street, London, SW1A 1AA',
    description: 'Proposed residential development of 50 units',
    status: 'under-review',
    submittedDate: '2025-01-15',
    assignedTo: 'Alice Johnson',
  },
  {
    id: '2',
    reference: 'PA-2025-002',
    type: 'full-application',
    applicantName: 'Citywide Construction',
    address: '456 High Road, Manchester, M1 1AB',
    description: 'Commercial building renovation and expansion',
    status: 'pending',
    submittedDate: '2025-02-01',
  },
  {
    id: '3',
    reference: 'PA-2025-003',
    type: 'pre-application',
    applicantName: 'Heritage Homes',
    address: '789 Park Lane, Birmingham, B1 1BB',
    description: 'Conservation area development consultation',
    status: 'approved',
    submittedDate: '2024-12-10',
    assignedTo: 'Bob Smith',
  },
];
