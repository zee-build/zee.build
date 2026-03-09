import { DocumentStatus, LifeHealthScore, Document } from './types';

export function calculateDocumentStatus(expiryDate: string | undefined): DocumentStatus {
  if (!expiryDate) return 'safe';
  
  const expiry = new Date(expiryDate);
  const today = new Date();
  const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiry < 0) return 'overdue';
  if (daysUntilExpiry <= 30) return 'urgent';
  if (daysUntilExpiry <= 60) return 'upcoming';
  return 'safe';
}

export function calculateLifeHealthScore(documents: Document[]): LifeHealthScore {
  const statusCounts = {
    safe: 0,
    upcoming: 0,
    urgent: 0,
    overdue: 0,
  };
  
  documents.forEach(doc => {
    const status = doc.status || calculateDocumentStatus(doc.expiry_date);
    statusCounts[status]++;
  });
  
  let score = 100;
  
  // Reduce score based on document status
  score -= statusCounts.upcoming * 5;
  score -= statusCounts.urgent * 15;
  score -= statusCounts.overdue * 30;
  
  // Ensure score doesn't go below 0
  score = Math.max(0, score);
  
  return {
    score,
    safe_count: statusCounts.safe,
    upcoming_count: statusCounts.upcoming,
    urgent_count: statusCounts.urgent,
    overdue_count: statusCounts.overdue,
  };
}

export function formatDaysUntilExpiry(expiryDate: string | undefined): string {
  if (!expiryDate) return 'No expiry date';
  
  const expiry = new Date(expiryDate);
  const today = new Date();
  const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiry < 0) {
    const daysOverdue = Math.abs(daysUntilExpiry);
    return `${daysOverdue} day${daysOverdue === 1 ? '' : 's'} overdue`;
  }
  
  if (daysUntilExpiry === 0) return 'Expires today';
  if (daysUntilExpiry === 1) return 'Expires tomorrow';
  
  return `${daysUntilExpiry} days remaining`;
}

export function getRelativeTime(dateString: string | undefined): string {
  if (!dateString) return 'Unknown';
  
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    const absDays = Math.abs(diffDays);
    if (absDays === 1) return 'Yesterday';
    if (absDays < 30) return `${absDays} days ago`;
    const diffMonths = Math.floor(absDays / 30);
    if (diffMonths === 1) return '1 month ago';
    if (diffMonths < 12) return `${diffMonths} months ago`;
    return `${Math.floor(diffMonths / 12)} years ago`;
  }
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays < 30) return `In ${diffDays} days`;
  
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return 'In 1 month';
  if (diffMonths < 12) return `In ${diffMonths} months`;
  return `In ${Math.floor(diffMonths / 12)} years`;
}

export function getRelationTypeColor(relationType: string): string {
  const colors: Record<string, string> = {
    self: 'rgb(45 212 191)', // Teal
    spouse: 'rgb(139 92 246)', // Violet
    child: 'rgb(16 185 129)', // Emerald
    parent: 'rgb(56 189 248)', // Blue
    business: 'rgb(250 204 21)', // Yellow
    other: 'rgb(148 163 184)', // Slate
  };
  
  return colors[relationType] || colors.other;
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    passport: 'Passport',
    visa: 'Visa',
    emirates_id: 'Emirates ID',
    driving_license: 'Driving License',
    car_registration: 'Car Registration',
    car_insurance: 'Car Insurance',
    health_insurance: 'Health Insurance',
    subscription: 'Subscription',
    trade_license: 'Trade License',
    other: 'Other',
  };
  
  return labels[category] || category;
}

export function getRelationTypeLabel(relationType: string): string {
  const labels: Record<string, string> = {
    self: 'Self',
    spouse: 'Spouse',
    child: 'Child',
    parent: 'Parent',
    business: 'Business',
    other: 'Other',
  };
  
  return labels[relationType] || relationType;
}
