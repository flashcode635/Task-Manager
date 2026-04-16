"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";

interface Task {
  id: string;
  title: string;
  description: string | null;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { getUser, logout } = useAuth();
  const [user, setUser] = useState<{ userId: string; role: string } | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Check authentication
  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }

    // Redirect admin to admin dashboard
    if (currentUser.role === "ADMIN") {
      router.push("/admin");
      return;
    }

    setUser(currentUser);
    fetchTasks();
  }, []);

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("/api/v1/todos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          return;
        }
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();
      setTasks(data.tasks);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  // Create new task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("/api/v1/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          return;
        }
        throw new Error("Failed to create task");
      }

      const data = await response.json();
      setTasks([data.task, ...tasks]);
      setTitle("");
      setDescription("");
      setShowCreateForm(false);
    } catch (err) {
      console.error("Error creating task:", err);
      setError("Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle task completion
  const handleToggleComplete = async (taskId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`/api/v1/todos/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          isCompleted: !currentStatus,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          return;
        }
        throw new Error("Failed to update task");
      }

      const data = await response.json();
      setTasks(tasks.map((t) => (t.id === taskId ? data.task : t)));
    } catch (err) {
      console.error("Error updating task:", err);
      setError("Failed to update task");
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`/api/v1/todos/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          return;
        }
        throw new Error("Failed to delete task");
      }

      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("Failed to delete task");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffdf3] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#041523]">
          <svg
            className="animate-spin w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span className="text-lg font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  const userName = user?.userId ? user.userId.substring(0, 5) : "User";

  return (
    <div className="min-h-screen bg-[#fffdf3] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#041523]/5 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#0a2744]/8 rounded-full blur-[140px] animate-pulse [animation-delay:2s]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-[#041523]/10 bg-[#fffdf3]/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#041523] to-[#0a2744] flex items-center justify-center shadow-lg shadow-[#041523]/15">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-[#fffdf3]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#041523]">Task Manager</h1>
              <p className="text-xs text-[#041523]/50">User Dashboard</p>
            </div>
          </div>
          <Button variant="ghost" onClick={logout}>
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#041523] mb-2">
            Hello, {userName}!
          </h2>
          <p className="text-[#041523]/60">
            Manage your tasks and stay organized
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
            {error}
            <button
              onClick={() => setError("")}
              className="ml-auto text-red-700 hover:text-red-900"
            >
              ✕
            </button>
          </div>
        )}

        {/* Create Task Button */}
        <div className="mb-6">
          {!showCreateForm ? (
            <Button onClick={() => setShowCreateForm(true)}>
              + Create New Task
            </Button>
          ) : (
            <div className="backdrop-blur-sm bg-[#041523]/3 border border-[#041523]/15 rounded-2xl p-6 shadow-xl shadow-[#041523]/5">
              <form onSubmit={handleCreateTask} className="space-y-4">
                <Input
                  label="Task Title"
                  placeholder="Enter task title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  maxLength={255}
                />
                <Textarea
                  label="Description (Optional)"
                  placeholder="Enter task description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={5000}
                />
                <div className="flex gap-3">
                  <Button type="submit" loading={submitting}>
                    Create Task
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setShowCreateForm(false);
                      setTitle("");
                      setDescription("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-16 backdrop-blur-sm bg-[#041523]/3 border border-[#041523]/10 rounded-2xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-16 mx-auto text-[#041523]/20 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-[#041523]/50 text-lg mb-2">No tasks yet</p>
              <p className="text-[#041523]/40 text-sm">
                Create your first task to get started
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="backdrop-blur-sm bg-[#041523]/3 border border-[#041523]/15 rounded-xl p-5 shadow-lg shadow-[#041523]/5 hover:shadow-xl hover:shadow-[#041523]/10 transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <button
                    onClick={() =>
                      handleToggleComplete(task.id, task.isCompleted)
                    }
                    className="mt-1 shrink-0"
                  >
                    <div
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                        task.isCompleted
                          ? "bg-[#041523] border-[#041523]"
                          : "border-[#041523]/30 hover:border-[#041523]/50"
                      }`}
                    >
                      {task.isCompleted && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 text-[#fffdf3]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </button>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-lg font-semibold mb-1 ${
                        task.isCompleted
                          ? "text-[#041523]/40 line-through"
                          : "text-[#041523]"
                      }`}
                    >
                      {task.title}
                    </h3>
                    {task.description && (
                      <p
                        className={`text-sm ${
                          task.isCompleted
                            ? "text-[#041523]/30"
                            : "text-[#041523]/60"
                        }`}
                      >
                        {task.description}
                      </p>
                    )}
                    <p className="text-xs text-[#041523]/30 mt-2">
                      Created: {new Date(task.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="shrink-0 w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 hover:bg-red-500/20 hover:border-red-500/40 transition-all duration-200 flex items-center justify-center"
                    title="Delete task"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Task Stats */}
        {tasks.length > 0 && (
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-[#041523]/60">
            <div>
              <span className="font-semibold text-[#041523]">{tasks.length}</span>{" "}
              Total
            </div>
            <div>
              <span className="font-semibold text-[#041523]">
                {tasks.filter((t) => t.isCompleted).length}
              </span>{" "}
              Completed
            </div>
            <div>
              <span className="font-semibold text-[#041523]">
                {tasks.filter((t) => !t.isCompleted).length}
              </span>{" "}
              Pending
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
