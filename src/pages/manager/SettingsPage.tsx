import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Save, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import type { MessSettings } from "@shared/types";
import { Skeleton } from "@/components/ui/skeleton";
export function SettingsPage() {
  const [settings, setSettings] = useState<MessSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data = await api<MessSettings>("/api/settings");
        setSettings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load settings.");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!settings) return;
    const value = e.target.value;
    setSettings({ ...settings, monthlyAmount: value === '' ? 0 : parseInt(value, 10) });
  };
  const handleRuleChange = (index: number, value: string) => {
    if (!settings) return;
    const newRules = [...settings.rules];
    newRules[index] = value;
    setSettings({ ...settings, rules: newRules });
  };
  const addRule = () => {
    if (!settings) return;
    setSettings({ ...settings, rules: [...settings.rules, ""] });
  };
  const removeRule = (index: number) => {
    if (!settings) return;
    const newRules = settings.rules.filter((_, i) => i !== index);
    setSettings({ ...settings, rules: newRules });
  };
  const handleSaveChanges = async () => {
    if (!settings) return;
    setIsSaving(true);
    try {
      await api("/api/manager/settings", {
        method: "PUT",
        body: JSON.stringify(settings),
      });
      toast.success("Settings saved successfully!");
    } catch (err) {
      toast.error("Failed to save settings", { description: err instanceof Error ? err.message : "Please try again." });
    } finally {
      setIsSaving(false);
    }
  };
  if (loading) {
    return <SettingsSkeleton />;
  }
  if (error || !settings) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-64">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold text-destructive">Could not load settings.</h2>
        <p className="text-muted-foreground mt-2">{error}</p>
      </div>
    );
  }
  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-4xl font-display font-bold">Mess Settings</h1>
        <p className="text-lg text-muted-foreground">
          Configure the monthly fee and general rules for the mess.
        </p>
      </header>
      <div className="grid gap-8 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Monthly Fee</CardTitle>
            <CardDescription>Set the subscription amount for each student per month.</CardDescription>
          </CardHeader>
          <CardContent>
            <Label htmlFor="monthly-amount">Amount (in ₹)</Label>
            <Input
              id="monthly-amount"
              type="number"
              value={settings.monthlyAmount}
              onChange={handleAmountChange}
              placeholder="e.g., 3500"
            />
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Mess Rules</CardTitle>
            <CardDescription>Define the rules and regulations for students.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {settings.rules.map((rule, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={rule}
                  onChange={(e) => handleRuleChange(index, e.target.value)}
                  placeholder={`Rule #${index + 1}`}
                />
                <Button variant="ghost" size="icon" onClick={() => removeRule(index)}>
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addRule}>
              <Plus className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-end">
        <Button onClick={handleSaveChanges} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save All Changes"}
        </Button>
      </div>
    </div>
  );
}
function SettingsSkeleton() {
  return (
    <div className="space-y-8">
      <header>
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-5 w-1/2 mt-2" />
      </header>
      <div className="grid gap-8 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader><Skeleton className="h-6 w-2/3" /><Skeleton className="h-4 w-full mt-2" /></CardHeader>
          <CardContent><Skeleton className="h-4 w-1/3 mb-2" /><Skeleton className="h-10 w-full" /></CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader><Skeleton className="h-6 w-1/3" /><Skeleton className="h-4 w-full mt-2" /></CardHeader>
          <CardContent className="space-y-3">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            <Skeleton className="h-9 w-28" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}