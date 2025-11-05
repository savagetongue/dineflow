import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api-client";
import type { Complaint, ComplaintStatus } from "@shared/types";
import { format, parseISO } from "date-fns";
import { AlertCircle } from "lucide-react";
const statusColors: Record<ComplaintStatus, string> = {
  Pending: "bg-yellow-500",
  "In Progress": "bg-blue-500",
  Resolved: "bg-green-500",
};
export function AdminDashboardPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const data = await api<Complaint[]>("/api/admin/complaints");
        setComplaints(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load complaints.");
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);
  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-4xl font-display font-bold">Admin Dashboard</h1>
        <p className="text-lg text-muted-foreground">
          Oversight of mess operations and student feedback.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Complaints Overview</CardTitle>
          <CardDescription>
            A complete log of all student complaints and manager responses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <ComplaintSkeleton />
          ) : error ? (
            <div className="flex flex-col items-center justify-center text-center h-64">
              <AlertCircle className="w-12 h-12 text-destructive mb-4" />
              <h2 className="text-2xl font-semibold text-destructive">Could not load complaints.</h2>
              <p className="text-muted-foreground mt-2">{error}</p>
            </div>
          ) : complaints.length > 0 ? (
            <ul className="space-y-4">
              {complaints.map((c) => (
                <li key={c.id} className="border p-4 rounded-lg bg-muted/30">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{c.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Submitted on {format(parseISO(c.submittedDate), "MMM d, yyyy")}
                      </p>
                    </div>
                    <Badge className={`text-white text-xs ${statusColors[c.status]}`}>
                      {c.status}
                    </Badge>
                  </div>
                  <p className="text-sm mt-2">{c.description}</p>
                  {c.managerReply ? (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm font-semibold">Manager's Reply:</p>
                      <p className="text-sm text-muted-foreground italic">"{c.managerReply}"</p>
                    </div>
                  ) : (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm font-semibold text-yellow-600">No reply yet.</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-48">
              <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No Complaints Found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                There are currently no complaints in the system.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
function ComplaintSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="border p-4 rounded-lg space-y-2">
          <div className="flex justify-between items-start">
            <Skeleton className="h-5 w-3/5" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-full" />
          <div className="mt-3 pt-3 border-t">
            <Skeleton className="h-4 w-1/4 mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}