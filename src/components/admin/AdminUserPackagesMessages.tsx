"use client";

import { useState, useEffect } from "react";
import { adminAPI } from "@/services/api";
import {
  ChevronDown,
  ChevronUp,
  Package,
  MessageSquare,
  Loader,
  AlertCircle,
  Users as UsersIcon,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

interface Message {
  _id: string;
  recipient: string;
  message: string;
  status: "sent" | "failed" | "pending";
  createdAt: string;
}

interface PackageData {
  _id: string;
  name: string;
  description: string;
  messageCount: number;
  costPerMessage: number;
  totalPrice: number;
  isActive: boolean;
  messages: Message[];
}

interface UserData {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  packages: PackageData[];
  currentSelectedPackage: {
    _id: string;
    name: string;
    description: string;
  } | null;
}

export default function AdminUserPackagesMessages() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [expandedPackage, setExpandedPackage] = useState<string | null>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = (await adminAPI.getUsersPackagesMessages()) as any;
      const usersData = response.data || [];
      setUsers(usersData);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleUser = (userId: string) => {
    if (expandedUser === userId) {
      setExpandedUser(null);
    } else {
      setExpandedUser(userId);
    }
  };

  const togglePackage = (packageId: string) => {
    if (expandedPackage === packageId) {
      setExpandedPackage(null);
    } else {
      setExpandedPackage(packageId);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <CheckCircle className="text-green-400" size={16} />;
      case "failed":
        return <XCircle className="text-red-400" size={16} />;
      case "pending":
        return <Clock className="text-yellow-400" size={16} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-500/10 border-green-500/30 text-green-400";
      case "failed":
        return "bg-red-500/10 border-red-500/30 text-red-400";
      case "pending":
        return "bg-yellow-500/10 border-yellow-500/30 text-yellow-400";
      default:
        return "bg-gray-500/10 border-gray-500/30 text-gray-400";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <Loader className="animate-spin text-amber-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Users, Packages & Messages
          </h1>
          <p className="text-gray-400">
            View all users with their packages and messages
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="text-red-400 shrink-0" size={20} />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-white">{users.length}</p>
              </div>
              <UsersIcon className="text-amber-500" size={32} />
            </div>
          </div>

          <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Packages</p>
                <p className="text-3xl font-bold text-blue-400">
                  {users.reduce((sum, u) => sum + u.packages.length, 0)}
                </p>
              </div>
              <Package className="text-blue-400" size={32} />
            </div>
          </div>

          <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Messages</p>
                <p className="text-3xl font-bold text-green-400">
                  {users.reduce(
                    (sum, u) =>
                      sum +
                      u.packages.reduce(
                        (pSum, p) => pSum + p.messages.length,
                        0,
                      ),
                    0,
                  )}
                </p>
              </div>
              <MessageSquare className="text-green-400" size={32} />
            </div>
          </div>
        </div>

        {/* Users List */}
        {users.length === 0 ? (
          <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-12 text-center">
            <UsersIcon className="mx-auto text-gray-500 mb-3" size={48} />
            <h3 className="text-white font-bold text-lg mb-2">
              No Users Found
            </h3>
            <p className="text-gray-400">No users in the system yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user._id}
                className="bg-linear-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 overflow-hidden"
              >
                {/* User Header */}
                <button
                  onClick={() => toggleUser(user._id)}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1 text-left">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-lg">
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        Role:{" "}
                        <span className="text-amber-400">{user.role}</span>
                      </p>
                      {user.currentSelectedPackage && (
                        <p className="text-green-400 text-xs mt-1">
                          Selected Package:{" "}
                          <span className="font-semibold">
                            {user.currentSelectedPackage.name}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* User Stats */}
                  <div className="flex items-center gap-6 mr-4">
                    <div className="text-right">
                      <p className="text-gray-400 text-xs">Packages</p>
                      <p className="text-white font-bold text-lg">
                        {user.packages.length}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-xs">Messages</p>
                      <p className="text-white font-bold text-lg">
                        {user.packages.reduce(
                          (sum, p) => sum + p.messages.length,
                          0,
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Expand Icon */}
                  <div className="text-gray-400">
                    {expandedUser === user._id ? (
                      <ChevronUp size={24} />
                    ) : (
                      <ChevronDown size={24} />
                    )}
                  </div>
                </button>

                {/* Packages Section */}
                {expandedUser === user._id && (
                  <div className="border-t border-gray-700 bg-gray-900/50 p-6">
                    {user.packages.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="mx-auto text-gray-500 mb-3" />
                        <p className="text-gray-400">
                          No packages for this user
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <h4 className="text-white font-semibold mb-4">
                          Packages ({user.packages.length})
                        </h4>
                        {user.packages.map((pkg) => (
                          <div
                            key={pkg._id}
                            className={`bg-gray-800 rounded-lg border overflow-hidden transition-colors ${
                              user.currentSelectedPackage?._id === pkg._id
                                ? "border-green-500 bg-green-500/5"
                                : "border-gray-700"
                            }`}
                          >
                            {/* Package Header */}
                            <button
                              onClick={() => togglePackage(pkg._id)}
                              className="w-full p-4 flex items-center justify-between hover:bg-gray-700/50 transition-colors"
                            >
                              <div className="flex items-center gap-3 flex-1 text-left">
                                <Package className="text-amber-400" size={20} />
                                <div>
                                  <p className="text-white font-semibold">
                                    {pkg.name}
                                  </p>
                                  <p className="text-gray-400 text-sm">
                                    {pkg.description}
                                  </p>
                                </div>
                              </div>

                              {/* Package Stats */}
                              <div className="flex items-center gap-4 mr-3">
                                <div className="text-right">
                                  <p className="text-gray-400 text-xs">
                                    Messages
                                  </p>
                                  <p className="text-white font-bold">
                                    {pkg.messageCount}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-gray-400 text-xs">Sent</p>
                                  <p className="text-white font-bold">
                                    {pkg.messages.length}
                                  </p>
                                </div>
                              </div>

                              {/* Expand Icon */}
                              <div className="text-gray-400">
                                {expandedPackage === pkg._id ? (
                                  <ChevronUp size={20} />
                                ) : (
                                  <ChevronDown size={20} />
                                )}
                              </div>
                            </button>

                            {/* Messages Section */}
                            {expandedPackage === pkg._id && (
                              <div className="border-t border-gray-700 bg-gray-900/50 p-4">
                                {pkg.messages.length === 0 ? (
                                  <div className="text-center py-6">
                                    <MessageSquare className="mx-auto text-gray-500 mb-2" />
                                    <p className="text-gray-400 text-sm">
                                      No messages sent with this package
                                    </p>
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    <p className="text-gray-400 text-sm font-semibold mb-3">
                                      Messages ({pkg.messages.length})
                                    </p>
                                    <div className="max-h-64 overflow-y-auto space-y-2">
                                      {pkg.messages.map((msg) => (
                                        <div
                                          key={msg._id}
                                          className={`rounded-lg border p-3 text-sm ${getStatusColor(msg.status)}`}
                                        >
                                          <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                              {getStatusIcon(msg.status)}
                                              <span className="font-semibold capitalize">
                                                {msg.status}
                                              </span>
                                            </div>
                                            <span className="text-xs opacity-75">
                                              {formatDate(msg.createdAt)}
                                            </span>
                                          </div>
                                          <p className="text-xs font-mono mb-1">
                                            To: {msg.recipient}
                                          </p>
                                          <p className="wrap-break-word">
                                            {msg.message}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
