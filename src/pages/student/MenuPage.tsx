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
import type { WeeklyMenu, DayOfWeek } from "@shared/types";
import { AlertCircle } from "lucide-react";
const days: DayOfWeek[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
export function MenuPage() {
  const [menu, setMenu] = useState<WeeklyMenu | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const data = await api<WeeklyMenu>("/api/student/menu");
        setMenu(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load weekly menu."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);
  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-4xl font-display font-bold">Weekly Menu</h1>
        <p className="text-lg text-muted-foreground">
          Here's what's cooking this week.
        </p>
      </header>
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle>Mess Menu</CardTitle>
          <CardDescription>
            The menu is subject to change based on availability of ingredients.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <MenuSkeleton />
          ) : error || !menu ? (
            <div className="flex flex-col items-center justify-center text-center h-64">
              <AlertCircle className="w-12 h-12 text-destructive mb-4" />
              <h2 className="text-2xl font-semibold text-destructive">
                Could not load menu.
              </h2>
              <p className="text-muted-foreground mt-2">
                Please check back later or contact the manager.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold w-[120px]">Day</TableHead>
                    <TableHead className="font-bold">Breakfast</TableHead>
                    <TableHead className="font-bold">Lunch</TableHead>
                    <TableHead className="font-bold">Dinner</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {days.map((day) => (
                    <TableRow key={day}>
                      <TableCell className="font-semibold">{day}</TableCell>
                      <TableCell>{menu[day].breakfast.join(", ")}</TableCell>
                      <TableCell>{menu[day].lunch.join(", ")}</TableCell>
                      <TableCell>{menu[day].dinner.join(", ")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
function MenuSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[120px]">
            <Skeleton className="h-5 w-16" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-5 w-24" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-5 w-24" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-5 w-24" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(7)].map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <Skeleton className="h-5 w-20" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-full" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}