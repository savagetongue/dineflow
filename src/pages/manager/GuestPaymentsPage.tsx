import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api-client";
import { AlertCircle, WalletCards } from "lucide-react";
import { format, parseISO } from "date-fns";
interface GuestPayment {
  id: string;
  name: string;
  phone: string;
  amount: number;
  paymentDate: string;
}
export function GuestPaymentsPage() {
  const [payments, setPayments] = useState<GuestPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const data = await api<GuestPayment[]>("/api/manager/guest-payments");
        setPayments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load guest payments.");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);
  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-4xl font-display font-bold">Guest Payments</h1>
        <p className="text-lg text-muted-foreground">
          A log of all one-time payments made by guests.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <WalletCards className="h-5 w-5 mr-2" />
            Payment History
          </CardTitle>
          <CardDescription>
            Review all transactions from non-registered guests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <TableSkeleton rows={8} cols={4} />
          ) : error ? (
            <div className="flex flex-col items-center justify-center text-center h-64">
              <AlertCircle className="w-12 h-12 text-destructive mb-4" />
              <h2 className="text-2xl font-semibold text-destructive">Could not load payments.</h2>
              <p className="text-muted-foreground mt-2">{error}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.length > 0 ? (
                  payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.name}</TableCell>
                      <TableCell>{payment.phone}</TableCell>
                      <TableCell>₹{payment.amount.toLocaleString("en-IN")}</TableCell>
                      <TableCell>{format(parseISO(payment.paymentDate), "MMM d, yyyy, h:mm a")}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">
                      No guest payments found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
function TableSkeleton({ rows, cols }: { rows: number, cols: number }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {[...Array(cols)].map((_, i) => (
            <TableHead key={i}><Skeleton className="h-5 w-24" /></TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(rows)].map((_, i) => (
          <TableRow key={i}>
            {[...Array(cols)].map((_, j) => (
              <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}