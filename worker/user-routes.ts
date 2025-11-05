import { Hono } from "hono";
import type { Env } from './core-utils';
import { ok, bad, notFound } from './core-utils';
import type { WeeklyMenu, Bill, Complaint, StudentDashboardSummary, Student, AuthResponse, StudentRegistrationData, MessSettings, AuthRequest, Suggestion } from "@shared/types";
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
  { id: 'b1', month: 'August 2025', amount: 3500, status: 'Due', dueDate: '2025-09-05T00:00:00.000Z' },
  { id: 'b2', month: 'July 2025', amount: 3500, status: 'Paid', dueDate: '2025-08-05T00:00:00.000Z', paidDate: '2025-08-02T00:00:00.000Z' },
  { id: 'b3', month: 'June 2025', amount: 3200, status: 'Paid', dueDate: '2025-07-05T00:00:00.000Z', paidDate: '2025-07-01T00:00:00.000Z' },
];
let MOCK_COMPLAINTS: Complaint[] = [
  { id: 'c1', title: 'Water quality is poor', description: 'The water from the cooler tastes weird. Please check it.', status: 'Resolved', submittedDate: '2025-08-15T10:00:00.000Z', resolvedDate: '2025-08-16T12:00:00.000Z', managerReply: 'We have cleaned the water cooler and replaced the filter.' },
  { id: 'c2', title: 'Roti is not cooked properly', description: 'The rotis served today were half-cooked.', status: 'In Progress', submittedDate: '2025-08-20T13:00:00.000Z', managerReply: 'We are looking into this with the kitchen staff.', imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800' },
  { id: 'c3', title: 'Mess hall cleanliness', description: 'The tables were not clean during lunch time.', status: 'Pending', submittedDate: '2025-08-22T14:00:00.000Z' },
];
let MOCK_SUGGESTIONS: Suggestion[] = [
    { id: 'sug1', text: 'Can we have a feedback box in the mess hall?', submittedDate: '2025-08-25T11:30:00.000Z', studentName: 'Priya Patel' },
    { id: 'sug2', text: 'It would be great to have more variety in the Sunday special dinner.', submittedDate: '2025-08-26T15:00:00.000Z', studentName: 'Rohan Sharma' },
];
let MOCK_STUDENTS: (Student & { password?: string })[] = [
    { id: 's1', name: 'Rohan Sharma', email: 'rohan.sharma@example.com', phone: '9876543210', roomNumber: 'A-101', password: 'password123' },
    { id: 's2', name: 'Priya Patel', email: 'priya.patel@example.com', phone: '9876543211', roomNumber: 'B-204', password: 'password123' },
    { id: 's3', name: 'Amit Singh', email: 'amit.singh@example.com', phone: '9876543212', roomNumber: 'A-102', password: 'password123' },
    { id: 's4', name: 'Sunita Gupta', email: 'sunita.gupta@example.com', phone: '9876543213', roomNumber: 'C-401', password: 'password123' },
];
let MOCK_STUDENT_REQUESTS: (StudentRegistrationData & { id: string; status: 'Pending' })[] = [
    { id: 'sr1', name: 'Kavita Iyer', email: 'kavita.iyer@example.com', phone: '9123456780', roomNumber: 'C-301', status: 'Pending', password: 'password123' },
    { id: 'sr2', name: 'Suresh Kumar', email: 'suresh.kumar@example.com', phone: '9123456781', roomNumber: 'D-110', status: 'Pending', password: 'password123' },
];
let MOCK_BROADCASTS = [
    { id: 'br1', message: 'The mess will be closed for dinner on Sunday, 25th August, for pest control maintenance. Inconvenience is regretted.', sentDate: '2025-08-23T11:00:00.000Z' },
    { id: 'br2', message: 'Reminder: Please clear your monthly dues by the 5th of September to avoid late fees.', sentDate: '2025-08-20T15:30:00.000Z' },
];
const MOCK_GUEST_PAYMENTS = [
    { id: 'gp1', name: 'Visitor A', phone: '8888888880', amount: 75, paymentDate: '2025-08-28T13:05:00.000Z' },
    { id: 'gp2', name: 'Visitor B', phone: '8888888881', amount: 75, paymentDate: '2025-08-28T19:15:00.000Z' },
    { id: 'gp3', name: 'Visitor C', phone: '8888888882', amount: 75, paymentDate: '2025-08-29T12:55:00.000Z' },
];
let MOCK_SETTINGS: MessSettings = {
    monthlyAmount: 3500,
    rules: [
        "Mess timings must be strictly followed.",
        "Wastage of food is strictly prohibited.",
        "Students must maintain cleanliness in the mess hall.",
        "Outside food is not allowed inside the mess hall.",
        "Monthly dues must be cleared by the 5th of each month.",
    ],
};
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // --- AUTHENTICATION & REGISTRATION ROUTES ---
  app.post('/api/auth/student/login', async (c) => {
    const { email, password } = await c.req.json<AuthRequest>();
    const student = MOCK_STUDENTS.find(s => s.email === email && s.password === password);
    if (student) {
      const response: AuthResponse = {
        token: `mock-token-student-${student.id}`,
        role: 'student',
        user: { id: student.id, name: student.name, email: student.email },
      };
      return ok(c, response);
    }
    const pendingRequest = MOCK_STUDENT_REQUESTS.find(req => req.email === email);
    if (pendingRequest) {
        return bad(c, 'Your account is pending manager approval.', 403);
    }
    return bad(c, 'Invalid email or password', 401);
  });
  app.post('/api/auth/login', async (c) => {
    const { email, password, role } = await c.req.json<{ email: string, password: string, role: 'manager' | 'admin' }>();
    if (role === 'manager' && email === 'manager@dineflow.com' && password === 'password') {
      const response: AuthResponse = {
        token: 'mock-token-manager',
        role: 'manager',
        user: { id: 'm1', name: 'Mr. Manager', email: 'manager@dineflow.com' },
      };
      return ok(c, response);
    }
    if (role === 'admin' && email === 'admin@dineflow.com' && password === 'password') {
      const response: AuthResponse = {
        token: 'mock-token-admin',
        role: 'admin',
        user: { id: 'a1', name: 'Ms. Admin', email: 'admin@dineflow.com' },
      };
      return ok(c, response);
    }
    return bad(c, 'Invalid credentials', 401);
  });
  app.post('/api/student/register', async (c) => {
    const data = await c.req.json<StudentRegistrationData>();
    if (!data.name || !data.email || !data.phone || !data.roomNumber || !data.password) {
        return bad(c, 'All fields are required.');
    }
    const newRequest = {
        ...data,
        id: `sr${MOCK_STUDENT_REQUESTS.length + 3}`, // a unique ID
        status: 'Pending' as const,
    };
    MOCK_STUDENT_REQUESTS.push(newRequest);
    console.log('New student request received:', newRequest);
    return ok(c, { success: true, message: 'Registration successful! Your request is pending approval.' });
  });
  // --- GUEST ROUTES ---
  app.post('/api/guest/pay', async (c) => {
    const { name, phone, amount } = await c.req.json();
    console.log(`Guest payment received: Name: ${name}, Phone: ${phone}, Amount: ${amount}`);
    return ok(c, { success: true, message: 'Payment successful' });
  });
  // --- MOCK UPLOAD ROUTE ---
  app.post('/api/upload', (c) => {
    // Simulate an image upload and return a placeholder URL
    return ok(c, { url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800' });
  });
  // --- PUBLIC/SETTINGS ROUTES ---
  app.get('/api/settings', (c) => {
    return ok(c, MOCK_SETTINGS);
  });
  // --- STUDENT ROUTES ---
  app.get('/api/student/summary', (c) => {
    const summary: StudentDashboardSummary = {
      currentDue: { amount: MOCK_SETTINGS.monthlyAmount, dueDate: '2025-09-05T00:00:00.000Z' },
      todaysMenu: MOCK_MENU.Wednesday, // Assuming today is Wednesday for mock
      recentComplaints: MOCK_COMPLAINTS.slice(0, 2).map(({ id, title, status }) => ({ id, title, status })),
    };
    return ok(c, summary);
  });
  app.get('/api/student/menu', (c) => ok(c, MOCK_MENU));
  app.get('/api/student/billing', (c) => ok(c, MOCK_BILLS));
  app.get('/api/student/complaints', (c) => ok(c, MOCK_COMPLAINTS));
  app.post('/api/student/complaints', async (c) => {
    const formData = await c.req.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const image = formData.get('image');
    if (!title || !description) return bad(c, 'Title and description are required');
    const newComplaint: Complaint = {
      id: `c${MOCK_COMPLAINTS.length + 1}`,
      title,
      description,
      status: 'Pending',
      submittedDate: new Date().toISOString(),
      imageUrl: image instanceof File ? 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800' : undefined,
    };
    MOCK_COMPLAINTS.unshift(newComplaint);
    return ok(c, newComplaint);
  });
  app.get('/api/student/suggestions', (c) => ok(c, MOCK_SUGGESTIONS));
  app.post('/api/student/suggestions', async (c) => {
    const { text } = await c.req.json<{ text: string }>();
    if (!text) return bad(c, 'Suggestion text is required');
    const newSuggestion: Suggestion = {
        id: `sug${MOCK_SUGGESTIONS.length + 1}`,
        text,
        submittedDate: new Date().toISOString(),
        studentName: 'Mock Student', // In a real app, get this from auth context
    };
    MOCK_SUGGESTIONS.unshift(newSuggestion);
    return ok(c, newSuggestion);
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
  app.put('/api/manager/students/:id', async (c) => {
    const { id } = c.req.param();
    const updatedData = await c.req.json<Omit<Student, 'id'>>();
    const studentIndex = MOCK_STUDENTS.findIndex(s => s.id === id);
    if (studentIndex === -1) {
        return notFound(c, 'Student not found.');
    }
    MOCK_STUDENTS[studentIndex] = { ...MOCK_STUDENTS[studentIndex], ...updatedData };
    return ok(c, MOCK_STUDENTS[studentIndex]);
  });
  app.get('/api/manager/student-requests', (c) => ok(c, MOCK_STUDENT_REQUESTS));
  app.post('/api/manager/student-requests/:id', async (c) => {
    const { id } = c.req.param();
    const { action } = await c.req.json<{ action: 'approve' | 'reject' | 'hold' }>();
    const requestIndex = MOCK_STUDENT_REQUESTS.findIndex(req => req.id === id);
    if (requestIndex === -1) {
        return notFound(c, 'Student request not found.');
    }
    if (action === 'approve') {
        const request = MOCK_STUDENT_REQUESTS[requestIndex];
        const newStudent: Student & { password?: string } = {
            id: `s${MOCK_STUDENTS.length + 5}`, // a unique ID
            name: request.name,
            email: request.email,
            phone: request.phone,
            roomNumber: request.roomNumber,
            password: request.password,
        };
        MOCK_STUDENTS.push(newStudent);
        MOCK_STUDENT_REQUESTS.splice(requestIndex, 1);
        return ok(c, { success: true, message: `Request for ${request.name} has been approved.` });
    }
    if (action === 'reject') {
        const request = MOCK_STUDENT_REQUESTS[requestIndex];
        MOCK_STUDENT_REQUESTS.splice(requestIndex, 1);
        return ok(c, { success: true, message: `Request for ${request.name} has been rejected.` });
    }
    return ok(c, { success: true, message: `Request ${id} has been ${action}d.` });
  });
  app.get('/api/manager/menu', (c) => ok(c, MOCK_MENU));
  app.put('/api/manager/menu', async (c) => {
    const updatedMenu = await c.req.json<WeeklyMenu>();
    console.log("Received menu update:", updatedMenu);
    return ok(c, { success: true, message: "Menu updated successfully." });
  });
  app.get('/api/manager/complaints', (c) => ok(c, MOCK_COMPLAINTS));
  app.post('/api/manager/complaints/:id/reply', async (c) => {
    const { id } = c.req.param();
    const { reply } = await c.req.json<{ reply: string }>();
    const complaintIndex = MOCK_COMPLAINTS.findIndex(c => c.id === id);
    if (complaintIndex === -1) return notFound(c, 'Complaint not found');
    MOCK_COMPLAINTS[complaintIndex] = {
        ...MOCK_COMPLAINTS[complaintIndex],
        managerReply: reply,
        status: 'In Progress',
    };
    return ok(c, MOCK_COMPLAINTS[complaintIndex]);
  });
  app.get('/api/manager/suggestions', (c) => ok(c, MOCK_SUGGESTIONS));
  app.get('/api/manager/broadcasts', (c) => ok(c, MOCK_BROADCASTS));
  app.post('/api/manager/broadcast', async (c) => {
    const { message } = await c.req.json<{ message: string }>();
    if (!message) return bad(c, 'Message is required');
    const newBroadcast = {
        id: `br${MOCK_BROADCASTS.length + 1}`,
        message,
        sentDate: new Date().toISOString(),
    };
    MOCK_BROADCASTS.unshift(newBroadcast);
    return ok(c, newBroadcast);
  });
  app.get('/api/manager/billing-overview', (c) => {
    const overview = {
        unpaid: [
            { student: { id: 's1', name: 'Rohan Sharma', roomNumber: 'A-101' }, id: 'b-s1', month: 'August 2025', amount: MOCK_SETTINGS.monthlyAmount, status: 'Due', dueDate: '2025-09-05T00:00:00.000Z' }
        ],
        paid: [
            { student: { id: 's2', name: 'Priya Patel', roomNumber: 'B-204' }, id: 'b-s2', month: 'August 2025', amount: MOCK_SETTINGS.monthlyAmount, status: 'Paid', dueDate: '2025-09-05T00:00:00.000Z', paidDate: '2025-08-28T00:00:00.000Z' },
            { student: { id: 's3', name: 'Amit Singh', roomNumber: 'A-102' }, id: 'b-s3', month: 'August 2025', amount: MOCK_SETTINGS.monthlyAmount, status: 'Paid', dueDate: '2025-09-05T00:00:00.000Z', paidDate: '2025-08-29T00:00:00.000Z' },
        ],
        overdue: [
            { student: { id: 's4', name: 'Sunita Gupta', roomNumber: 'C-401' }, id: 'b-s4', month: 'July 2025', amount: 3200, status: 'Overdue', dueDate: '2025-08-05T00:00:00.000Z' }
        ],
    };
    return ok(c, overview);
  });
  app.get('/api/manager/guest-payments', (c) => {
    return ok(c, MOCK_GUEST_PAYMENTS);
  });
  app.post('/api/manager/settings', async (c) => {
    const newSettings = await c.req.json<MessSettings>();
    if (typeof newSettings.monthlyAmount !== 'number' || !Array.isArray(newSettings.rules)) {
        return bad(c, 'Invalid settings format.');
    }
    MOCK_SETTINGS = newSettings;
    console.log('Updated mess settings:', MOCK_SETTINGS);
    return ok(c, MOCK_SETTINGS);
  });
  // --- ADMIN ROUTES ---
  app.get('/api/admin/complaints', (c) => {
    // Admin gets all complaints
    return ok(c, MOCK_COMPLAINTS);
  });
}