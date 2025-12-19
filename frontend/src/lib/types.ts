/**
 * Type definitions for 1000 Hills Solicitors
 */

export enum Role {
  CLIENT = 'CLIENT',
  CASE_MANAGER = 'CASE_MANAGER',
  CONTENT_EDITOR = 'CONTENT_EDITOR',
  SUPER_ADMIN = 'SUPER_ADMIN',
  VIEWER = 'VIEWER',
}

export enum CaseStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  AWAITING_CLIENT = 'AWAITING_CLIENT',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum CaseCategory {
  IMMIGRATION = 'IMMIGRATION',
  FAMILY_LAW = 'FAMILY_LAW',
  CRIMINAL_DEFENSE = 'CRIMINAL_DEFENSE',
  CIVIL_LITIGATION = 'CIVIL_LITIGATION',
  CORPORATE_LAW = 'CORPORATE_LAW',
  PROPERTY_LAW = 'PROPERTY_LAW',
  EMPLOYMENT_LAW = 'EMPLOYMENT_LAW',
  OTHER = 'OTHER',
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
  email_verified: boolean;
  created_at: string;
}

export interface Case {
  id: number;
  title: string;
  description: string;
  status: CaseStatus;
  category: CaseCategory;
  priority: Priority;
  client_id: number;
  assigned_to_id?: number;
  created_at: string;
  updated_at: string;
  client?: User;
  assigned_to?: User;
}

export interface Message {
  id: number;
  content: string;
  case_id: number;
  sender_id: number;
  recipient_id: number;
  read: boolean;
  created_at: string;
  sender?: User;
  recipient?: User;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  category: string;
  created_at: string;
}

export interface Notification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  created_at: string;
}
