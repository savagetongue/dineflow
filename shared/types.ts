export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
// Core User Roles
export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  roomNumber: string;
}
export interface Manager {
  id: string;
  name: string;
  email: string;
}
export interface Admin {
  id: string;
  name: string;
  email: string;
}
// Menu System
export interface MenuItem {
  breakfast: string[];
  lunch: string[];
  dinner: string[];
}
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
export type WeeklyMenu = Record<DayOfWeek, MenuItem>;
// Billing System
export type BillStatus = 'Paid' | 'Due' | 'Overdue';
export interface Bill {
  id: string;
  month: string; // e.g., "July 2024"
  amount: number;
  status: BillStatus;
  dueDate: string; // ISO string
  paidDate?: string; // ISO string
}
// Feedback System
export type ComplaintStatus = 'Pending' | 'In Progress' | 'Resolved';
export interface Complaint {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  status: ComplaintStatus;
  submittedDate: string; // ISO string
  resolvedDate?: string; // ISO string
  managerReply?: string;
}
export interface Suggestion {
  id: string;
  text: string;
  submittedDate: string; // ISO string
}
// Dashboard specific types
export interface StudentDashboardSummary {
  currentDue: {
    amount: number;
    dueDate: string;
  };
  todaysMenu: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
  };
  recentComplaints: Pick<Complaint, 'id' | 'title' | 'status'>[];
}
// Authentication
export interface AuthResponse {
  token: string;
  role: 'student' | 'manager' | 'admin';
  user: {
    id: string;
    name: string;
    email: string;
  };
}