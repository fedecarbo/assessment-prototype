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

export interface Constraint {
  id: string; // Unique identifier to allow multiple instances of same type
  type: 'conservation-area' | 'listed-building' | 'tpo' | 'flood-risk' | 'green-belt' | 'article-4' | 'archaeology';
  label: string;
  status: 'applies' | 'does-not-apply' | 'nearby' | 'partial';
  details?: string;
  value?: string; // For specific values like "Zone 1" or "Grade II"
}

export interface Document {
  id: string;
  name: string;
  category: 'drawings' | 'supporting' | 'evidence';
  uploadedDate: string;
  fileSize: string;
  fileType: 'pdf' | 'jpg' | 'png' | 'doc' | 'docx';
  tags?: string[]; // Tags describing what the document contains
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
  responseDate?: string;
  position: ConsulteePosition;
  summary?: string;
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

export interface PlanningApplication {
  id: string;
  reference: string;
  type: 'pre-application' | 'full-application';
  applicationType: string;
  applicantName: string;
  address: string;
  description: string;
  status: 'pending' | 'under-review' | 'approved' | 'rejected';
  submittedDate: string;
  validFrom: string;
  consultationEnd: string;
  expiryDate: string;
  isPublic: boolean;
  assignedTo?: string;
  assignedOfficer?: AssignedOfficer;
  requestedServices?: RequestedService[];
  documents?: Document[];
  constraints?: Constraint[];
  consulteeConsultation?: ConsulteeConsultation;
  neighbourConsultation?: NeighbourConsultation;
  // Stage workflow with tasks
  validation: ValidationStage;
  consultation: ConsultationStage;
  assessment: AssessmentStage;
  review: ReviewStage;
}

// Add more schemas as needed
