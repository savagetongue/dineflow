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
import type { StudentDashboardSummary, ComplaintStatus } from "@shared/types";
import {
  DollarSign,
  Utensils,
  MessageSquareWarning,
  AlertCircle,
} from "lucide-react";
import { format, parseISO } from "date-fns";
const statusColors: Record<ComplaintStatus, string> = {
  Pending: "bg-yellow-500",
  "In Progress": "bg-blue-500",
  Resolved: "bg-green-500",
};
export function DashboardPage() {
  const [summary, setSummary] = useState<StudentDashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const data = await api<StudentDashboardSummary>("/api/student/summary");
        setSummary(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);
  if (loading) {
    return <DashboardSkeleton />;
  }
  if (error || !summary) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-64">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold text-destructive">
          Oops! Something went wrong.
        </h2>
        <p className="text-muted-foreground mt-2">
          We couldn't load your dashboard. Please try again later.
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-4xl font-display font-bold">Dashboard</h1>
        <p className="text-lg text-muted-foreground">
          Welcome back! Here's a quick overview of your mess account.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Due</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ���{summary.currentDue.amount.toLocaleString("en-IN")}
            </div>
            <p className="text-xs text-muted-foreground">
              Due by {format(parseISO(summary.currentDue.dueDate), "MMMM d, yyyy")}
            </p>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Menu</CardTitle>
            <Utensils className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <h4 className="font-semibold text-sm">Breakfast</h4>
              <p className="text-muted-foreground text-sm">
                {summary.todaysMenu.breakfast.join(", ")}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm">Lunch</h4>
              <p className="text-muted-foreground text-sm">
                {summary.todaysMenu.lunch.join(", ")}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm">Dinner</h4>
              <p className="text-muted-foreground text-sm">
                {summary.todaysMenu.dinner.join(", ")}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-2 lg:col-span-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Complaints</CardTitle>
                <CardDescription>
                  Here are the latest updates on your complaints.
                </CardDescription>
              </div>
              <MessageSquareWarning className="h-6 w-6 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {summary.recentComplaints.map((complaint) => (
                <li
                  key={complaint.id}
                  className="flex items-center justify-between"
                >
                  <p className="text-sm font-medium">{complaint.title}</p>
                  <Badge
                    className={`text-white text-xs ${
                      statusColors[complaint.status]
                    }`}
                  >
                    {complaint.status}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <header>
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-5 w-1/2 mt-2" />
      </header>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-5 rounded-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-40 mt-1" />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-5 rounded-full" />
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-4 w-24 mt-1" />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64 mt-1" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-5 w-20" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}