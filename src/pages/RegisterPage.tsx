import { useState } from "react";
import { Utensils, User, Mail, Phone, Home, CheckCircle } from "lucide-react";
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
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast, Toaster } from "@/components/ui/sonner";
import { api } from "@/lib/api-client";
import { Link } from "react-router-dom";
import type { StudentRegistrationData } from "@shared/types";
export function RegisterPage() {
  const [formData, setFormData] = useState<StudentRegistrationData>({
    name: "",
    email: "",
    phone: "",
    roomNumber: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(formData).some((val) => !val.trim())) {
      toast.error("Please fill out all fields.");
      return;
    }
    setIsSubmitting(true);
    try {
      await api("/api/student/register", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      setIsSuccess(true);
    } catch (error) {
      toast.error("Registration Failed", {
        description: error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
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
        <Card className="w-full max-w-sm">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-semibold">Registration Successful!</h2>
              <p className="text-muted-foreground mt-2">
                Your request has been sent to the manager for approval. You will be notified once it's approved.
              </p>
              <Button asChild className="mt-6 w-full">
                <Link to="/">Back to Login</Link>
              </Button>
            </div>
          ) : (
            <>
              <CardHeader className="text-center">
                <CardTitle>Student Registration</CardTitle>
                <CardDescription>
                  Fill in your details to apply for the mess.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2 relative">
                    <Label htmlFor="name">Full Name</Label>
                    <User className="absolute left-3 top-9 h-4 w-4 text-muted-foreground" />
                    <Input id="name" placeholder="Enter your name" className="pl-10" value={formData.name} onChange={handleChange} disabled={isSubmitting} />
                  </div>
                  <div className="space-y-2 relative">
                    <Label htmlFor="email">Email Address</Label>
                    <Mail className="absolute left-3 top-9 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="Enter your email" className="pl-10" value={formData.email} onChange={handleChange} disabled={isSubmitting} />
                  </div>
                  <div className="space-y-2 relative">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Phone className="absolute left-3 top-9 h-4 w-4 text-muted-foreground" />
                    <Input id="phone" type="tel" placeholder="Enter your phone" className="pl-10" value={formData.phone} onChange={handleChange} disabled={isSubmitting} />
                  </div>
                  <div className="space-y-2 relative">
                    <Label htmlFor="roomNumber">Room Number</Label>
                    <Home className="absolute left-3 top-9 h-4 w-4 text-muted-foreground" />
                    <Input id="roomNumber" placeholder="e.g., A-101" className="pl-10" value={formData.roomNumber} onChange={handleChange} disabled={isSubmitting} />
                  </div>
                  <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Register"}
                  </Button>
                </form>
              </CardContent>
            </>
          )}
        </Card>
        <footer className="text-center text-sm text-muted-foreground/80 pt-8">
          <p>Built with ❤️ at Cloudflare</p>
        </footer>
      </div>
    </div>
  );
}