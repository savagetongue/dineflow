import { Entity, IndexedEntity, Env } from "./core-utils";
import type {
  MessSettings,
  WeeklyMenu,
  Student,
  StudentRegistrationData,
  Complaint,
  Suggestion,
  Bill 
} from "@shared/types";
export class SettingsEntity extends Entity<MessSettings> {
  static readonly entityName = "settings";
  static readonly initialState: MessSettings = { monthlyAmount: 0, rules: [] };
  constructor(env: Env) {super(env, "singleton");}
}
export class MenuEntity extends Entity<WeeklyMenu> {
  static readonly entityName = "menu";
  static readonly initialState: WeeklyMenu = { Monday: { breakfast: [], lunch: [], dinner: [] }, Tuesday: { breakfast: [], lunch: [], dinner: [] }, Wednesday: { breakfast: [], lunch: [], dinner: [] }, Thursday: { breakfast: [], lunch: [], dinner: [] }, Friday: { breakfast: [], lunch: [], dinner: [] }, Saturday: { breakfast: [], lunch: [], dinner: [] }, Sunday: { breakfast: [], lunch: [], dinner: [] } };
  constructor(env: Env) {super(env, "singleton");}
}
export class StudentEntity extends IndexedEntity<Student & {password?: string;}> {
  static readonly entityName = "student";
  static readonly indexName = "students";
  static readonly initialState: Student & {password?: string;} = { id: "", name: "", email: "", phone: "", roomNumber: "", password: "" };
}
export class StudentRequestEntity extends IndexedEntity<StudentRegistrationData & {id: string;}> {
  static readonly entityName = "studentRequest";
  static readonly indexName = "studentRequests";
  static readonly initialState: StudentRegistrationData & {id: string;} = { id: "", name: "", email: "", phone: "", roomNumber: "", password: "" };
}
export class ComplaintEntity extends IndexedEntity<Complaint> {
  static readonly entityName = "complaint";
  static readonly indexName = "complaints";
  static readonly initialState: Complaint = { id: "", title: "", description: "", status: "Pending", submittedDate: "" };
}
export class SuggestionEntity extends IndexedEntity<Suggestion> {
  static readonly entityName = "suggestion";
  static readonly indexName = "suggestions";
  static readonly initialState: Suggestion = { id: "", text: "", submittedDate: "", studentName: "" };
}
export class BillEntity extends IndexedEntity<Bill> {
  static readonly entityName = "bill";
  static readonly indexName = "bills";
  static readonly initialState: Bill = { id: "", studentId: "", month: "", amount: 0, status: "Due", dueDate: "" };
}
export class BroadcastEntity extends Entity<{id: string;message: string;sentDate: string;}> {
  static readonly entityName = "broadcast";
  static readonly initialState = { id: "", message: "", sentDate: "" };
}
export class GuestPaymentEntity extends Entity<{id: string;name: string;phone: string;amount: number;paymentDate: string;}> {
  static readonly entityName = "guestPayment";
  static readonly initialState = { id: "", name: "", phone: "", amount: 0, paymentDate: "" };
}