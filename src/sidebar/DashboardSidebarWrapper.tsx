"use client";

import { useEffect, useState } from "react";
import { UserRole } from "@/types/user.role";
import DashboardSidebar from "./DashboardSidebar";

export default function DashboardSidebarWrapper() {
  const [role, setRole] = useState<UserRole>("USER");
  const [isLoading, setIsLoading] = useState(true);

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
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return null;
  }

  return <DashboardSidebar role={role} />;
}
