"use client";

import { useState, useEffect } from "react";
import { userAPI } from "@/services/api";
import {
  Trash2,
  Loader,
  Users as UsersIcon,
  DollarSign,
  Edit2,
  X,
  Check,
  Plus,
  Minus,
  Search,
} from "lucide-react";

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  balance?: number;
}

interface EditingUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  balance: number;
}

interface BalanceModal {
  userId: string;
  userName: string;
  currentBalance: number;
  type: "add" | "deduct";
  amount: number;
}

export default function UsersManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filter, setFilter] = useState<"ALL" | "ADMIN" | "USER">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<EditingUser | null>(null);
  const [balanceModal, setBalanceModal] = useState<BalanceModal | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = (await userAPI.getAll()) as { data: User[] };
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
      setSuccess("User deleted successfully");
      await fetchUsers();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await userAPI.update(id, { isActive: !currentStatus });
      setSuccess("User status updated");
      await fetchUsers();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    }
  };

  const handleChangeRole = async (id: string, newRole: string) => {
    try {
      await userAPI.changeRole(id, newRole);
      setSuccess("User role updated");
      await fetchUsers();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change role");
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      balance: user.balance || 0,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;

    try {
      await userAPI.update(editingUser.id, {
        firstName: editingUser.firstName,
        lastName: editingUser.lastName,
        email: editingUser.email,
        balance: editingUser.balance,
      });
      setSuccess("User updated successfully");
      setEditingUser(null);
      await fetchUsers();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    }
  };

  const handleBalanceChange = async () => {
    if (!balanceModal) return;

    try {
      const newBalance =
        balanceModal.type === "add"
          ? balanceModal.currentBalance + balanceModal.amount
          : balanceModal.currentBalance - balanceModal.amount;

      await userAPI.update(balanceModal.userId, { balance: newBalance });
      setSuccess(
        `Balance ${balanceModal.type === "add" ? "added" : "deducted"} successfully`,
      );
      setBalanceModal(null);
      await fetchUsers();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update balance");
    }
  };

  const filteredUsers = users
    .filter((u) => (filter === "ALL" ? true : u.role === filter))
    .filter(
      (u) =>
        u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const userCount = users.filter((u) => u.role === "USER").length;

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "USER":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Users Management
          </h1>
          <p className="text-gray-400">Manage all users, roles, and balances</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-green-400 flex items-center justify-between">
            <span>{success}</span>
            <button
              onClick={() => setSuccess("")}
              className="text-green-400 hover:text-green-300"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              className="text-red-400 hover:text-red-300"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-white">{users.length}</p>
              </div>
              <UsersIcon className="text-amber-500" size={32} />
            </div>
          </div>

          <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Admins</p>
                <p className="text-3xl font-bold text-blue-400">{adminCount}</p>
              </div>
              <span className="text-4xl">🔐</span>
            </div>
          </div>

          <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Regular Users</p>
                <p className="text-3xl font-bold text-green-400">{userCount}</p>
              </div>
              <span className="text-4xl">👤</span>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="flex gap-2">
              {(["ALL", "ADMIN", "USER"] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setFilter(role)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    filter === role
                      ? "bg-amber-500 text-gray-900"
                      : "bg-gray-700 hover:bg-gray-600 text-white"
                  }`}
                >
                  {role === "ALL" ? "All" : role}
                </button>
              ))}
            </div>
          </div>
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
                    Balance
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
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold">
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

                    <td className="px-6 py-4 text-gray-300">{user.email}</td>

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
                        <option value="ADMIN">🔐 Admin</option>
                        <option value="USER">👤 User</option>
                      </select>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                          <DollarSign size={14} />
                          <span>৳{user.balance || 0}</span>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() =>
                              setBalanceModal({
                                userId: user._id,
                                userName: `${user.firstName} ${user.lastName}`,
                                currentBalance: user.balance || 0,
                                type: "add",
                                amount: 0,
                              })
                            }
                            className="bg-green-500/20 hover:bg-green-500/30 text-green-400 p-1 rounded transition-all"
                            title="Add balance"
                          >
                            <Plus size={14} />
                          </button>
                          <button
                            onClick={() =>
                              setBalanceModal({
                                userId: user._id,
                                userName: `${user.firstName} ${user.lastName}`,
                                currentBalance: user.balance || 0,
                                type: "deduct",
                                amount: 0,
                              })
                            }
                            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-1 rounded transition-all"
                            title="Deduct balance"
                          >
                            <Minus size={14} />
                          </button>
                        </div>
                      </div>
                    </td>

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

                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg flex items-center gap-2 transition-all"
                        >
                          <Edit2 size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg flex items-center gap-2 transition-all"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit User Modal */}
        {editingUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg border border-gray-700 max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Edit User</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={editingUser.firstName}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        firstName: e.target.value,
                      })
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={editingUser.lastName}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        lastName: e.target.value,
                      })
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        email: e.target.value,
                      })
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Balance
                  </label>
                  <input
                    type="number"
                    value={editingUser.balance}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        balance: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <Check size={18} />
                  Save
                </button>
                <button
                  onClick={() => setEditingUser(null)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Balance Modal */}
        {balanceModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg border border-gray-700 max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                {balanceModal.type === "add" ? "Add" : "Deduct"} Balance
              </h2>
              <p className="text-gray-400 mb-4">{balanceModal.userName}</p>

              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <p className="text-gray-400 text-sm">Current Balance</p>
                <p className="text-2xl font-bold text-amber-400">
                  ৳{balanceModal.currentBalance}
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  value={balanceModal.amount}
                  onChange={(e) =>
                    setBalanceModal({
                      ...balanceModal,
                      amount: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="Enter amount"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <p className="text-gray-400 text-sm">New Balance</p>
                <p className="text-2xl font-bold text-green-400">
                  ৳
                  {balanceModal.type === "add"
                    ? balanceModal.currentBalance + balanceModal.amount
                    : balanceModal.currentBalance - balanceModal.amount}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleBalanceChange}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-all"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setBalanceModal(null)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
