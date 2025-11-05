import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Notebook, ListChecks } from "lucide-react";
import { toast } from "sonner";
interface ToDoItem {
  id: number;
  text: string;
  completed: boolean;
}
export function NotesPage() {
  const [todos, setTodos] = useState<ToDoItem[]>(() => {
    try {
      const savedTodos = localStorage.getItem("manager_todos");
      return savedTodos ? JSON.parse(savedTodos) : [
        { id: 1, text: "Check inventory for next week", completed: false },
        { id: 2, text: "Finalize Sunday special menu", completed: true },
        { id: 3, text: "Follow up on complaint #c2", completed: false },
      ];
    } catch {
      return [];
    }
  });
  const [newTodo, setNewTodo] = useState("");
  const [notes, setNotes] = useState(() => {
    try {
      return localStorage.getItem("manager_notes") || "- Plan for the upcoming monthly inspection.\n- Staff meeting on Friday at 4 PM.";
    } catch {
      return "";
    }
  });
  useEffect(() => {
    localStorage.setItem("manager_todos", JSON.stringify(todos));
  }, [todos]);
  useEffect(() => {
    localStorage.setItem("manager_notes", notes);
  }, [notes]);
  const handleAddTodo = () => {
    if (newTodo.trim() === "") {
      toast.error("To-do item cannot be empty.");
      return;
    }
    setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
    setNewTodo("");
  };
  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };
  const removeTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };
  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-4xl font-display font-bold">Notes & To-Do</h1>
        <p className="text-lg text-muted-foreground">
          Your personal space for daily organization and reminders.
        </p>
      </header>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ListChecks className="h-6 w-6 mr-2" />
              To-Do List
            </CardTitle>
            <CardDescription>
              Keep track of your daily tasks and check them off as you go.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Add a new task..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
              />
              <Button onClick={handleAddTodo}><Plus className="h-4 w-4" /></Button>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {todos.map((todo) => (
                <div key={todo.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                  <Checkbox
                    id={`todo-${todo.id}`}
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                  />
                  <label
                    htmlFor={`todo-${todo.id}`}
                    className={`flex-1 text-sm cursor-pointer ${todo.completed ? "line-through text-muted-foreground" : ""}`}
                  >
                    {todo.text}
                  </label>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeTodo(todo.id)}>
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Notebook className="h-6 w-6 mr-2" />
              Scratchpad
            </CardTitle>
            <CardDescription>
              A place for your quick notes, thoughts, and reminders.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Jot down your notes here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={12}
              className="text-sm"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}