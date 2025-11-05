import {
  ShieldCheck,
  Utensils,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useLocation, Link } from "react-router-dom";
const menuItems = [
  { path: "/admin/dashboard", icon: ShieldCheck, label: "Complaints Overview" },
  { path: "/admin/menu", icon: Utensils, label: "Weekly Menu" },
];
export function AdminSidebar(): JSX.Element {
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
          <span className="text-lg font-display font-semibold">DineFlow <span className="text-sm text-muted-foreground font-sans">Admin</span></span>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-grow">
        <SidebarMenu>
          {menuItems.map((item) => (
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