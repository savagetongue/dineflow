import { useState, useEffect } from "react";
import { Utensils, User, Mail, Phone, Home, CheckCircle, Lock } from "lucide-react";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast, Toaster } from "@/components/ui/sonner";
import { api } from "@/lib/api-client";
import { Link } from "react-router-dom";
import type { StudentRegistrationData, MessSettings } from "@shared/types";
import { Skeleton } from "@/components/ui/skeleton";
type RegistrationStep = "fill-details" | "verify-otp" | "set-password" | "success";
export function RegisterPage() {
  const [step, setStep] = useState<RegistrationStep>("fill-details");
  const [formData, setFormData] = useState<Omit<StudentRegistrationData, 'id' | 'password'>>({
    name: "",
    email: "",
    phone: "",
    roomNumber: "",
  });
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [settings, setSettings] = useState<MessSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await api<MessSettings>("/api/settings");
        setSettings(data);
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    };
    fetchSettings();
  }, []);
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(formData).some((val) => !val.trim())) {
      toast.error("Please fill out all fields.");
      return;
    }
    setIsLoading(true);
    try {
      await api("/api/register/send-otp", { method: "POST", body: JSON.stringify({ email: formData.email }) });
      toast.success("OTP sent successfully!", { description: `An OTP has been sent to ${formData.email}.` });
      setStep("verify-otp");
    } catch (error) {
      toast.error("Failed to send OTP", { description: error instanceof Error ? error.message : "Please try again." });
    } finally {
      setIsLoading(false);
    }
  };
  const handleVerifyOtp = async () => {
    if (otp.length < 6) {
      toast.error("Please enter the 6-digit OTP.");
      return;
    }
    setIsLoading(true);
    try {
      await api("/api/register/verify-otp", { method: "POST", body: JSON.stringify({ email: formData.email, otp }) });
      toast.success("Email verified successfully!");
      setStep("set-password");
    } catch (error) {
      toast.error("Verification Failed", { description: error instanceof Error ? error.message : "Invalid OTP." });
    } finally {
      setIsLoading(false);
    }
  };
  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error("Please enter and confirm your password.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    setIsLoading(true);
    try {
      await api("/api/student/register", { method: "POST", body: JSON.stringify({ ...formData, password }) });
      setStep("success");
    } catch (error) {
      toast.error("Registration Failed", { description: error instanceof Error ? error.message : "Please try again." });
    } finally {
      setIsLoading(false);
    }
  };
  const renderContent = () => {
    switch (step) {
      case "fill-details":
        return (
          <>
            <CardHeader className="text-center">
              <CardTitle>Student Registration</CardTitle>
              <CardDescription>Step 1: Fill in your details to begin.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-2 relative"><Label htmlFor="name">Full Name</Label><User className="absolute left-3 top-9 h-4 w-4 text-muted-foreground" /><Input id="name" placeholder="Enter your name" className="pl-10" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} disabled={isLoading} /></div>
                <div className="space-y-2 relative"><Label htmlFor="email">Email Address</Label><Mail className="absolute left-3 top-9 h-4 w-4 text-muted-foreground" /><Input id="email" type="email" placeholder="Enter your email" className="pl-10" value={formData.email} onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))} disabled={isLoading} /></div>
                <div className="space-y-2 relative"><Label htmlFor="phone">Phone Number</Label><Phone className="absolute left-3 top-9 h-4 w-4 text-muted-foreground" /><Input id="phone" type="tel" placeholder="Enter your phone" className="pl-10" value={formData.phone} onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))} disabled={isLoading} /></div>
                <div className="space-y-2 relative"><Label htmlFor="roomNumber">Room Number</Label><Home className="absolute left-3 top-9 h-4 w-4 text-muted-foreground" /><Input id="roomNumber" placeholder="e.g., A-101" className="pl-10" value={formData.roomNumber} onChange={(e) => setFormData(p => ({ ...p, roomNumber: e.target.value }))} disabled={isLoading} /></div>
                <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Sending OTP..." : "Continue"}</Button>
              </form>
            </CardContent>
          </>
        );
      case "verify-otp":
        return (
          <>
            <CardHeader className="text-center"><CardTitle>Step 2: Verify Your Email</CardTitle><CardDescription>An OTP has been sent to <span className="font-semibold">{formData.email}</span>. Please enter it below.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Enter OTP</Label><InputOTP maxLength={6} value={otp} onChange={setOtp}><InputOTPGroup className="w-full"><InputOTPSlot index={0} /><InputOTPSlot index={1} /><InputOTPSlot index={2} /><InputOTPSeparator /><InputOTPSlot index={3} /><InputOTPSlot index={4} /><InputOTPSlot index={5} /></InputOTPGroup></InputOTP></div>
              <Button onClick={handleVerifyOtp} className="w-full" disabled={isLoading || otp.length < 6}>{isLoading ? "Verifying..." : "Verify"}</Button>
              <Button variant="link" size="sm" className="w-full" onClick={() => setStep('fill-details')} disabled={isLoading}>Back to details</Button>
            </CardContent>
          </>
        );
      case "set-password":
        return (
          <>
            <CardHeader className="text-center"><CardTitle>Step 3: Set Your Password</CardTitle><CardDescription>Create a secure password for your account.</CardDescription></CardHeader>
            <CardContent>
              <form onSubmit={handleRegistrationSubmit} className="space-y-4">
                <div className="space-y-2 relative"><Label htmlFor="password">Password</Label><Lock className="absolute left-3 top-9 h-4 w-4 text-muted-foreground" /><Input id="password" type="password" placeholder="••••••••" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} /></div>
                <div className="space-y-2 relative"><Label htmlFor="confirm-password">Confirm Password</Label><Lock className="absolute left-3 top-9 h-4 w-4 text-muted-foreground" /><Input id="confirm-password" type="password" placeholder="••••••••" className="pl-10" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading} /></div>
                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isLoading}>{isLoading ? "Submitting..." : "Complete Registration"}</Button>
              </form>
            </CardContent>
          </>
        );
      case "success":
        return (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-semibold">Registration Successful!</h2>
            <p className="text-muted-foreground mt-2">Your request has been sent to the manager for approval. You will be notified once it's approved.</p>
            <Button asChild className="mt-6 w-full"><Link to="/">Back to Login</Link></Button>
          </div>
        );
    }
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative p-4">
      <ThemeToggle className="absolute top-4 right-4" />
      <Toaster richColors closeButton />
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-400 opacity-20 blur-[100px]"></div>
      <div className="flex flex-col items-center space-y-6 animate-fade-in">
        <div className="flex items-center gap-3 text-foreground"><div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center"><Utensils className="h-7 w-7 text-white" /></div><h1 className="text-4xl font-display font-bold">DineFlow</h1></div>
        <Card className="w-full max-w-sm">{renderContent()}</Card>
        <div className="text-center text-sm text-muted-foreground/80 pt-4">
          {settings ? (<p>Current Monthly Fee: <span className="font-bold text-foreground">₹{settings.monthlyAmount.toLocaleString('en-IN')}</span></p>) : (<Skeleton className="h-5 w-48" />)}
          <p className="mt-4">Built with ❤️ at Cloudflare</p>
        </div>
      </div>
    </div>
  );
}