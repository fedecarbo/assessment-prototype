import { Meeting } from './schemas';

export const mockMeetings: Meeting[] = [
  {
    id: 'mtg-001',
    title: 'Pre-application meeting with applicant',
    type: 'meeting',
    meetingDate: '2025-11-15T10:00:00',
    notes: 'Discuss conservatory design, material choices, glazing specifications, and potential impact on neighbouring properties.',
    recordedBy: 'Federico Carbo',
    recordedDate: '2025-10-28T14:30:00'
  },
  {
    id: 'mtg-002',
    title: 'Site visit with conservation officer',
    type: 'site-visit',
    meetingDate: '2025-11-20T14:30:00',
    notes: 'Assess impact on conservation area and review heritage considerations.',
    attachments: ['site-photos-conservation-area.pdf', 'heritage-assessment-notes.pdf'],
    recordedBy: 'Federico Carbo',
    recordedDate: '2025-10-29T09:15:00'
  },
  {
    id: 'mtg-003',
    title: 'Initial scoping meeting',
    type: 'meeting',
    meetingDate: '2025-10-22T11:00:00',
    notes: 'Reviewed site constraints and discussed feasibility of proposed conservatory extension.',
    recordedBy: 'Federico Carbo',
    recordedDate: '2025-10-22T11:45:00'
  },
  {
    id: 'mtg-004',
    title: 'Pre-submission consultation',
    type: 'telephone-call',
    meetingDate: '2025-10-15T15:00:00',
    notes: 'Discussed planning requirements and advised on necessary supporting documents.',
    recordedBy: 'Sarah Mitchell',
    recordedDate: '2025-10-15T16:00:00'
  }
];
