// Type-safe schemas for mock data

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user' | 'guest';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

export interface AssignedOfficer {
  id: string;
  name: string;
  avatar?: string;
}

export interface StageTask {
  id: string;
  title: string;
  completed: boolean;
  completedDate?: string;
}

export interface ValidationStage {
  status: 'pending' | 'validated' | 'rejected';
  validatedDate?: string;
  tasks: StageTask[];
}

export interface ConsultationStage {
  status: 'not-started' | 'in-progress' | 'completed';
  startDate?: string;
  endDate?: string;
  tasks: StageTask[];
}

export interface AssessmentStage {
  status: 'not-started' | 'in-progress' | 'completed';
  startDate?: string;
  completedDate?: string;
  tasks: StageTask[];
}

export interface ReviewStage {
  status: 'not-started' | 'in-progress' | 'completed';
  startDate?: string;
  completedDate?: string;
  tasks: StageTask[];
}

export type RequestedService = 'written-advice' | 'site-visit' | 'meeting';

export interface ServiceRecord {
  id: string;
  service: RequestedService;
  status: 'included' | 'added' | 'removed';
  cost: number;
  addedDate?: string;
  addedBy?: string;
  notes?: string;
  requiresApproval?: boolean;
  approvedBy?: string;
  approvedDate?: string;
}

// GeoJSON geometry types for constraints
export type ConstraintGeometry = {
  type: 'Point'
  coordinates: [number, number] // [longitude, latitude]
} | {
  type: 'Polygon'
  coordinates: [number, number][][] // Array of rings, each ring is array of [lon, lat]
} | {
  type: 'MultiPolygon'
  coordinates: [number, number][][][] // Array of polygons
}

export interface Constraint {
  id: string; // Unique identifier to allow multiple instances of same type
  type: 'conservation-area' | 'listed-building' | 'tpo' | 'flood-risk' | 'green-belt' | 'article-4' | 'archaeology';
  label: string; // Constraint type label (e.g., "Special area of conservation", "Conservation area")
  entity: string; // Specific entity name (e.g., "Wimbledon Common", "Southwark Cathedral")
  status: 'applies' | 'does-not-apply' | 'nearby' | 'partial';
  details?: string;
  value?: string; // For specific values like "Zone 1" or "Grade II"
  category?: string; // e.g., "Heritage and conservation", "Ecology", "Flooding"
  source?: string; // e.g., "PlanX", "Planning Data", "Historic England"
  color?: string; // Hex color for map display
  geometry?: ConstraintGeometry; // GeoJSON geometry for map display
  planningDataEntity?: number; // planning.data.gov.uk entity ID
  reference?: string; // Original reference number (e.g., Historic England list entry)
}

export interface Document {
  id: string;
  name: string;
  category: 'drawings' | 'supporting' | 'evidence';
  uploadedDate: string;
  fileSize: string;
  fileType: 'pdf' | 'jpg' | 'png' | 'doc' | 'docx';
  tags?: string[]; // Tags describing what the document contains
  version?: string; // Document version (e.g., "v1", "v2", "Rev A")
  visibility: 'public' | 'sensitive'; // Whether document is publicly visible or sensitive
}

export type ConsultationTopic = 'design' | 'privacy' | 'loss-of-light' | 'traffic' | 'accessibility' | 'noise' | 'other';

export interface TopicSummary {
  topic: ConsultationTopic;
  label: string;
  count: number;
  aiSummary: string; // 2-3 sentence AI-generated summary of comments on this topic
}

export interface NeighbourResponse {
  id: string;
  respondentName: string;
  address: string;
  responseDate: string;
  position: 'support' | 'object' | 'neutral';
  topics: ConsultationTopic[];
  summary: string;
}

export interface NeighbourConsultation {
  totalNotified: number;
  totalResponses: number;
  supportCount: number;
  objectCount: number;
  neutralCount: number;
  briefSummary: string;
  topicSummaries: TopicSummary[];
  responses?: NeighbourResponse[];
}

export type ConsulteePosition = 'no-objection' | 'objection' | 'amendments-needed' | 'not-contacted' | 'awaiting-response';

export interface ConsulteeResponse {
  id: string;
  consulteeOrg: string;
  type: 'internal' | 'external';
  responseDate?: string;
  position: ConsulteePosition;
  summary?: string; // AI-generated 2-3 line summary
  commentCount: number; // Total number of comments in the conversation
}

export interface ConsulteeConsultation {
  totalConsultees: number;
  totalResponses: number;
  noObjectionCount: number;
  objectionCount: number;
  amendmentsNeededCount: number;
  notContactedCount: number;
  awaitingResponseCount: number;
  briefSummary: string;
  responses: ConsulteeResponse[];
}

export type ApplicantRequestStatus = 'pending' | 'responded' | 'overdue';

export interface ApplicantRequest {
  id: string;
  subject: string;
  description: string;
  requestType: 'information' | 'document' | 'general'; // Flexible type, not enforced in UI
  status: ApplicantRequestStatus;
  sentDate: string;
  dueDate?: string;
  sentBy: string; // Officer name who sent the request
  viewedByOfficer?: boolean; // Track if response has been viewed
  response?: {
    receivedDate: string;
    message: string;
    attachments?: string[]; // File names for mock data
  };
}

export interface PlanningApplication {
  id: string;
  reference: string;
  type: 'pre-application' | 'full-application';
  applicationType: string;
  applicantName: string;
  address: string;
  description: string;
  status: 'not-started' | 'in-validation' | 'in-assessment' | 'in-review' | 'closed' | 'withdrawn';
  submittedDate: string;
  validFrom: string;
  consultationEnd: string;
  expiryDate: string;
  isPublic: boolean;
  assignedTo?: string;
  assignedOfficer?: AssignedOfficer;
  requestedServices?: RequestedService[];
  serviceRecords?: ServiceRecord[];
  totalServiceCost?: number;
  documents?: Document[];
  constraints?: Constraint[];
  consulteeConsultation?: ConsulteeConsultation;
  neighbourConsultation?: NeighbourConsultation;
  applicantRequests?: ApplicantRequest[];
  // Stage workflow with tasks
  validation: ValidationStage;
  consultation: ConsultationStage;
  assessment: AssessmentStage;
  review: ReviewStage;
  // Additional site and payment details
  parish?: string;
  ward?: string;
  wardType?: string;
  uprn?: string;
  workStarted?: boolean;
  paymentReference?: string;
  paymentAmount?: number;
  sessionId?: string;
  locationUrl?: string;
  // Property boundary geometry for map display
  propertyBoundary?: {
    type: 'Polygon';
    coordinates: [number, number][][]; // GeoJSON polygon format
  };
  // Outcome tracking (only for closed applications)
  outcome?: 'likely-supported' | 'likely-supported-with-changes' | 'unlikely-supported';
  outcomeDate?: string;
}

// Type alias for backward compatibility
export type Application = PlanningApplication

// Add more schemas as needed
