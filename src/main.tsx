import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { GuestPaymentPage } from '@/pages/GuestPaymentPage';
import { RegisterPage } from '@/pages/RegisterPage';
// Student imports
import { StudentLayout } from '@/components/layout/StudentLayout';
import { DashboardPage as StudentDashboardPage } from '@/pages/student/DashboardPage';
import { MenuPage as StudentMenuPage } from '@/pages/student/MenuPage';
import { BillingPage as StudentBillingPage } from '@/pages/student/BillingPage';
import { ComplaintsPage as StudentComplaintsPage } from '@/pages/student/ComplaintsPage';
// Manager imports
import { ManagerLayout } from '@/components/layout/ManagerLayout';
import { DashboardPage as ManagerDashboardPage } from '@/pages/manager/DashboardPage';
import { StudentManagementPage } from '@/pages/manager/StudentManagementPage';
import { MenuManagementPage } from '@/pages/manager/MenuManagementPage';
import { ComplaintsManagementPage } from '@/pages/manager/ComplaintsManagementPage';
import { BroadcastPage } from '@/pages/manager/BroadcastPage';
import { BillingManagementPage } from '@/pages/manager/BillingManagementPage';
import { NotesPage } from '@/pages/manager/NotesPage';
import { GuestPaymentsPage } from '@/pages/manager/GuestPaymentsPage';
// Admin imports
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/guest-payment",
    element: <GuestPaymentPage />,
    errorElement: <RouteErrorBoundary />,
  },
  // Student Routes
  {
    element: <StudentLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: "/dashboard", element: <StudentDashboardPage /> },
      { path: "/menu", element: <StudentMenuPage /> },
      { path: "/billing", element: <StudentBillingPage /> },
      { path: "/complaints", element: <StudentComplaintsPage /> },
    ]
  },
  // Manager Routes
  {
    path: "/manager",
    element: <ManagerLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <Navigate to="/manager/dashboard" replace /> },
      { path: "dashboard", element: <ManagerDashboardPage /> },
      { path: "students", element: <StudentManagementPage /> },
      { path: "menu", element: <MenuManagementPage /> },
      { path: "complaints", element: <ComplaintsManagementPage /> },
      { path: "broadcast", element: <BroadcastPage /> },
      { path: "billing", element: <BillingManagementPage /> },
      { path: "notes", element: <NotesPage /> },
      { path: "guest-payments", element: <GuestPaymentsPage /> },
    ]
  },
  // Admin Routes
  {
    path: "/admin",
    element: <AdminLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: "dashboard", element: <AdminDashboardPage /> },
      // A read-only menu page for admin can be added here. For now, linking to student's menu page.
      { path: "menu", element: <StudentMenuPage /> },
    ]
  }
]);
// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
)