import { useState } from "react";
import { Utensils, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast, Toaster } from "@/components/ui/sonner";
import { api } from "@/lib/api-client";
export function GuestPaymentPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const handlePayment = async () => {
    if (!name.trim() || !phone.trim()) {
      toast.error("Please enter your name and phone number.");
      return;
    }
    setIsProcessing(true);
    try {
      // Mock API call
      await api("/api/guest/pay", {
        method: "POST",
        body: JSON.stringify({ name, phone, amount: 75 }), // Assuming a fixed guest meal price
      });
      toast.success("Payment Successful!", {
        description: "Thank you for dining with us. Your payment has been received.",
      });
      setName("");
      setPhone("");
    } catch (error) {
      toast.error("Payment Failed", {
        description: error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setIsProcessing(false);
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
          <CardHeader className="text-center">
            <CardTitle>Guest Meal Payment</CardTitle>
            <CardDescription>
              Pay for a single meal. Price: ₹75
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 relative">
              <Label htmlFor="guest-name">Full Name</Label>
              <User className="absolute left-3 top-9 h-4 w-4 text-muted-foreground" />
              <Input
                id="guest-name"
                placeholder="Enter your name"
                className="pl-10"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isProcessing}
              />
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="guest-phone">Phone Number</Label>
              <Phone className="absolute left-3 top-9 h-4 w-4 text-muted-foreground" />
              <Input
                id="guest-phone"
                type="tel"
                placeholder="Enter your phone number"
                className="pl-10"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isProcessing}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Pay ₹75 Now"}
            </Button>
          </CardFooter>
        </Card>
        <footer className="text-center text-sm text-muted-foreground/80 pt-8">
          <p>By @anandbhagyawant</p>
        </footer>
      </div>
    </div>
  );
}