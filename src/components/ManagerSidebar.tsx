import {
  LayoutDashboard,
  Users,
  Utensils,
  MessageSquareWarning,
  LogOut,
  Settings,
  Wallet,
  Megaphone,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { useLocation, Link } from "react-router-dom";
const mainMenuItems = [
  { path: "/manager/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/manager/students", icon: Users, label: "Students" },
  { path: "/manager/menu", icon: Utensils, label: "Menu" },
];
const communicationMenuItems = [
  { path: "/manager/complaints", icon: MessageSquareWarning, label: "Complaints" },
  { path: "/manager/broadcast", icon: Megaphone, label: "Broadcast" },
];
const financialMenuItems = [
    { path: "/manager/billing", icon: Wallet, label: "Billing" },
];
export function ManagerSidebar(): JSX.Element {
  const location = useLocation();
  const isLinkActive = (path: string) => {
    return location.pathname.startsWith(path);
  }
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Utensils className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-display font-semibold">DineFlow <span className="text-sm text-muted-foreground font-sans">Manager</span></span>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-grow">
        <SidebarGroup>
          <SidebarMenu>
            {mainMenuItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={isLinkActive(item.path)}
                >
                  <Link to={item.path}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
            <SidebarGroupLabel>Communication</SidebarGroupLabel>
            <SidebarMenu>
                {communicationMenuItems.map((item) => (
                    <SidebarMenuItem key={item.path}>
                        <SidebarMenuButton asChild isActive={isLinkActive(item.path)}>
                            <Link to={item.path}>
                                <item.icon className="h-5 w-5" />
                                <span>{item.label}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
            <SidebarGroupLabel>Financials</SidebarGroupLabel>
            <SidebarMenu>
                {financialMenuItems.map((item) => (
                    <SidebarMenuItem key={item.path}>
                        <SidebarMenuButton asChild isActive={isLinkActive(item.path)}>
                            <Link to={item.path}>
                                <item.icon className="h-5 w-5" />
                                <span>{item.label}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/">
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}