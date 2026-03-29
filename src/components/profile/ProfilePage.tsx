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
  Lock,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "ADMIN":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "USER":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="relative">
          <Loader className="animate-spin text-amber-500" size={48} />
          <div className="absolute inset-0 blur-xl bg-amber-500/20 animate-pulse pointer-events-none" />
        </div>
      </div>
    );
  }

  const userInitials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : "??";

  return (
    <div className="min-h-screen bg-gray-950 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase">Identity</h1>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2">Manage your global profile settings</p>
          </div>
          <div className="bg-white/5 border border-white/5 px-4 py-2 rounded-2xl backdrop-blur-md">
             <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">ID: {user?._id.slice(-8)}</span>
          </div>
        </motion.div>

        {/* Profile Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative bg-gray-900/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/5 p-8 md:p-12 shadow-2xl overflow-hidden group"
        >
          {/* Subtle Background Art */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px] pointer-events-none group-hover:bg-amber-500/10 transition-colors duration-1000" />
          
          <div className="relative z-10">
            {/* Avatar & Basic Info */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
              <div className="relative group/avatar">
                <div className="w-32 h-32 rounded-[2rem] bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center text-gray-950 text-5xl font-black shadow-2xl shadow-amber-500/30 transform group-hover/avatar:rotate-6 transition-transform duration-500">
                  {userInitials}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-gray-900 shadow-lg" />
              </div>
              
              <div className="text-center md:text-left pt-2">
                <h2 className="text-3xl font-black text-white mb-2">{user?.firstName} {user?.lastName}</h2>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getRoleColor(user?.role || "")}`}>
                    {user?.role.replace("_", " ")}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-white/5 px-3 py-1.5 rounded-full">
                    <Calendar size={14} className="text-amber-500" />
                    JOINED {new Date(user?.createdAt || "").getFullYear()}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats/Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white/5 border border-white/5 p-6 rounded-3xl group/item hover:bg-white/10 transition-colors">
                <div className="p-3 bg-amber-500/10 rounded-2xl w-fit mb-4 text-amber-500 group-hover/item:scale-110 transition-transform">
                  <Mail size={20} />
                </div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Authenticated Email</p>
                <p className="text-white font-bold truncate">{user?.email}</p>
              </div>

              <div className="bg-white/5 border border-white/5 p-6 rounded-3xl group/item hover:bg-white/10 transition-colors">
                <div className="p-3 bg-blue-500/10 rounded-2xl w-fit mb-4 text-blue-500 group-hover/item:scale-110 transition-transform">
                  <Shield size={20} />
                </div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Access Level</p>
                <p className="text-white font-bold">{user?.role.replace("_", " ")}</p>
              </div>

              <div className="bg-white/5 border border-white/5 p-6 rounded-3xl group/item hover:bg-white/10 transition-colors">
                <div className="p-3 bg-green-500/10 rounded-2xl w-fit mb-4 text-green-500 group-hover/item:scale-110 transition-transform">
                  <Lock size={20} />
                </div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Security Status</p>
                <p className="text-white font-bold">{user?.isActive ? "Verified & Active" : "Suspended"}</p>
              </div>

              <div className="bg-white/5 border border-white/5 p-6 rounded-3xl group/item hover:bg-white/10 transition-colors">
                <div className="p-3 bg-purple-500/10 rounded-2xl w-fit mb-4 text-purple-500 group-hover/item:scale-110 transition-transform">
                  <ExternalLink size={20} />
                </div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Session Region</p>
                <p className="text-white font-bold">Bangladeshi Gateway</p>
              </div>
            </div>

            {/* Action Footer */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-gray-950 font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-amber-500/20 uppercase text-xs tracking-widest"
              >
                <Edit2 size={16} />
                Request Data Update
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="flex-1 bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-500 font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all border border-white/10 hover:border-red-500/30 uppercase text-xs tracking-widest"
              >
                <LogOut size={16} />
                Terminate Session
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Audit Log / Footer Info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900/20 border border-white/5 rounded-3xl p-6 text-center"
        >
          <div className="flex items-center justify-center gap-2 text-gray-600 font-bold text-[10px] uppercase tracking-tighter">
            <Shield size={12} />
            <span>Encrypted Session • Node 04/OSMS • Valid for 24h</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
