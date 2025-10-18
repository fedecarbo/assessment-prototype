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
}

// Add more schemas as needed
