export type RelationType = 'self' | 'spouse' | 'child' | 'parent' | 'business' | 'other';

export type DocumentCategory = 
  | 'passport'
  | 'visa'
  | 'emirates_id'
  | 'driving_license'
  | 'car_registration'
  | 'car_insurance'
  | 'health_insurance'
  | 'subscription'
  | 'trade_license'
  | 'other';

export type DocumentStatus = 'safe' | 'upcoming' | 'urgent' | 'overdue';

export interface Profile {
  id: string;
  name: string;
  relation_type: RelationType;
  avatar_icon?: string;
  accent_color?: string;
  created_at: string;
}

export interface Document {
  id: string;
  profile_id: string;
  title: string;
  category: DocumentCategory;
  issue_date?: string;
  expiry_date?: string;
  status: DocumentStatus;
  notes?: string;
  file_url?: string;
  document_number?: string;
  holder_name?: string;
  nationality?: string;
  created_at: string;
}

export interface LifeHealthScore {
  score: number;
  safe_count: number;
  upcoming_count: number;
  urgent_count: number;
  overdue_count: number;
}
