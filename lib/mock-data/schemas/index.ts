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

export interface PlanningApplication {
  id: string;
  reference: string;
  type: 'pre-application' | 'full-application';
  applicantName: string;
  address: string;
  description: string;
  status: 'pending' | 'under-review' | 'approved' | 'rejected';
  submittedDate: string;
  assignedTo?: string;
}

// Add more schemas as needed
