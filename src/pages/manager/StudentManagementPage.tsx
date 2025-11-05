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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api-client";
import type { Student } from "@shared/types";
import { AlertCircle, MoreHorizontal, Check, X, Clock } from "lucide-react";
import { toast } from "sonner";
type StudentRequest = Student & { status: 'Pending' };
type AllStudents = Student;
export function StudentManagementPage() {
  const [requests, setRequests] = useState<StudentRequest[]>([]);
  const [students, setStudents] = useState<AllStudents[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [reqData, studentData] = await Promise.all([
          api<StudentRequest[]>("/api/manager/student-requests"),
          api<AllStudents[]>("/api/manager/students"),
        ]);
        setRequests(reqData);
        setStudents(studentData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load student data."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const handleRequestAction = (requestId: string, action: 'approve' | 'reject' | 'hold') => {
    // Mock action
    toast.success(`Student request ${action}d successfully.`);
    setRequests(requests.filter(req => req.id !== requestId));
  };
  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-4xl font-display font-bold">Student Management</h1>
        <p className="text-lg text-muted-foreground">
          Approve new student requests and manage existing students.
        </p>
      </header>
      {loading ? (
        <div className="space-y-8">
          <TableSkeleton title="Pending Student Requests" rows={3} cols={5} />
          <TableSkeleton title="All Students" rows={5} cols={4} />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center text-center h-64">
          <AlertCircle className="w-12 h-12 text-destructive mb-4" />
          <h2 className="text-2xl font-semibold text-destructive">
            Could not load data.
          </h2>
          <p className="text-muted-foreground mt-2">{error}</p>
        </div>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Pending Student Requests</CardTitle>
              <CardDescription>
                Review and act on new applications to join the mess.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Room No.</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.length > 0 ? (
                    requests.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell className="font-medium">{req.name}</TableCell>
                        <TableCell>{req.email}</TableCell>
                        <TableCell>{req.phone}</TableCell>
                        <TableCell>{req.roomNumber}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="mr-2" onClick={() => handleRequestAction(req.id, 'approve')}>
                            <Check className="h-4 w-4 text-green-500 mr-1" /> Approve
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleRequestAction(req.id, 'reject')}>
                            <X className="h-4 w-4 text-red-500 mr-1" /> Reject
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-24">
                        No pending requests.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>All Students</CardTitle>
              <CardDescription>
                A list of all students currently enrolled in the mess.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Room No.</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.roomNumber}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500">
                              Remove Student
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
function TableSkeleton({ title, rows, cols }: { title: string, rows: number, cols: number }) {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-2/3 mt-2" />
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}