import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api-client";
import type { Complaint, ComplaintStatus } from "@shared/types";
import { format, parseISO } from "date-fns";
import { AlertCircle, UploadCloud, CheckCircle } from "lucide-react";
import { toast } from "sonner";
const statusColors: Record<ComplaintStatus, string> = {
  Pending: "bg-yellow-500 hover:bg-yellow-600",
  "In Progress": "bg-blue-500 hover:bg-blue-600",
  Resolved: "bg-green-500 hover:bg-green-600",
};
export function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const data = await api<Complaint[]>("/api/student/complaints");
      setComplaints(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load complaints."
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchComplaints();
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error("Please fill in both title and description.");
      return;
    }
    setIsSubmitting(true);
    try {
      const newComplaint = await api<Complaint>("/api/student/complaints", {
        method: "POST",
        body: JSON.stringify({ title, description }),
      });
      setComplaints([newComplaint, ...complaints]);
      setTitle("");
      setDescription("");
      toast.success("Your complaint has been submitted successfully!");
    } catch (err) {
      toast.error("Failed to submit complaint. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-4xl font-display font-bold">Complaints & Suggestions</h1>
        <p className="text-lg text-muted-foreground">
          Have an issue or an idea? Let us know here.
        </p>
      </header>
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Card className="hover:shadow-lg transition-shadow duration-200 sticky top-24">
            <CardHeader>
              <CardTitle>Raise a New Complaint</CardTitle>
              <CardDescription>
                We'll look into it as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Food Quality Issue"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Please provide details about the issue."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isSubmitting}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file-upload">Attach Image (Optional)</Label>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span>
                        </p>
                      </div>
                      <Input id="file-upload" type="file" className="hidden" />
                    </label>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Complaint"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-3">
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle>Your Complaint History</CardTitle>
              <CardDescription>
                Track the status of your past complaints.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <ComplaintSkeleton />
              ) : error || complaints.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center h-64">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
                  <h2 className="text-xl font-semibold">
                    {error ? "Could not load history." : "No complaints yet."}
                  </h2>
                  <p className="text-muted-foreground mt-2 text-sm">
                    {error
                      ? "Please try again later."
                      : "Use the form to submit your first complaint."}
                  </p>
                </div>
              ) : (
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
                      {c.managerReply && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm font-semibold">Manager's Reply:</p>
                          <p className="text-sm text-muted-foreground italic">"{c.managerReply}"</p>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
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
        </div>
      ))}
    </div>
  );
}