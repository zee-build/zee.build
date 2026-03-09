import { Profile, Document } from './types';

const STORAGE_KEYS = {
  PROFILES: 'neverlate_profiles',
  DOCUMENTS: 'neverlate_documents',
};

// Profiles
export function getProfiles(): Profile[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.PROFILES);
  return data ? JSON.parse(data) : [];
}

export function getProfile(profileId: string): Profile | null {
  return getProfiles().find(p => p.id === profileId) ?? null;
}
export function saveProfile(profile: Profile): void {
  const profiles = getProfiles();
  const existingIndex = profiles.findIndex(p => p.id === profile.id);
  
  if (existingIndex >= 0) {
    profiles[existingIndex] = profile;
  } else {
    profiles.push(profile);
  }
  
  localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
}

export function deleteProfile(profileId: string): void {
  const profiles = getProfiles().filter(p => p.id !== profileId);
  localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
  
  // Also delete associated documents
  const documents = getDocuments().filter(d => d.profile_id !== profileId);
  localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
}

// Documents
export function getDocuments(): Document[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
  return data ? JSON.parse(data) : [];
}

export function getDocumentsByProfile(profileId: string): Document[] {
  return getDocuments().filter(d => d.profile_id === profileId);
}

export function saveDocument(document: Document): void {
  const documents = getDocuments();
  const existingIndex = documents.findIndex(d => d.id === document.id);
  
  if (existingIndex >= 0) {
    documents[existingIndex] = document;
  } else {
    documents.push(document);
  }
  
  localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
}

export function deleteDocument(documentId: string): void {
  const documents = getDocuments().filter(d => d.id !== documentId);
  localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

