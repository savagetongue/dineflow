import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api-client";
import type { WeeklyMenu, DayOfWeek } from "@shared/types";
import { AlertCircle, Save } from "lucide-react";
import { toast } from "sonner";
const days: DayOfWeek[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
export function MenuManagementPage() {
  const [menu, setMenu] = useState<WeeklyMenu | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const data = await api<WeeklyMenu>("/api/manager/menu");
        setMenu(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load the menu."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);
  const handleMenuChange = (day: DayOfWeek, meal: 'breakfast' | 'lunch' | 'dinner', value: string) => {
    if (!menu) return;
    const updatedMenu = { ...menu };
    updatedMenu[day][meal] = value.split(',').map(item => item.trim());
    setMenu(updatedMenu);
  };
  const handleSaveChanges = async () => {
    if (!menu) return;
    setIsSaving(true);
    try {
      await api("/api/manager/menu", {
        method: "PUT",
        body: JSON.stringify(menu),
      });
      toast.success("Menu updated successfully!");
    } catch (err) {
      toast.error("Failed to save menu. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-4xl font-display font-bold">Menu Management</h1>
        <p className="text-lg text-muted-foreground">
          Update the weekly menu for all students.
        </p>
      </header>
      {loading ? (
        <MenuSkeleton />
      ) : error || !menu ? (
        <div className="flex flex-col items-center justify-center text-center h-64">
          <AlertCircle className="w-12 h-12 text-destructive mb-4" />
          <h2 className="text-2xl font-semibold text-destructive">
            Could not load menu.
          </h2>
          <p className="text-muted-foreground mt-2">{error}</p>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Edit Weekly Menu</CardTitle>
            <CardDescription>
              Enter items separated by commas. Changes will be visible to students immediately.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {days.map((day) => (
              <div key={day} className="border p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">{day}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${day}-breakfast`}>Breakfast</Label>
                    <Input
                      id={`${day}-breakfast`}
                      value={menu[day].breakfast.join(", ")}
                      onChange={(e) => handleMenuChange(day, 'breakfast', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${day}-lunch`}>Lunch</Label>
                    <Input
                      id={`${day}-lunch`}
                      value={menu[day].lunch.join(", ")}
                      onChange={(e) => handleMenuChange(day, 'lunch', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${day}-dinner`}>Dinner</Label>
                    <Input
                      id={`${day}-dinner`}
                      value={menu[day].dinner.join(", ")}
                      onChange={(e) => handleMenuChange(day, 'dinner', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSaveChanges} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
function MenuSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-2/3 mt-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border p-4 rounded-lg">
            <Skeleton className="h-6 w-24 mb-3" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}