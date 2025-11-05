import { Entity, IndexedEntity } from "./core-utils";
import type {
  MessSettings,
  WeeklyMenu,
  Student,
  StudentRegistrationData,
  Complaint,
  Suggestion,
  Bill,
} from "@shared/types";
// --- SEED DATA ---
const SEED_SETTINGS: MessSettings = {
  monthlyAmount: 3500,
  rules: [
    "Mess timings must be strictly followed.",
    "Wastage of food is strictly prohibited.",
    "Students must maintain cleanliness in the mess hall.",
    "Outside food is not allowed inside the mess hall.",
    "Monthly dues must be cleared by the 5th of each month.",
  ],
};
const SEED_MENU: WeeklyMenu = {
  Monday: { breakfast: ["Poha", "Jalebi"], lunch: ["Roti", "Dal Fry", "Rice", "Aloo Gobi"], dinner: ["Roti", "Paneer Butter Masala", "Rice"] },
  Tuesday: { breakfast: ["Upma", "Tea"], lunch: ["Roti", "Rajma", "Rice", "Salad"], dinner: ["Roti", "Mix Veg", "Dal"] },
  Wednesday: { breakfast: ["Idli", "Sambar"], lunch: ["Roti", "Chole", "Rice", "Raita"], dinner: ["Roti", "Sev Bhaji", "Rice"] },
  Thursday: { breakfast: ["Aloo Paratha", "Curd"], lunch: ["Roti", "Dal Makhani", "Rice", "Papad"], dinner: ["Roti", "Lauki Sabzi", "Dal"] },
  Friday: { breakfast: ["Dosa", "Chutney"], lunch: ["Roti", "Kadhi Pakoda", "Rice"], dinner: ["Roti", "Bhindi Fry", "Rice"] },
  Saturday: { breakfast: ["Bread Butter", "Jam"], lunch: ["Roti", "Mix Dal", "Rice", "Jeera Aloo"], dinner: ["Special Dinner", "Ice Cream"] },
  Sunday: { breakfast: ["Puri", "Sabzi"], lunch: ["Special Lunch"], dinner: ["Roti", "Aloo Matar", "Rice"] }
};
const SEED_STUDENTS: (Student & { password?: string })[] = [
  { id: 's1', name: 'Rohan Sharma', email: 'rohan.sharma@example.com', phone: '9876543210', roomNumber: 'A-101', password: 'password123' },
  { id: 's2', name: 'Priya Patel', email: 'priya.patel@example.com', phone: '9876543211', roomNumber: 'B-204', password: 'password123' },
  { id: 's3', name: 'Amit Singh', email: 'amit.singh@example.com', phone: '9876543212', roomNumber: 'A-102', password: 'password123' },
  { id: 's4', name: 'Sunita Gupta', email: 'sunita.gupta@example.com', phone: '9876543213', roomNumber: 'C-401', password: 'password123' },
];
const SEED_STUDENT_REQUESTS: (StudentRegistrationData & { id: string })[] = [
  { id: 'sr1', name: 'Kavita Iyer', email: 'kavita.iyer@example.com', phone: '9123456780', roomNumber: 'C-301', password: 'password123' },
  { id: 'sr2', name: 'Suresh Kumar', email: 'suresh.kumar@example.com', phone: '9123456781', roomNumber: 'D-110', password: 'password123' },
];
const SEED_COMPLAINTS: Complaint[] = [
  { id: 'c1', title: 'Water quality is poor', description: 'The water from the cooler tastes weird. Please check it.', status: 'Resolved', submittedDate: '2025-08-15T10:00:00.000Z', resolvedDate: '2025-08-16T12:00:00.000Z', managerReply: 'We have cleaned the water cooler and replaced the filter.' },
  { id: 'c2', title: 'Roti is not cooked properly', description: 'The rotis served today were half-cooked.', status: 'In Progress', submittedDate: '2025-08-20T13:00:00.000Z', managerReply: 'We are looking into this with the kitchen staff.', imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800' },
  { id: 'c3', title: 'Mess hall cleanliness', description: 'The tables were not clean during lunch time.', status: 'Pending', submittedDate: '2025-08-22T14:00:00.000Z' },
];
const SEED_SUGGESTIONS: Suggestion[] = [
  { id: 'sug1', text: 'Can we have a feedback box in the mess hall?', submittedDate: '2025-08-25T11:30:00.000Z', studentName: 'Priya Patel' },
  { id: 'sug2', text: 'It would be great to have more variety in the Sunday special dinner.', submittedDate: '2025-08-26T15:00:00.000Z', studentName: 'Rohan Sharma' },
];
const SEED_BILLS: Bill[] = [
  { id: 'b1', studentId: 's1', month: 'August 2025', amount: 3500, status: 'Due', dueDate: '2025-09-05T00:00:00.000Z' },
  { id: 'b2', studentId: 's2', month: 'July 2025', amount: 3500, status: 'Paid', dueDate: '2025-08-05T00:00:00.000Z', paidDate: '2025-08-02T00:00:00.000Z' },
  { id: 'b3', studentId: 's3', month: 'June 2025', amount: 3200, status: 'Paid', dueDate: '2025-07-05T00:00:00.000Z', paidDate: '2025-07-01T00:00:00.000Z' },
];
// --- ENTITY DEFINITIONS ---
// Singleton entity for app-wide settings
export class SettingsEntity extends Entity<MessSettings> {
  static readonly entityName = "settings";
  static readonly initialState: MessSettings = { monthlyAmount: 0, rules: [] };
  static seedData = SEED_SETTINGS;
  constructor(env: Env) { super(env, "singleton"); }
}
// Singleton entity for the weekly menu
export class MenuEntity extends Entity<WeeklyMenu> {
  static readonly entityName = "menu";
  static readonly initialState: WeeklyMenu = { Monday: { breakfast: [], lunch: [], dinner: [] }, Tuesday: { breakfast: [], lunch: [], dinner: [] }, Wednesday: { breakfast: [], lunch: [], dinner: [] }, Thursday: { breakfast: [], lunch: [], dinner: [] }, Friday: { breakfast: [], lunch: [], dinner: [] }, Saturday: { breakfast: [], lunch: [], dinner: [] }, Sunday: { breakfast: [], lunch: [], dinner: [] } };
  static seedData = SEED_MENU;
  constructor(env: Env) { super(env, "singleton"); }
}
// Indexed entity for Students
export class StudentEntity extends IndexedEntity<Student & { password?: string }> {
  static readonly entityName = "student";
  static readonly indexName = "students";
  static readonly initialState: Student & { password?: string } = { id: "", name: "", email: "", phone: "", roomNumber: "", password: "" };
  static seedData = SEED_STUDENTS;
}
// Indexed entity for Student Registration Requests
export class StudentRequestEntity extends IndexedEntity<StudentRegistrationData & { id: string }> {
  static readonly entityName = "studentRequest";
  static readonly indexName = "studentRequests";
  static readonly initialState: StudentRegistrationData & { id: string } = { id: "", name: "", email: "", phone: "", roomNumber: "", password: "" };
  static seedData = SEED_STUDENT_REQUESTS;
}
// Indexed entity for Complaints
export class ComplaintEntity extends IndexedEntity<Complaint> {
  static readonly entityName = "complaint";
  static readonly indexName = "complaints";
  static readonly initialState: Complaint = { id: "", title: "", description: "", status: "Pending", submittedDate: "" };
  static seedData = SEED_COMPLAINTS;
}
// Indexed entity for Suggestions
export class SuggestionEntity extends IndexedEntity<Suggestion> {
  static readonly entityName = "suggestion";
  static readonly indexName = "suggestions";
  static readonly initialState: Suggestion = { id: "", text: "", submittedDate: "", studentName: "" };
  static seedData = SEED_SUGGESTIONS;
}
// Indexed entity for Bills
export class BillEntity extends IndexedEntity<Bill> {
  static readonly entityName = "bill";
  static readonly indexName = "bills";
  static readonly initialState: Bill = { id: "", studentId: "", month: "", amount: 0, status: "Due", dueDate: "" };
  static seedData = SEED_BILLS;
}
// Dummy entities for data that is not persisted in this phase but might be in the future
export class BroadcastEntity extends Entity<{ id: string, message: string, sentDate: string }> {
    static readonly entityName = "broadcast";
    static readonly initialState = { id: "", message: "", sentDate: "" };
}
export class GuestPaymentEntity extends Entity<{ id: string, name: string, phone: string, amount: number, paymentDate: string }> {
    static readonly entityName = "guestPayment";
    static readonly initialState = { id: "", name: "", phone: "", amount: 0, paymentDate: "" };
}