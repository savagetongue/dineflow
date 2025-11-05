import { useState } from "react";
import { Utensils, KeyRound, ShieldCheck, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ThemeToggle } from "@/components/ThemeToggle";
export function HomePage() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const handleLogin = () => {
    // In a real app, you'd have role-based logic.
    // For this demo, any successful login goes to the student dashboard.
    navigate("/dashboard");
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative p-4">
      <ThemeToggle className="absolute top-4 right-4" />
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
          A minimalist and modern subscription-based management system to
          streamline mess operations.
        </p>
        <Tabs defaultValue="student" className="w-full max-w-sm">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="student">
              <Utensils className="h-4 w-4 mr-2" /> Student
            </TabsTrigger>
            <TabsTrigger value="manager">
              <KeyRound className="h-4 w-4 mr-2" /> Manager
            </TabsTrigger>
            <TabsTrigger value="admin">
              <ShieldCheck className="h-4 w-4 mr-2" /> Admin
            </TabsTrigger>
          </TabsList>
          <TabsContent value="student">
            <Card>
              <CardHeader>
                <CardTitle>Student Login</CardTitle>
                <CardDescription>
                  Enter your registered email or phone to receive an OTP.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-phone">Email or Phone</Label>
                  <Input
                    id="email-phone"
                    placeholder="e.g., user@example.com"
                  />
                </div>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                  Send OTP
                </Button>
                <div className="space-y-2 pt-2">
                  <Label>Enter OTP</Label>
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                  >
                    <InputOTPGroup className="w-full">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSeparator />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <Button onClick={handleLogin} className="w-full" disabled={otp.length < 6}>
                  Login
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="manager">
            <Card>
              <CardHeader>
                <CardTitle>Manager Login</CardTitle>
                <CardDescription>
                  Enter your credentials to access the manager dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 relative">
                  <Label htmlFor="manager-email">Email</Label>
                  <Mail className="absolute left-3 top-9 h-4 w-4 text-muted-foreground" />
                  <Input id="manager-email" type="email" placeholder="manager@dineflow.com" className="pl-10" />
                </div>
                <div className="space-y-2 relative">
                  <Label htmlFor="manager-password">Password</Label>
                  <Lock className="absolute left-3 top-9 h-4 w-4 text-muted-foreground" />
                  <Input id="manager-password" type="password" placeholder="••••••••" className="pl-10" />
                </div>
                <Button onClick={handleLogin} className="w-full">Login</Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>Admin Login</CardTitle>
                <CardDescription>
                  Enter your credentials for administrative access.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 relative">
                  <Label htmlFor="admin-email">Email</Label>
                  <Mail className="absolute left-3 top-9 h-4 w-4 text-muted-foreground" />
                  <Input id="admin-email" type="email" placeholder="admin@dineflow.com" className="pl-10" />
                </div>
                <div className="space-y-2 relative">
                  <Label htmlFor="admin-password">Password</Label>
                  <Lock className="absolute left-3 top-9 h-4 w-4 text-muted-foreground" />
                  <Input id="admin-password" type="password" placeholder="••••••••" className="pl-10" />
                </div>
                <Button onClick={handleLogin} className="w-full">Login</Button>
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