import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api-client";
import { AlertCircle, Users, UserPlus, DollarSign, Utensils } from "lucide-react";
interface ManagerStats {
  totalStudents: number;
  pendingRequests: number;
  monthlyRevenue: number;
  activeComplaints: number;
}
export function DashboardPage() {
  const [stats, setStats] = useState<ManagerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await api<ManagerStats>("/api/manager/stats");
        setStats(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard stats."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);
  if (loading) {
    return <DashboardSkeleton />;
  }
  if (error || !stats) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-64">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold text-destructive">
          Oops! Something went wrong.
        </h2>
        <p className="text-muted-foreground mt-2">
          We couldn't load dashboard data. Please try again later.
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-4xl font-display font-bold">Manager Dashboard</h1>
        <p className="text-lg text-muted-foreground">
          An overview of mess operations and key metrics.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={stats.totalStudents.toString()}
          icon={Users}
          description="Currently enrolled"
        />
        <StatCard
          title="Pending Requests"
          value={stats.pendingRequests.toString()}
          icon={UserPlus}
          description="Awaiting approval"
        />
        <StatCard
          title="Monthly Revenue"
          value={`₹${stats.monthlyRevenue.toLocaleString("en-IN")}`}
          icon={DollarSign}
          description="For the current month"
        />
        <StatCard
          title="Active Complaints"
          value={stats.activeComplaints.toString()}
          icon={Utensils}
          description="Pending or in-progress"
        />
      </div>
    </div>
  );
}
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  description: string;
}
function StatCard({ title, value, icon: Icon, description }: StatCardProps) {
  return (
    <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <header>
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-5 w-2/3 mt-2" />
      </header>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-40 mt-1" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}