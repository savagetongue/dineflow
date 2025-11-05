import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { StudentLayout } from '@/components/layout/StudentLayout';
import { DashboardPage } from '@/pages/student/DashboardPage';
import { MenuPage } from '@/pages/student/MenuPage';
import { BillingPage } from '@/pages/student/BillingPage';
import { ComplaintsPage } from '@/pages/student/ComplaintsPage';
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    element: <StudentLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/menu", element: <MenuPage /> },
      { path: "/billing", element: <BillingPage /> },
      { path: "/complaints", element: <ComplaintsPage /> },
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