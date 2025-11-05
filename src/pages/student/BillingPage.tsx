import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api-client";
import type { Bill, BillStatus } from "@shared/types";
import { format, parseISO } from "date-fns";
import { AlertCircle } from "lucide-react";
const statusColors: Record<BillStatus, string> = {
  Paid: "bg-green-500 hover:bg-green-600",
  Due: "bg-yellow-500 hover:bg-yellow-600",
  Overdue: "bg-red-500 hover:bg-red-600",
};
export function BillingPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchBills = async () => {
      try {
        setLoading(true);
        const data = await api<Bill[]>("/api/student/billing");
        setBills(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load billing history."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
  }, []);
  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-4xl font-display font-bold">Billing History</h1>
        <p className="text-lg text-muted-foreground">
          Review your monthly mess bills and payment status.
        </p>
      </header>
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle>Your Bills</CardTitle>
          <CardDescription>
            Click on a month to view details and payment options.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <BillingSkeleton />
          ) : error || bills.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center h-64">
              <AlertCircle className="w-12 h-12 text-destructive mb-4" />
              <h2 className="text-2xl font-semibold text-destructive">
                {error ? "Could not load bills." : "No bills found."}
              </h2>
              <p className="text-muted-foreground mt-2">
                {error
                  ? "Please try again later."
                  : "Your billing history is empty."}
              </p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {bills.map((bill) => (
                <AccordionItem value={bill.id} key={bill.id}>
                  <AccordionTrigger className="hover:bg-accent/50 px-4 rounded-md">
                    <div className="flex items-center justify-between w-full">
                      <span className="font-semibold text-lg">{bill.month}</span>
                      <Badge className={`text-white ${statusColors[bill.status]}`}>
                        {bill.status}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-medium">
                        ₹{bill.amount.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Due Date:</span>
                      <span className="font-medium">
                        {format(parseISO(bill.dueDate), "MMMM d, yyyy")}
                      </span>
                    </div>
                    {bill.paidDate && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Paid On:</span>
                        <span className="font-medium">
                          {format(parseISO(bill.paidDate), "MMMM d, yyyy")}
                        </span>
                      </div>
                    )}
                    {bill.status !== "Paid" && (
                      <Button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white">
                        Pay Now (₹{bill.amount.toLocaleString("en-IN")})
                      </Button>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
function BillingSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 border rounded-md">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-20" />
        </div>
      ))}
    </div>
  );
}