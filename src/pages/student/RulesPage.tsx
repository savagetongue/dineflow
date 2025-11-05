import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api-client";
import type { MessSettings } from "@shared/types";
import { AlertCircle, BookCheck, DollarSign } from "lucide-react";
export function RulesPage() {
  const [settings, setSettings] = useState<MessSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data = await api<MessSettings>("/api/settings");
        setSettings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load mess rules and fee.");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);
  if (loading) {
    return <RulesSkeleton />;
  }
  if (error || !settings) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-64">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold text-destructive">Could not load information.</h2>
        <p className="text-muted-foreground mt-2">{error}</p>
      </div>
    );
  }
  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-4xl font-display font-bold">Mess Rules & Fee</h1>
        <p className="text-lg text-muted-foreground">
          Important information about mess policies and monthly charges.
        </p>
      </header>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookCheck className="h-6 w-6 mr-2" />
                Rules & Regulations
              </CardTitle>
              <CardDescription>Please adhere to the following rules to ensure a smooth experience for everyone.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 list-disc list-inside text-muted-foreground">
                {settings.rules.map((rule, index) => (
                  <li key={index} className="pl-2">{rule}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-6 w-6 mr-2" />
                Monthly Fee
              </CardTitle>
              <CardDescription>The current subscription amount per month.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-foreground">
                ₹{settings.monthlyAmount.toLocaleString("en-IN")}
              </p>
              <p className="text-sm text-muted-foreground">per month</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
function RulesSkeleton() {
  return (
    <div className="space-y-8">
      <header>
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-5 w-1/2 mt-2" />
      </header>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader><Skeleton className="h-6 w-1/2" /><Skeleton className="h-4 w-full mt-2" /></CardHeader>
            <CardContent className="space-y-3">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-5 w-full" />)}
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-1">
          <Card>
            <CardHeader><Skeleton className="h-6 w-2/3" /><Skeleton className="h-4 w-full mt-2" /></CardHeader>
            <CardContent><Skeleton className="h-10 w-1/2" /><Skeleton className="h-4 w-1/3 mt-2" /></CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}