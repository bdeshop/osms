"use client";

import { useEffect, useState, useMemo } from "react";
import { UserRole } from "@/types/user.role";
import DashboardSidebar from "./DashboardSidebar";
import { Loader } from "lucide-react";

export default function DashboardSidebarWrapper() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRole = () => {
      try {
        const userStr = localStorage.getItem("user");
        console.log(
          "DashboardSidebarWrapper - Loading user from localStorage:",
          userStr,
        );

        if (userStr) {
          const user = JSON.parse(userStr);
          const userRole = user.role as UserRole;
          console.log("DashboardSidebarWrapper - User role:", userRole);
          setRole(userRole || "USER");
        } else {
          console.log(
            "DashboardSidebarWrapper - No user found in localStorage",
          );
          setRole("USER");
        }
      } catch (error) {
        console.error(
          "DashboardSidebarWrapper - Failed to get user role:",
          error,
        );
        setRole("USER");
      } finally {
        setIsLoading(false);
      }
    };

    // Load immediately
    loadRole();

    // Also listen for storage changes
    const handleStorageChange = () => {
      console.log("DashboardSidebarWrapper - Storage changed, reloading role");
      loadRole();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Memoize the sidebar to prevent re-renders
  const sidebar = useMemo(() => {
    if (isLoading) {
      return (
        <div className="hidden lg:flex w-64 min-h-screen border-r border-white/5 bg-gray-900/40 backdrop-blur-2xl flex-col sticky top-0 h-screen overflow-hidden items-center justify-center">
          <Loader className="animate-spin text-amber-500" size={24} />
        </div>
      );
    }
    if (!role) return null;
    return <DashboardSidebar role={role} />;
  }, [role, isLoading]);

  return sidebar;
}
