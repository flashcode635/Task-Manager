"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";

interface User {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
  _count: {
    tasks: number;
  };
}

export default function AdminPage() {
  const router = useRouter();
  const { getUser, logout } = useAuth();
  const [user, setUser] = useState<{ userId: string; role: string } | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Check authentication
  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }

    // Redirect non-admin users to user dashboard
    if (currentUser.role !== "ADMIN") {
      router.push("/dashboard");
      return;
    }

    setUser(currentUser);
    fetchUsers();
  }, []);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("/api/v1/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          return;
        }
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-[#fffdf3] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#041523]/5 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#0a2744]/8 rounded-full blur-[140px] animate-pulse [animation-delay:2s]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-[#041523]/10 bg-[#fffdf3]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
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
                  d="M9 12.75L11.25 15 15 9.75m-2.25 8.25c3.86 0 7-3.14 7-7s-3.14-7-7-7-7 3.14-7 7 3.14 7 7 7zm0 0v4.5m0 0h4.5m-4.5 0H7.5"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#041523]">Task Manager</h1>
              <p className="text-xs text-[#041523]/50">Admin Dashboard</p>
            </div>
          </div>
          <Button variant="ghost" onClick={logout}>
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#041523] mb-2">
            Admin Panel
          </h2>
          <p className="text-[#041523]/60">
            Manage users and monitor system activity
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="backdrop-blur-sm bg-[#041523]/3 border border-[#041523]/15 rounded-xl p-6 shadow-lg shadow-[#041523]/5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#041523]/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-[#041523]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-[#041523]/50 font-medium">Total Users</p>
                <p className="text-2xl font-bold text-[#041523]">{users.length}</p>
              </div>
            </div>
          </div>

          <div className="backdrop-blur-sm bg-[#041523]/3 border border-[#041523]/15 rounded-xl p-6 shadow-lg shadow-[#041523]/5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#041523]/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-[#041523]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-[#041523]/50 font-medium">Regular Users</p>
                <p className="text-2xl font-bold text-[#041523]">
                  {users.filter((u) => u.role === "USER").length}
                </p>
              </div>
            </div>
          </div>

          <div className="backdrop-blur-sm bg-[#041523]/3 border border-[#041523]/15 rounded-xl p-6 shadow-lg shadow-[#041523]/5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#041523]/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-[#041523]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75m-2.25-7.5A5.25 5.25 0 007.5 13.5v0a5.25 5.25 0 005.25 5.25v0a5.25 5.25 0 005.25-5.25v0a5.25 5.25 0 00-5.25-5.25v0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-[#041523]/50 font-medium">Admins</p>
                <p className="text-2xl font-bold text-[#041523]">
                  {users.filter((u) => u.role === "ADMIN").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="backdrop-blur-sm bg-[#041523]/3 border border-[#041523]/15 rounded-2xl shadow-xl shadow-[#041523]/5 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#041523]/10">
            <h3 className="text-lg font-semibold text-[#041523]">All Users</h3>
            <p className="text-sm text-[#041523]/50 mt-1">
              Complete list of registered users
            </p>
          </div>

          {users.length === 0 ? (
            <div className="text-center py-16">
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <p className="text-[#041523]/50 text-lg">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#041523]/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#041523]/70 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#041523]/70 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#041523]/70 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#041523]/70 uppercase tracking-wider">
                      Tasks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#041523]/70 uppercase tracking-wider">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#041523]/10">
                  {users.map((userData) => (
                    <tr
                      key={userData.id}
                      className="hover:bg-[#041523]/5 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-[#041523]/60">
                          {userData.id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-[#041523]">
                          {userData.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold ${
                            userData.role === "ADMIN"
                              ? "bg-[#0a2744]/15 text-[#041523] border border-[#0a2744]/30"
                              : "bg-[#041523]/10 text-[#041523]/70 border border-[#041523]/20"
                          }`}
                        >
                          {userData.role === "ADMIN" ? "🛡️ Admin" : "👤 User"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[#041523]/60">
                          {userData._count.tasks} task{userData._count.tasks !== 1 ? "s" : ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[#041523]/60">
                          {new Date(userData.createdAt).toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-[#041523]/40">
          <p>Total: {users.length} user{users.length !== 1 ? "s" : ""}</p>
        </div>
      </main>
    </div>
  );
}
