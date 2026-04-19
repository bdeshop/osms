"use client";

import { useEffect, useState, useMemo } from "react";
import { UserRole } from "@/types/user.role";
import DashboardSidebar from "./DashboardSidebar";

export default function DashboardSidebarWrapper() {
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        const userRole = user.role as UserRole;
        setRole(userRole || "USER");
      }
    } catch (error) {
      console.error("Failed to get user role:", error);
      setRole("USER");
    }
  }, []);

  // Memoize the sidebar to prevent re-renders
  const sidebar = useMemo(() => {
    if (!role) return null;
    return <DashboardSidebar role={role} />;
  }, [role]);

  return sidebar;
}
