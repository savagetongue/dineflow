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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api-client";
import type { Bill, Student } from "@shared/types";
import { AlertCircle, CheckCircle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
type BillingStatus = "Unpaid" | "Paid" | "Overdue";
interface BillingRecord extends Bill {
  student: Pick<Student, "id" | "name" | "roomNumber">;
}
interface BillingOverview {
  unpaid: BillingRecord[];
  paid: BillingRecord[];
  overdue: BillingRecord[];
}
export function BillingManagementPage() {
  const [overview, setOverview] = useState<BillingOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchBillingOverview = async () => {
    try {
      setLoading(true);
      const data = await api<BillingOverview>("/api/manager/billing-overview");
      setOverview(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load billing data.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBillingOverview();
  }, []);
  const handleMarkAsPaid = (studentId: string, billId: string) => {
    // Mock API call
    console.log(`Marking bill ${billId} for student ${studentId} as paid by cash.`);
    toast.success("Payment marked as received.", {
      description: "The student's bill has been updated.",
    });
    // In a real app, you would refetch or update the state optimistically
  };
  const renderBillingTable = (records: BillingRecord[]) => {
    if (records.length === 0) {
      return (
        <div className="text-center h-48 flex flex-col justify-center items-center">
          <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
          <p className="font-semibold">All Cleared!</p>
          <p className="text-sm text-muted-foreground">No records in this category.</p>
        </div>
      );
    }
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student Name</TableHead>
            <TableHead>Room No.</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">{record.student.name}</TableCell>
              <TableCell>{record.student.roomNumber}</TableCell>
              <TableCell>₹{record.amount.toLocaleString("en-IN")}</TableCell>
              <TableCell>{format(parseISO(record.dueDate), "MMM d, yyyy")}</TableCell>
              <TableCell className="text-right">
                {record.status !== "Paid" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMarkAsPaid(record.student.id, record.id)}
                  >
                    Mark as Paid (Cash)
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };
  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-4xl font-display font-bold">Billing Management</h1>
        <p className="text-lg text-muted-foreground">
          Track and manage monthly student payments.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Monthly Billing Overview</CardTitle>
          <CardDescription>
            Categorized view of student payments for the current billing cycle.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <TableSkeleton rows={5} cols={5} />
          ) : error || !overview ? (
            <div className="flex flex-col items-center justify-center text-center h-64">
              <AlertCircle className="w-12 h-12 text-destructive mb-4" />
              <h2 className="text-2xl font-semibold text-destructive">Could not load billing data.</h2>
              <p className="text-muted-foreground mt-2">{error}</p>
            </div>
          ) : (
            <Tabs defaultValue="Unpaid">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="Unpaid">Unpaid ({overview.unpaid.length})</TabsTrigger>
                <TabsTrigger value="Paid">Paid ({overview.paid.length})</TabsTrigger>
                <TabsTrigger value="Overdue">Overdue ({overview.overdue.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="Unpaid" className="pt-4">
                {renderBillingTable(overview.unpaid)}
              </TabsContent>
              <TabsContent value="Paid" className="pt-4">
                {renderBillingTable(overview.paid)}
              </TabsContent>
              <TabsContent value="Overdue" className="pt-4">
                {renderBillingTable(overview.overdue)}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
function TableSkeleton({ rows, cols }: { rows: number; cols: number }) {
  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-10 w-1/3" />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {[...Array(cols)].map((_, i) => (
              <TableHead key={i}>
                <Skeleton className="h-5 w-24" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(rows)].map((_, i) => (
            <TableRow key={i}>
              {[...Array(cols)].map((_, j) => (
                <TableCell key={j}>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}