export interface Publication {
  id: number;
  title: string;
  authors: string;
  journal: string;
  year: number;
  volumeIssue?: string;
  doi?: string;
  link?: string;
  category: 'maternal' | 'neonatal' | 'preterm' | 'health-systems' | 'general';
  abstractPreview?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  institution: string;
  period: string;
  location: string;
  responsibilities: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  location: string;
  degree: string;
  date: string;
  details?: string;
}

export interface EditorialRole {
  role: 'Editor' | 'Reviewer';
  journal: string;
  section?: string;
}

export interface CertificateItem {
  title: string;
  organizer: string;
  date: string;
  category?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  category: 'Research Collaboration' | 'Peer Review Request' | 'Student Inquiry' | 'General';
  message: string;
  createdAt: string;
  read?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface AdminUser {
  username: string;
  token: string;
  role: 'admin';
  lastLogin: string;
}

export interface ProfileData {
  name: string;
  title: string;
  university: string;
  department: string;
  location: string;
  email: string;
  phone: string;
  nationality: string;
  languages: { language: string; level: string }[];
  bio: string;
  profileImage?: string;
  orcid?: string;
  googleScholar?: string;
  researchGate?: string;
  scopus?: string;
  officeHours?: string;
  stats: {
    publications: number;
    reviewerJournals: number;
    editorJournals: number;
    yearsExperience: number;
  };
}

