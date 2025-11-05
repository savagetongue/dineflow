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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api-client";
import type { Complaint, ComplaintStatus } from "@shared/types";
import { AlertCircle, MessageSquareReply } from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
const statusColors: Record<ComplaintStatus, string> = {
  Pending: "bg-yellow-500 border-yellow-500",
  "In Progress": "bg-blue-500 border-blue-500",
  Resolved: "bg-green-500 border-green-500",
};
export function ComplaintsManagementPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const data = await api<Complaint[]>("/api/manager/complaints");
      setComplaints(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load complaints.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchComplaints();
  }, []);
  const handleOpenReplyDialog = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setReplyText(complaint.managerReply || "");
  };
  const handleReplySubmit = async () => {
    if (!selectedComplaint || !replyText.trim()) {
      toast.error("Reply cannot be empty.");
      return;
    }
    setIsReplying(true);
    try {
      const updatedComplaint = await api<Complaint>(`/api/manager/complaints/${selectedComplaint.id}/reply`, {
        method: "POST",
        body: JSON.stringify({ reply: replyText }),
      });
      setComplaints(complaints.map(c => c.id === updatedComplaint.id ? updatedComplaint : c));
      toast.success("Reply sent successfully!");
      setSelectedComplaint(null);
      setReplyText("");
    } catch (err) {
      toast.error("Failed to send reply. Please try again.");
    } finally {
      setIsReplying(false);
    }
  };
  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-4xl font-display font-bold">Complaint Management</h1>
        <p className="text-lg text-muted-foreground">
          Review and respond to student feedback.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>All Complaints</CardTitle>
          <CardDescription>
            Here is a list of all submitted complaints from students.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <TableSkeleton rows={5} cols={4} />
          ) : error ? (
            <div className="flex flex-col items-center justify-center text-center h-64">
              <AlertCircle className="w-12 h-12 text-destructive mb-4" />
              <h2 className="text-2xl font-semibold text-destructive">Could not load complaints.</h2>
              <p className="text-muted-foreground mt-2">{error}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Submitted On</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complaints.length > 0 ? (
                  complaints.map((complaint) => (
                    <TableRow key={complaint.id}>
                      <TableCell className="font-medium">{complaint.title}</TableCell>
                      <TableCell>{format(parseISO(complaint.submittedDate), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-white ${statusColors[complaint.status]}`}>
                          {complaint.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleOpenReplyDialog(complaint)}>
                          <MessageSquareReply className="h-4 w-4 mr-2" />
                          View & Reply
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">
                      No complaints found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <Dialog open={!!selectedComplaint} onOpenChange={(isOpen) => !isOpen && setSelectedComplaint(null)}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Respond to Complaint</DialogTitle>
            <DialogDescription>
              Review the student's complaint and provide a response.
            </DialogDescription>
          </DialogHeader>
          {selectedComplaint && (
            <div className="space-y-4 py-4">
              <div className="p-4 border rounded-lg bg-muted/50">
                <p className="font-semibold text-sm">{selectedComplaint.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{selectedComplaint.description}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Submitted on {format(parseISO(selectedComplaint.submittedDate), "MMMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reply-text">Your Reply</Label>
                <Textarea
                  id="reply-text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your response here..."
                  rows={5}
                  disabled={isReplying}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" onClick={handleReplySubmit} disabled={isReplying}>
              {isReplying ? "Sending..." : "Send Reply"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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