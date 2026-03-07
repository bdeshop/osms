"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BellIcon, ChevronDownIcon, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
}

export default function DashboardHeader() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUser();
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
    <header className="h-16 w-full bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 flex items-center justify-end px-6">
      <div className="flex items-center gap-6 text-white">
        {/* Language */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 text-sm hover:text-amber-400 transition-colors">
            <span className="text-lg">🇺🇸</span>
            <span>English</span>
            <ChevronDownIcon size={14} />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-gray-800 border-gray-700"
          >
            <DropdownMenuItem className="text-white hover:bg-amber-500/20 hover:text-amber-400">
              English
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-amber-500/20 hover:text-amber-400">
              বাংলা
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notification */}
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-300 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
        >
          <BellIcon size={18} />
        </Button>

        {/* Balance */}
        <div className="flex flex-col border-l border-gray-600 pl-4 leading-tight">
          <span className="text-xs text-gray-400">Balance</span>
          <span className="font-semibold text-amber-400">৳ 20,000.00</span>
        </div>

        {/* Recharge Button */}
        <Button className="h-8 px-4 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-gray-900 text-sm rounded-md font-semibold transition-all">
          Recharge
        </Button>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 border-l border-gray-600 pl-4 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="text-right leading-tight">
                <p className="text-sm font-medium text-white">{userName}</p>
                <p className="text-xs text-green-400">
                  {user?.isActive ? "Active" : "Inactive"}
                </p>
              </div>
              <Avatar className="h-9 w-9 border border-amber-500/30">
                <AvatarImage src="/avatar.jpg" />
                <AvatarFallback className="bg-amber-500/20 text-amber-400">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-gray-800 border-gray-700"
          >
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-700">
              <p className="text-sm font-semibold text-white">{userName}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
              <p className="text-xs text-amber-400 mt-1">
                {user?.role.replace("_", " ")}
              </p>
            </div>

            {/* Menu Items */}
            <DropdownMenuItem
              onClick={handleProfileClick}
              className="text-gray-300 hover:bg-amber-500/20 hover:text-amber-400 cursor-pointer"
            >
              <User size={16} className="mr-2" />
              View Profile
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-gray-700" />

            {/* Logout */}
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-400 hover:bg-red-500/20 hover:text-red-300 cursor-pointer"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
