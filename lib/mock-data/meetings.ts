import { Meeting } from './schemas';

export const mockMeetings: Meeting[] = [
  // UPCOMING MEETINGS
  {
    id: 'mtg-001',
    title: 'Pre-application meeting with applicant',
    type: 'meeting',
    date: '2025-11-15',
    startTime: '10:00',
    endTime: '11:00',
    description: 'Discuss conservatory design, material choices, glazing specifications, and potential impact on neighbouring properties. Applicant should bring updated design drawings. Conservation officer Sarah Mitchell will attend.',
    location: 'https://meet.google.com/abc-defg-hij',
    recordedBy: 'Federico Carbo',
    recordedDate: '2025-10-28T14:30:00'
  },
  {
    id: 'mtg-002',
    title: 'Site visit with conservation officer',
    type: 'site-visit',
    date: '2025-11-20',
    startTime: '14:30',
    endTime: '15:30',
    description: 'Assess impact on conservation area and review heritage considerations. Will examine the proposed extension location, materials compatibility with existing building, and views from the conservation area. Applicant should be present.',
    location: '123 High Street, London, SE1 1AA',
    recordedBy: 'Federico Carbo',
    recordedDate: '2025-10-29T09:15:00'
  },

  // PAST MEETINGS
  {
    id: 'mtg-003',
    title: 'Initial scoping meeting',
    type: 'meeting',
    date: '2025-10-22',
    startTime: '11:00',
    endTime: '12:00',
    description: 'Review site constraints and discuss feasibility of proposed conservatory extension. Applicant to present initial design concept and ask preliminary questions.',
    location: 'Planning Office, Town Hall, High Street, London SE1 2AA',
    meetingNotes: 'Reviewed site constraints including proximity to conservation area (45m), tree preservation order on oak tree (T1), and building line alignment. Discussed feasibility of proposed conservatory extension. Applicant confirmed conservatory will be single-storey, matching materials, with glazing to match existing windows. Advised on need for heritage statement given proximity to conservation area. Applicant will submit revised drawings with detailed materials specification.',
    recordedBy: 'Federico Carbo',
    recordedDate: '2025-10-22T11:45:00'
  },
  {
    id: 'mtg-004',
    title: 'Pre-submission consultation',
    type: 'telephone-call',
    date: '2025-10-15',
    startTime: '15:00',
    endTime: '15:30',
    description: 'Discuss planning requirements and advise on necessary supporting documents for the application.',
    location: '020 7946 0958',
    meetingNotes: 'Discussed planning requirements for conservatory extension. Advised applicant will need: site plan showing property boundaries and proposed extension, elevations showing materials and glazing details, heritage statement (due to conservation area proximity), tree protection plan (TPO on T1), and drainage strategy. Confirmed application can be submitted as householder application. Typical decision time is 8 weeks.',
    recordedBy: 'Sarah Mitchell',
    recordedDate: '2025-10-15T16:00:00'
  },
  {
    id: 'mtg-005',
    title: 'Site inspection - neighbour concerns',
    type: 'site-visit',
    date: '2025-10-08',
    startTime: '10:00',
    endTime: '11:00',
    description: 'Site visit to assess concerns raised by neighbour at No. 121 regarding potential overshadowing and loss of privacy.',
    location: '123 High Street, London, SE1 1AA',
    photos: ['site-visit-08-10-2025-north-elevation.jpg', 'site-visit-08-10-2025-neighbour-boundary.jpg', 'site-visit-08-10-2025-existing-tree.jpg'],
    meetingNotes: 'Attended site with applicant and neighbour (No. 121). Examined proposed conservatory location on north side of property. Measured distance to boundary (3.2m) and assessed sunlight impact. Oak tree (T1) provides screening between properties. Conservatory will be single-storey (3m height) and will not overlook neighbour\'s garden due to existing fence (1.8m) and tree screening. Advised applicant to include shadow diagrams in submission to demonstrate minimal overshadowing impact. Neighbour concerns noted but not considered grounds for refusal given separation distance and existing screening.',
    recordedBy: 'Federico Carbo',
    recordedDate: '2025-10-08T11:30:00'
  }
];
