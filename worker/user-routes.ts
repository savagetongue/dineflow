import { Hono } from "hono";
import type { Env } from './core-utils';
import { ok, bad, notFound, isStr } from './core-utils';
import {
  SettingsEntity,
  MenuEntity,
  StudentEntity,
  StudentRequestEntity,
  ComplaintEntity,
  SuggestionEntity,
  BillEntity,
  GuestPaymentEntity,
  BroadcastEntity,
} from './entities';
import type {
  WeeklyMenu,
  Bill,
  Complaint,
  StudentDashboardSummary,
  Student,
  AuthResponse,
  StudentRegistrationData,
  MessSettings,
  AuthRequest,
  Suggestion,
  GuestPayment,
  BroadcastMessage,
} from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // --- AUTHENTICATION & REGISTRATION ROUTES ---
  app.post('/api/auth/student/login', async (c) => {
    const { email, password } = await c.req.json<AuthRequest>();
    const { items: students } = await StudentEntity.list(c.env);
    const student = students.find(s => s.email === email && s.password === password);
    if (student) {
      const response: AuthResponse = {
        token: `mock-token-student-${student.id}`,
        role: 'student',
        user: { id: student.id, name: student.name, email: student.email },
      };
      return ok(c, response);
    }
    const { items: requests } = await StudentRequestEntity.list(c.env);
    const pendingRequest = requests.find(req => req.email === email);
    if (pendingRequest) {
      return bad(c, 'Your account is pending manager approval.', 403);
    }
    return bad(c, 'Invalid email or password', 401);
  });
  app.post('/api/auth/login', async (c) => {
    const { email, password, role } = await c.req.json<{ email: string, password: string, role: 'manager' | 'admin' }>();
    if (role === 'manager' && email === 'manager@dineflow.com' && password === 'password') {
      return ok(c, { token: 'mock-token-manager', role: 'manager', user: { id: 'm1', name: 'Mr. Manager', email: 'manager@dineflow.com' } });
    }
    if (role === 'admin' && email === 'admin@dineflow.com' && password === 'password') {
      return ok(c, { token: 'mock-token-admin', role: 'admin', user: { id: 'a1', name: 'Ms. Admin', email: 'admin@dineflow.com' } });
    }
    return bad(c, 'Invalid credentials', 401);
  });
  app.post('/api/student/register', async (c) => {
    const data = await c.req.json<StudentRegistrationData>();
    if (!data.name || !data.email || !data.phone || !data.roomNumber || !data.password) {
      return bad(c, 'All fields are required.');
    }
    const newRequest = { ...data, id: crypto.randomUUID() };
    await StudentRequestEntity.create(c.env, newRequest);
    return ok(c, { success: true, message: 'Registration successful! Your request is pending approval.' });
  });
  // --- GUEST & PUBLIC ROUTES ---
  app.post('/api/guest/pay', async (c) => {
    const { name, phone, amount } = await c.req.json<{ name: string, phone: string, amount: number }>();
    if (!isStr(name) || !isStr(phone)) return bad(c, 'Name and phone are required');
    const newPayment: GuestPayment = {
      id: crypto.randomUUID(),
      name,
      phone,
      amount,
      paymentDate: new Date().toISOString(),
    };
    await GuestPaymentEntity.create(c.env, newPayment);
    return ok(c, { success: true, message: 'Payment successful' });
  });
  app.get('/api/settings', async (c) => {
    const settingsEntity = new SettingsEntity(c.env);
    return ok(c, await settingsEntity.getState());
  });
  // --- STUDENT ROUTES ---
  app.get('/api/student/summary', async (c) => {
    const settings = await new SettingsEntity(c.env).getState();
    const menu = await new MenuEntity(c.env).getState();
    const { items: complaints } = await ComplaintEntity.list(c.env);
    const summary: StudentDashboardSummary = {
      currentDue: { amount: settings.monthlyAmount, dueDate: '2025-09-05T00:00:00.000Z' },
      todaysMenu: menu.Wednesday,
      recentComplaints: complaints.slice(0, 2).map(({ id, title, status }) => ({ id, title, status })),
    };
    return ok(c, summary);
  });
  app.get('/api/student/menu', async (c) => ok(c, await new MenuEntity(c.env).getState()));
  app.get('/api/student/billing', async (c) => ok(c, (await BillEntity.list(c.env)).items));
  app.get('/api/student/complaints', async (c) => ok(c, (await ComplaintEntity.list(c.env)).items.sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime())));
  app.post('/api/student/complaints', async (c) => {
    const formData = await c.req.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const image = formData.get('image');
    if (!isStr(title) || !isStr(description)) return bad(c, 'Title and description are required');
    const newComplaint: Complaint = {
      id: crypto.randomUUID(),
      title,
      description,
      status: 'Pending',
      submittedDate: new Date().toISOString(),
      imageUrl: image instanceof File ? `https://source.unsplash.com/800x600/?food,mess,complaint&sig=${Math.random()}` : undefined,
    };
    await ComplaintEntity.create(c.env, newComplaint);
    return ok(c, newComplaint);
  });
  app.get('/api/student/suggestions', async (c) => ok(c, (await SuggestionEntity.list(c.env)).items.sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime())));
  app.post('/api/student/suggestions', async (c) => {
    const { text } = await c.req.json<{ text: string }>();
    if (!isStr(text)) return bad(c, 'Suggestion text is required');
    const newSuggestion: Suggestion = {
      id: crypto.randomUUID(),
      text,
      submittedDate: new Date().toISOString(),
      studentName: 'Mock Student',
    };
    await SuggestionEntity.create(c.env, newSuggestion);
    return ok(c, newSuggestion);
  });
  // --- MANAGER ROUTES ---
  app.get('/api/manager/stats', async (c) => {
    const { items: students } = await StudentEntity.list(c.env);
    const { items: requests } = await StudentRequestEntity.list(c.env);
    const { items: complaints } = await ComplaintEntity.list(c.env);
    return ok(c, {
      totalStudents: students.length,
      pendingRequests: requests.length,
      monthlyRevenue: 85000,
      activeComplaints: complaints.filter(c => c.status !== 'Resolved').length,
    });
  });
  app.get('/api/manager/students', async (c) => ok(c, (await StudentEntity.list(c.env)).items));
  app.put('/api/manager/students/:id', async (c) => {
    const { id } = c.req.param();
    const updatedData = await c.req.json<Omit<Student, 'id'>>();
    const studentEntity = new StudentEntity(c.env, id);
    if (!(await studentEntity.exists())) return notFound(c, 'Student not found.');
    await studentEntity.patch(updatedData);
    return ok(c, await studentEntity.getState());
  });
  app.get('/api/manager/student-requests', async (c) => ok(c, (await StudentRequestEntity.list(c.env)).items));
  app.post('/api/manager/student-requests/:id', async (c) => {
    const { id } = c.req.param();
    const { action } = await c.req.json<{ action: 'approve' | 'reject' }>();
    const requestEntity = new StudentRequestEntity(c.env, id);
    const request = await requestEntity.getState();
    if (!request) return notFound(c, 'Student request not found.');
    if (action === 'approve') {
      const newStudent: Student & { password?: string } = {
        id: crypto.randomUUID(),
        name: request.name,
        email: request.email,
        phone: request.phone,
        roomNumber: request.roomNumber,
        password: request.password,
      };
      await StudentEntity.create(c.env, newStudent);
      await StudentRequestEntity.delete(c.env, id);
      return ok(c, { success: true, message: `Request for ${request.name} has been approved.` });
    } else if (action === 'reject') {
      await StudentRequestEntity.delete(c.env, id);
      return ok(c, { success: true, message: `Request for ${request.name} has been rejected.` });
    }
    return bad(c, 'Invalid action');
  });
  app.get('/api/manager/menu', async (c) => ok(c, await new MenuEntity(c.env).getState()));
  app.put('/api/manager/menu', async (c) => {
    const updatedMenu = await c.req.json<WeeklyMenu>();
    const menuEntity = new MenuEntity(c.env);
    await menuEntity.patch(updatedMenu);
    return ok(c, { success: true, message: "Menu updated successfully." });
  });
  app.get('/api/manager/complaints', async (c) => ok(c, (await ComplaintEntity.list(c.env)).items.sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime())));
  app.post('/api/manager/complaints/:id/reply', async (c) => {
    const { id } = c.req.param();
    const { reply } = await c.req.json<{ reply: string }>();
    const complaintEntity = new ComplaintEntity(c.env, id);
    if (!(await complaintEntity.exists())) return notFound(c, 'Complaint not found');
    await complaintEntity.patch({ managerReply: reply, status: 'In Progress' });
    return ok(c, await complaintEntity.getState());
  });
  app.get('/api/manager/suggestions', async (c) => ok(c, (await SuggestionEntity.list(c.env)).items.sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime())));
  app.get('/api/manager/broadcasts', async (c) => {
    const { items } = await BroadcastEntity.list(c.env);
    return ok(c, items.sort((a, b) => new Date(b.sentDate).getTime() - new Date(a.sentDate).getTime()));
  });
  app.post('/api/manager/broadcast', async (c) => {
    const { message } = await c.req.json<{ message: string }>();
    if (!isStr(message)) return bad(c, 'Message is required');
    const newBroadcast: BroadcastMessage = {
      id: crypto.randomUUID(),
      message,
      sentDate: new Date().toISOString(),
    };
    await BroadcastEntity.create(c.env, newBroadcast);
    return ok(c, newBroadcast);
  });
  app.get('/api/manager/guest-payments', async (c) => {
    const { items } = await GuestPaymentEntity.list(c.env);
    return ok(c, items.sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()));
  });
  app.get('/api/manager/billing-overview', async (c) => {
    const { items: students } = await StudentEntity.list(c.env);
    const { items: bills } = await BillEntity.list(c.env);
    const studentMap = new Map(students.map(s => [s.id, s]));
    const overview: { unpaid: any[], paid: any[], overdue: any[] } = { unpaid: [], paid: [], overdue: [] };
    bills.forEach(bill => {
      const student = studentMap.get(bill.studentId);
      if (!student) return;
      const record = { ...bill, student: { id: student.id, name: student.name, roomNumber: student.roomNumber } };
      if (bill.status === 'Paid') overview.paid.push(record);
      else if (bill.status === 'Due') overview.unpaid.push(record);
      else if (bill.status === 'Overdue') overview.overdue.push(record);
    });
    return ok(c, overview);
  });
  app.put('/api/manager/settings', async (c) => {
    const newSettings = await c.req.json<MessSettings>();
    const settingsEntity = new SettingsEntity(c.env);
    await settingsEntity.patch(newSettings);
    return ok(c, await settingsEntity.getState());
  });
  // --- ADMIN ROUTES ---
  app.get('/api/admin/complaints', async (c) => ok(c, (await ComplaintEntity.list(c.env)).items.sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime())));
}