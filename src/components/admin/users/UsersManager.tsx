"use client";

import { useState, useEffect } from "react";
import { userAPI } from "@/services/api";
import { Trash2, Loader, Users as UsersIcon } from "lucide-react";

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export default function UsersManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<
    "ALL" | "SUPER_ADMIN" | "ADMIN" | "USER"
  >("ALL");

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = (await userAPI.getAll()) as any;
      setUsers(response.data || []);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await userAPI.delete(id);
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await userAPI.update(id, { isActive: !currentStatus });
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    }
  };

  const handleChangeRole = async (id: string, newRole: string) => {
    try {
      await userAPI.changeRole(id, newRole);
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change role");
    }
  };

  // Filter users
  const filteredUsers =
    filter === "ALL" ? users : users.filter((u) => u.role === filter);

  // Count by role
  const superAdminCount = users.filter((u) => u.role === "SUPER_ADMIN").length;
  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const userCount = users.filter((u) => u.role === "USER").length;

  const getRoleColor = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "ADMIN":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "USER":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Users Management</h1>
        <p className="text-gray-400">Manage all users and their roles</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-white">{users.length}</p>
            </div>
            <UsersIcon className="text-amber-500" size={32} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Super Admins</p>
              <p className="text-3xl font-bold text-red-400">
                {superAdminCount}
              </p>
            </div>
            <span className="text-4xl">👑</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Admins</p>
              <p className="text-3xl font-bold text-blue-400">{adminCount}</p>
            </div>
            <span className="text-4xl">🔐</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Regular Users</p>
              <p className="text-3xl font-bold text-green-400">{userCount}</p>
            </div>
            <span className="text-4xl">👤</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {["ALL", "SUPER_ADMIN", "ADMIN", "USER"].map((role) => (
          <button
            key={role}
            onClick={() => setFilter(role as any)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filter === role
                ? "bg-amber-500 text-gray-900"
                : "bg-gray-700 hover:bg-gray-600 text-white"
            }`}
          >
            {role === "ALL" ? "All Users" : role.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="animate-spin text-amber-500" size={40} />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No users found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">
                  User
                </th>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">
                  Joined
                </th>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors"
                >
                  {/* User Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold">
                        {user.firstName[0]}
                        {user.lastName[0]}
                      </div>
                      <div>
                        <p className="text-white font-semibold">
                          {user.firstName} {user.lastName}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 text-gray-300">{user.email}</td>

                  {/* Role */}
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleChangeRole(user._id, e.target.value)
                      }
                      className={`px-3 py-1 rounded-lg text-sm font-semibold border cursor-pointer ${getRoleColor(
                        user.role,
                      )} bg-transparent`}
                    >
                      <option value="SUPER_ADMIN">👑 Super Admin</option>
                      <option value="ADMIN">🔐 Admin</option>
                      <option value="USER">👤 User</option>
                    </select>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() =>
                        handleToggleStatus(user._id, user.isActive)
                      }
                      className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                        user.isActive
                          ? "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"
                          : "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>

                  {/* Joined Date */}
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg flex items-center gap-2 transition-all"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
