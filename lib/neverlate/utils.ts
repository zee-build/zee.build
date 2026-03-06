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

export function getRelationTypeColor(relationType: string): string {
  const colors: Record<string, string> = {
    self: 'rgb(99 102 241)', // Indigo
    spouse: 'rgb(236 72 153)', // Pink
    child: 'rgb(34 197 94)', // Green
    parent: 'rgb(251 191 36)', // Amber
    business: 'rgb(139 92 246)', // Purple
    other: 'rgb(107 114 128)', // Gray
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
