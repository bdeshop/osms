"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BellIcon, ChevronDownIcon, LogOut, User, Zap, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { authAPI } from "@/services/api";

interface UserData {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  balance: number;
}

export default function DashboardHeader() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUser();
    const interval = setInterval(fetchCurrentUser, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = (await authAPI.getCurrentUser()) as any;
      setUser(response.data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    router.push("/adminLogin");
  };

  const handleProfileClick = () => {
    router.push("/profile");
  };

  const userInitials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : "U";
  const userName = user ? `${user.firstName} ${user.lastName}` : "User";

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-16 w-full bg-gray-900/40 backdrop-blur-xl border-b border-white/5 flex items-center justify-end px-6 sticky top-0 z-40"
    >
      <div className="flex items-center gap-6 text-white">
        {/* Language */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-amber-400 transition-colors">
            <span className="text-lg grayscale hover:grayscale-0 transition-all">🇺🇸</span>
            <span>English</span>
            <ChevronDownIcon size={12} />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-gray-900/90 backdrop-blur-lg border-white/10"
          >
            <DropdownMenuItem className="text-white hover:bg-amber-500/20 hover:text-amber-400 font-bold text-xs uppercase cursor-pointer">
              English
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-amber-500/20 hover:text-amber-400 font-bold text-xs uppercase cursor-pointer">
              বাংলা
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notification */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 transition-all active:scale-90"
        >
          <BellIcon size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full border-2 border-gray-900 shadow-lg shadow-amber-500/20 animate-pulse" />
        </Button>

        {/* Message Balance Display */}
        <div className="flex items-center gap-3 bg-white/5 px-4 py-1.5 rounded-2xl border border-white/5 group hover:border-amber-500/30 transition-all duration-500">
           <div className="bg-amber-500/10 p-1.5 rounded-lg text-amber-500 group-hover:scale-110 transition-transform">
             <Zap size={14} />
           </div>
           <div className="flex flex-col leading-tight">
             <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Messages Left</span>
             <span className="font-mono font-bold text-white text-sm">
               {(user as any)?.remainingMessages?.toLocaleString() || "0"}
             </span>
           </div>
        </div>

        {/* Balance Display */}
        <div className="flex items-center gap-3 bg-white/5 px-4 py-1.5 rounded-2xl border border-white/5 group hover:border-amber-500/30 transition-all duration-500">
           <div className="bg-amber-500/10 p-1.5 rounded-lg text-amber-500 group-hover:scale-110 transition-transform">
             <Wallet size={14} />
           </div>
           <div className="flex flex-col leading-tight">
             <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Available Funds</span>
             <span className="font-mono font-bold text-white text-sm">
               ৳{" "}
               {user?.balance?.toLocaleString("en-US", {
                 minimumFractionDigits: 2,
                 maximumFractionDigits: 2,
               }) || "0.00"}
             </span>
           </div>
        </div>

        {/* Recharge Button */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/user/recharge")}
          className="h-9 px-5 bg-linear-to-r from-amber-400 to-amber-600 text-gray-950 text-xs rounded-xl font-black uppercase tracking-widest transition-all shadow-lg shadow-amber-500/20"
        >
          Recharge
        </motion.button>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 pl-2 border-l border-white/10 cursor-pointer group">
              <div className="text-right leading-tight hidden sm:block">
                <p className="text-xs font-black text-white group-hover:text-amber-400 transition-colors uppercase tracking-tight">{userName}</p>
                <div className="flex items-center justify-end gap-1">
                  <span className={`w-1 h-1 rounded-full ${user?.isActive ? "bg-green-500" : "bg-gray-500"}`} />
                  <p className="text-[9px] font-bold text-gray-500 uppercase">
                    {user?.isActive ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              <div className="relative">
                <Avatar className="h-10 w-10 border-2 border-white/5 group-hover:border-amber-500/30 transition-all duration-500 p-0.5">
                  <AvatarImage src="/avatar.jpg" className="rounded-full overflow-hidden" />
                  <AvatarFallback className="bg-linear-to-br from-amber-400 to-amber-600 text-gray-950 font-black">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                {user?.isActive && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full" />
                )}
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-64 bg-gray-900/90 backdrop-blur-xl border-white/10 p-2 rounded-2xl"
          >
            {/* User Info Section */}
            <div className="px-4 py-4 mb-2 bg-white/5 rounded-xl border border-white/5">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-10 w-10 border border-amber-500/30">
                  <AvatarFallback className="bg-amber-500/20 text-amber-500 font-bold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-black text-white">{userName}</p>
                  <p className="text-[10px] text-gray-500 font-medium truncate max-w-[140px]">{user?.email}</p>
                </div>
              </div>
              <div className="bg-amber-500/10 px-2 py-1 rounded inline-block">
                <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">
                  {user?.role.replace("_", " ")}
                </span>
              </div>
            </div>

            {/* Menu Items */}
            <DropdownMenuItem
              onClick={handleProfileClick}
              className="flex items-center gap-3 p-3 text-sm font-bold text-gray-400 hover:bg-amber-500/10 hover:text-amber-400 transition-all rounded-xl cursor-pointer group"
            >
              <User size={18} className="text-gray-500 group-hover:text-amber-500 transition-colors" />
              <span>Personal Profile</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-white/5 my-1" />

            {/* Logout */}
            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center gap-3 p-3 text-sm font-bold text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition-all rounded-xl cursor-pointer group"
            >
              <LogOut size={18} className="text-red-500/50 group-hover:text-red-500 transition-colors" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
}
