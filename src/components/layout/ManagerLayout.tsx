import React from "react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ManagerSidebar } from "@/components/ManagerSidebar";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
export function ManagerLayout(): JSX.Element {
  return (
    <SidebarProvider>
      <ManagerSidebar />
      <SidebarInset className="bg-muted/30 min-h-screen">
        <div className="absolute left-4 top-4 z-20">
          <SidebarTrigger />
        </div>
        <ThemeToggle className="absolute top-4 right-4" />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 md:py-20 lg:py-24">
            <Outlet />
          </div>
        </main>
        <Toaster richColors closeButton />
      </SidebarInset>
    </SidebarProvider>
  );
}