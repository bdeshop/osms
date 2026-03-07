"use client";

import { useState, useEffect } from "react";
import { authAPI } from "@/services/api";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Loader,
  LogOut,
  Edit2,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface UserData {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const response = (await authAPI.getCurrentUser()) as any;
      setUser(response.data);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    router.push("/adminLogin");
  };

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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "👑";
      case "ADMIN":
        return "🔐";
      case "USER":
        return "👤";
      default:
        return "❓";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <Loader className="animate-spin text-amber-500" size={40} />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-red-400">
            {error || "User not found"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-gray-400">
            View and manage your account information
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-2xl">
          {/* Avatar Section */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-700">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-amber-500/50">
              {user.firstName[0]}
              {user.lastName[0]}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-gray-400 mt-1">{user.email}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-2xl">{getRoleIcon(user.role)}</span>
                <span
                  className={`px-3 py-1 rounded-lg text-sm font-semibold border ${getRoleColor(
                    user.role,
                  )}`}
                >
                  {user.role.replace("_", " ")}
                </span>
              </div>
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-6 mb-8">
            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Mail className="text-amber-400" size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Email Address</p>
                <p className="text-white text-lg font-semibold">{user.email}</p>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Shield className="text-blue-400" size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Role</p>
                <p className="text-white text-lg font-semibold">
                  {user.role.replace("_", " ")}
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <User className="text-green-400" size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Account Status</p>
                <p className="text-white text-lg font-semibold">
                  {user.isActive ? (
                    <span className="text-green-400">Active</span>
                  ) : (
                    <span className="text-red-400">Inactive</span>
                  )}
                </p>
              </div>
            </div>

            {/* Joined Date */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Calendar className="text-purple-400" size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Member Since</p>
                <p className="text-white text-lg font-semibold">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-8 border-t border-gray-700">
            <button className="flex-1 bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/40 hover:shadow-amber-500/60">
              <Edit2 size={18} />
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <h3 className="text-white font-semibold mb-3">Account Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">User ID</p>
              <p className="text-gray-300 font-mono text-xs break-all">
                {user._id}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Account Created</p>
              <p className="text-gray-300">
                {new Date(user.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
