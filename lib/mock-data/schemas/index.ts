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
  uploadedBy: string;
  uploadedDate: string;
  fileSize: string;
  fileType: 'pdf' | 'jpg' | 'png' | 'doc' | 'docx';
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
  // Stage workflow tracking (legacy - kept for backward compatibility)
  validationStatus: 'pending' | 'validated' | 'rejected';
  validationDate?: string;
  consultationStatus: 'not-started' | 'in-progress' | 'completed';
  consultationStartDate?: string;
  assessmentStatus: 'not-started' | 'in-progress' | 'completed';
  assessmentStartDate?: string;
  reviewStatus: 'not-started' | 'in-progress' | 'completed';
  reviewStartDate?: string;
  // Enhanced stage workflow with tasks
  validation: ValidationStage;
  consultation: ConsultationStage;
  assessment: AssessmentStage;
  review: ReviewStage;
}

// Add more schemas as needed
