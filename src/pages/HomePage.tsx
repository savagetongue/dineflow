import { useState } from "react";
import { Utensils, KeyRound, ShieldCheck, Mail, Lock } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast, Toaster } from "@/components/ui/sonner";
import { api } from "@/lib/api-client";
import type { AuthResponse } from "@shared/types";
export function HomePage() {
  const navigate = useNavigate();
  // Student state
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  // Manager state
  const [managerEmail, setManagerEmail] = useState("");
  const [managerPassword, setManagerPassword] = useState("");
  // Admin state
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleStudentLogin = async () => {
    if (!studentEmail || !studentPassword) {
      toast.error("Email and password are required.");
      return;
    }
    setIsLoading(true);
    try {
      const data = await api<AuthResponse>("/api/auth/student/login", {
        method: "POST",
        body: JSON.stringify({ email: studentEmail, password: studentPassword }),
      });
      toast.success(`Welcome, ${data.user.name}!`);
      navigate("/dashboard");
    } catch (error) {
      toast.error("Login Failed", {
        description: error instanceof Error ? error.message : "Invalid credentials.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleCredentialLogin = async (role: 'manager' | 'admin') => {
    const email = role === 'manager' ? managerEmail : adminEmail;
    const password = role === 'manager' ? managerPassword : adminPassword;
    if (!email || !password) {
      toast.error("Email and password are required.");
      return;
    }
    setIsLoading(true);
    try {
      const data = await api<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password, role }),
      });
      toast.success(`Welcome, ${data.user.name}!`);
      if (data.role === 'manager') navigate('/manager');
      if (data.role === 'admin') navigate('/admin');
    } catch (error) {
      toast.error("Login Failed", {
        description: error instanceof Error ? error.message : "Invalid credentials.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative p-4">
      <ThemeToggle className="absolute top-4 right-4" />
      <Toaster richColors closeButton />
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-400 opacity-20 blur-[100px]"></div>
      <div className="flex flex-col items-center space-y-6 animate-fade-in">
        <div className="flex items-center gap-3 text-foreground">
          <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center">
            <Utensils className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-4xl font-display font-bold">DineFlow</h1>
        </div>
        <p className="text-muted-foreground max-w-md text-center">
          A minimalist and modern subscription-based management system to streamline mess operations.
        </p>
        <Tabs defaultValue="student" className="w-full max-w-sm">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="student"><Utensils className="h-4 w-4 mr-2" /> Student</TabsTrigger>
            <TabsTrigger value="manager"><KeyRound className="h-4 w-4 mr-2" /> Manager</TabsTrigger>
            <TabsTrigger value="admin"><ShieldCheck className="h-4 w-4 mr-2" /> Admin</TabsTrigger>
          </TabsList>
          <TabsContent value="student">
            <Card>
              <CardHeader>
                <CardTitle>Student Login</CardTitle>
                <CardDescription>
                  Enter your credentials to access your dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 relative">
                  <Label htmlFor="student-email">Email</Label>
                  <Mail className="absolute left-3 top-9 h-4 w-4 text-muted-foreground" />
                  <Input id="student-email" type="email" placeholder="e.g., user@example.com" className="pl-10" value={studentEmail} onChange={e => setStudentEmail(e.target.value)} disabled={isLoading} />
                </div>
                <div className="space-y-2 relative">
                  <Label htmlFor="student-password">Password</Label>
                  <Lock className="absolute left-3 top-9 h-4 w-4 text-muted-foreground" />
                  <Input id="student-password" type="password" placeholder="••••••••" className="pl-10" value={studentPassword} onChange={e => setStudentPassword(e.target.value)} disabled={isLoading} />
                </div>
                <Button onClick={handleStudentLogin} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
                <div className="text-center text-sm">
                  Don't have an account?{" "}
                  <Button variant="link" asChild className="p-0 h-auto">
                    <Link to="/register">Register</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="manager">
            <Card>
              <CardHeader>
                <CardTitle>Manager Login</CardTitle>
                <CardDescription>Enter your credentials to access the manager dashboard.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 relative">
                  <Label htmlFor="manager-email">Email</Label>
                  <Mail className="absolute left-3 top-9 h-4 w-4 text-muted-foreground" />
                  <Input id="manager-email" type="email" placeholder="manager@dineflow.com" className="pl-10" value={managerEmail} onChange={e => setManagerEmail(e.target.value)} disabled={isLoading} />
                </div>
                <div className="space-y-2 relative">
                  <Label htmlFor="manager-password">Password</Label>
                  <Lock className="absolute left-3 top-9 h-4 w-4 text-muted-foreground" />
                  <Input id="manager-password" type="password" placeholder="••••••••" className="pl-10" value={managerPassword} onChange={e => setManagerPassword(e.target.value)} disabled={isLoading} />
                </div>
                <Button onClick={() => handleCredentialLogin('manager')} className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>Admin Login</CardTitle>
                <CardDescription>Enter your credentials for administrative access.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 relative">
                  <Label htmlFor="admin-email">Email</Label>
                  <Mail className="absolute left-3 top-9 h-4 w-4 text-muted-foreground" />
                  <Input id="admin-email" type="email" placeholder="admin@dineflow.com" className="pl-10" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} disabled={isLoading} />
                </div>
                <div className="space-y-2 relative">
                  <Label htmlFor="admin-password">Password</Label>
                  <Lock className="absolute left-3 top-9 h-4 w-4 text-muted-foreground" />
                  <Input id="admin-password" type="password" placeholder="••••••••" className="pl-10" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} disabled={isLoading} />
                </div>
                <Button onClick={() => handleCredentialLogin('admin')} className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <footer className="text-center text-sm text-muted-foreground/80 pt-8">
          <p>Built with ❤️ at Cloudflare</p>
        </footer>
      </div>
    </div>
  );
}