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
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api-client";
import { AlertCircle, Send, History } from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
interface BroadcastMessage {
  id: string;
  message: string;
  sentDate: string;
}
export function BroadcastPage() {
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<BroadcastMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await api<BroadcastMessage[]>("/api/manager/broadcasts");
      setHistory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load broadcast history.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchHistory();
  }, []);
  const handleSendBroadcast = async () => {
    if (!message.trim()) {
      toast.error("Broadcast message cannot be empty.");
      return;
    }
    setIsSending(true);
    try {
      const newBroadcast = await api<BroadcastMessage>("/api/manager/broadcast", {
        method: "POST",
        body: JSON.stringify({ message }),
      });
      setHistory([newBroadcast, ...history]);
      setMessage("");
      toast.success("Broadcast sent successfully!");
    } catch (err) {
      toast.error("Failed to send broadcast. Please try again.");
    } finally {
      setIsSending(false);
    }
  };
  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-4xl font-display font-bold">Broadcast Message</h1>
        <p className="text-lg text-muted-foreground">
          Send an urgent message to all students.
        </p>
      </header>
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Compose Message</CardTitle>
              <CardDescription>
                This message will be sent to all registered students.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Type your message here... e.g., 'Mess will be closed tomorrow due to maintenance.'"
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isSending}
              />
            </CardContent>
            <CardFooter>
              <Button onClick={handleSendBroadcast} disabled={isSending} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                {isSending ? "Sending..." : "Send Broadcast"}
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="h-5 w-5 mr-2" />
                Broadcast History
              </CardTitle>
              <CardDescription>
                A log of all previously sent messages.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center text-center h-64">
                  <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                  <h2 className="text-2xl font-semibold text-destructive">Could not load history.</h2>
                  <p className="text-muted-foreground mt-2">{error}</p>
                </div>
              ) : history.length > 0 ? (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  {history.map((item) => (
                    <div key={item.id} className="border p-4 rounded-lg bg-muted/50">
                      <p className="text-sm">{item.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Sent on {format(parseISO(item.sentDate), "MMMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center h-48">
                  <History className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold">No Broadcasts Sent</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your broadcast history is empty.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}