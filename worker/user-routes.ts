import { Hono } from "hono";
import type { Env } from './core-utils';
import { ok, bad } from './core-utils';
import type { WeeklyMenu, Bill, Complaint, StudentDashboardSummary, Student } from "@shared/types";
// --- MOCK DATA ---
const MOCK_MENU: WeeklyMenu = {
  Monday: { breakfast: ["Poha", "Jalebi"], lunch: ["Roti", "Dal Fry", "Rice", "Aloo Gobi"], dinner: ["Roti", "Paneer Butter Masala", "Rice"] },
  Tuesday: { breakfast: ["Upma", "Tea"], lunch: ["Roti", "Rajma", "Rice", "Salad"], dinner: ["Roti", "Mix Veg", "Dal"] },
  Wednesday: { breakfast: ["Idli", "Sambar"], lunch: ["Roti", "Chole", "Rice", "Raita"], dinner: ["Roti", "Sev Bhaji", "Rice"] },
  Thursday: { breakfast: ["Aloo Paratha", "Curd"], lunch: ["Roti", "Dal Makhani", "Rice", "Papad"], dinner: ["Roti", "Lauki Sabzi", "Dal"] },
  Friday: { breakfast: ["Dosa", "Chutney"], lunch: ["Roti", "Kadhi Pakoda", "Rice"], dinner: ["Roti", "Bhindi Fry", "Rice"] },
  Saturday: { breakfast: ["Bread Butter", "Jam"], lunch: ["Roti", "Mix Dal", "Rice", "Jeera Aloo"], dinner: ["Special Dinner", "Ice Cream"] },
  Sunday: { breakfast: ["Puri", "Sabzi"], lunch: ["Special Lunch"], dinner: ["Roti", "Aloo Matar", "Rice"] }
};
const MOCK_BILLS: Bill[] = [
  { id: 'b1', month: 'August 2024', amount: 3500, status: 'Due', dueDate: '2024-09-05T00:00:00.000Z' },
  { id: 'b2', month: 'July 2024', amount: 3500, status: 'Paid', dueDate: '2024-08-05T00:00:00.000Z', paidDate: '2024-08-02T00:00:00.000Z' },
  { id: 'b3', month: 'June 2024', amount: 3200, status: 'Paid', dueDate: '2024-07-05T00:00:00.000Z', paidDate: '2024-07-01T00:00:00.000Z' },
];
let MOCK_COMPLAINTS: Complaint[] = [
  { id: 'c1', title: 'Water quality is poor', description: 'The water from the cooler tastes weird. Please check it.', status: 'Resolved', submittedDate: '2024-08-15T10:00:00.000Z', resolvedDate: '2024-08-16T12:00:00.000Z', managerReply: 'We have cleaned the water cooler and replaced the filter.' },
  { id: 'c2', title: 'Roti is not cooked properly', description: 'The rotis served today were half-cooked.', status: 'In Progress', submittedDate: '2024-08-20T13:00:00.000Z', managerReply: 'We are looking into this with the kitchen staff.' },
  { id: 'c3', title: 'Mess hall cleanliness', description: 'The tables were not clean during lunch time.', status: 'Pending', submittedDate: '2024-08-22T14:00:00.000Z' },
];
const MOCK_STUDENTS: Student[] = [
    { id: 's1', name: 'Rohan Sharma', email: 'rohan.sharma@example.com', phone: '9876543210', roomNumber: 'A-101' },
    { id: 's2', name: 'Priya Patel', email: 'priya.patel@example.com', phone: '9876543211', roomNumber: 'B-204' },
    { id: 's3', name: 'Amit Singh', email: 'amit.singh@example.com', phone: '9876543212', roomNumber: 'A-102' },
];
const MOCK_STUDENT_REQUESTS: (Student & { status: 'Pending' })[] = [
    { id: 'sr1', name: 'Kavita Iyer', email: 'kavita.iyer@example.com', phone: '9123456780', roomNumber: 'C-301', status: 'Pending' },
    { id: 'sr2', name: 'Suresh Kumar', email: 'suresh.kumar@example.com', phone: '9123456781', roomNumber: 'D-110', status: 'Pending' },
];
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // --- STUDENT ROUTES ---
  app.get('/api/student/summary', (c) => {
    const summary: StudentDashboardSummary = {
      currentDue: { amount: 3500, dueDate: '2024-09-05T00:00:00.000Z' },
      todaysMenu: MOCK_MENU.Wednesday, // Assuming today is Wednesday for mock
      recentComplaints: MOCK_COMPLAINTS.slice(0, 2).map(({ id, title, status }) => ({ id, title, status })),
    };
    return ok(c, summary);
  });
  app.get('/api/student/menu', (c) => ok(c, MOCK_MENU));
  app.get('/api/student/billing', (c) => ok(c, MOCK_BILLS));
  app.get('/api/student/complaints', (c) => ok(c, MOCK_COMPLAINTS));
  app.post('/api/student/complaints', async (c) => {
    const { title, description } = await c.req.json();
    if (!title || !description) return bad(c, 'Title and description are required');
    const newComplaint: Complaint = {
      id: `c${MOCK_COMPLAINTS.length + 1}`,
      title,
      description,
      status: 'Pending',
      submittedDate: new Date().toISOString(),
    };
    MOCK_COMPLAINTS.unshift(newComplaint);
    return ok(c, newComplaint);
  });
  // --- MANAGER ROUTES ---
  app.get('/api/manager/stats', (c) => {
    const stats = {
        totalStudents: MOCK_STUDENTS.length,
        pendingRequests: MOCK_STUDENT_REQUESTS.length,
        monthlyRevenue: 85000,
        activeComplaints: MOCK_COMPLAINTS.filter(c => c.status !== 'Resolved').length,
    };
    return ok(c, stats);
  });
  app.get('/api/manager/students', (c) => ok(c, MOCK_STUDENTS));
  app.get('/api/manager/student-requests', (c) => ok(c, MOCK_STUDENT_REQUESTS));
  app.post('/api/manager/student-requests/:id', async (c) => {
    const { id } = c.req.param();
    const { action } = await c.req.json<{ action: 'approve' | 'reject' | 'hold' }>();
    // In a real app, you'd update the DB. Here we just return success.
    console.log(`Action: ${action} on student request ${id}`);
    return ok(c, { success: true, message: `Request ${id} has been ${action}d.` });
  });
  app.get('/api/manager/menu', (c) => ok(c, MOCK_MENU));
  app.put('/api/manager/menu', async (c) => {
    const updatedMenu = await c.req.json<WeeklyMenu>();
    // In a real app, save this to the DB. Here we just log it.
    console.log("Received menu update:", updatedMenu);
    // MOCK_MENU = updatedMenu; // This would update it in-memory for the worker instance
    return ok(c, { success: true, message: "Menu updated successfully." });
  });
}